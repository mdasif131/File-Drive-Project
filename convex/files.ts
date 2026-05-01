import { ConvexError, v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { internalMutation, mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { fileTypes } from "./schema"

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    return null
  }
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first()
  if (!user) {
    return null;
}
  const hasAccess =
    user.orgIds.some(item => item.orgId === orgId) || user.tokenIdentifier.includes(orgId)
  if (!hasAccess) {
    return null;
  }
  return {user}
}
async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">
) {

  const file = await ctx.db.get(fileId)
  if (!file) {
    return null
  }
  const hasAccess = await hasAccessToOrg(
    ctx,
    file.orgId
  )
  if (!hasAccess) {
    return null
  }
  return { user: hasAccess.user, file }
}
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file")
    }
    return await ctx.storage.generateUploadUrl()
  },
})
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.optional(v.id("_storage")),
    orgId: v.string(),
    type: fileTypes,
  },
  handler: async (ctx, args) => {
  
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    )
    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org")
    }
    return await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      type: args.type,
    })
  },
})

export const getFile = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId)
    if (!hasAccess) {
      return []
    }
    const filesItem = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect()
    let filesWithUrls = await Promise.all(
      filesItem.map(async (file) => {
        const resolveFile =
          file.fileId !== undefined
            ? await ctx.storage.getUrl(file.fileId)
            : null
        return {
          ...file,
          fileUrl: resolveFile,
        }
      })
    )
    const searchTerm = args.query
    if (searchTerm) {
      return filesWithUrls.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (args.favorites) {
      const favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", hasAccess.user?._id).eq("orgId", args.orgId)
        )
        .collect()

      filesWithUrls = filesWithUrls.filter((file) =>
        favorites.some((favorite) => favorite.fileId === file._id)
      )
    }
    if (args.deletedOnly) {
      filesWithUrls = filesWithUrls.filter((file) => file.shouldDeleted
      )
    } else {
      filesWithUrls = filesWithUrls.filter((file) => !file.shouldDeleted)
    }
    return filesWithUrls;
  },
})

export const deleteAllFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const files = await ctx.db.query("files").withIndex("by_shouldDelete", q => q.eq("shouldDeleted", true)).collect();
    
    await Promise.all(files.map(async (file) => {
      if (file.fileId) {
        await ctx.storage.delete(file.fileId)
      }
      return await ctx.db.delete(file._id)
    }))
  },
})
export const deleteFile = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId)
    if (!access) {
      throw new ConvexError("no access to delete a file")
    }
    const isAdmin = access.user.orgIds.find((org) => org.orgId === access.file.orgId)?.role === "admin"
    if (!isAdmin) {
      throw new ConvexError("no access to files")
    }
    return await ctx.db.patch(args.fileId, {
      shouldDeleted: true,
    })
  },
})
export const deleteFileRestore = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId)
    if (!access) {
      throw new ConvexError("no access to delete a file")
    }
    const isAdmin = access.user.orgIds.find((org) => org.orgId === access.file.orgId)?.role === "admin"
    if (!isAdmin) {
      throw new ConvexError("no access to files")
    }
    return await ctx.db.patch(args.fileId, {
      shouldDeleted: false,
    })
  },
})
export const toggleFavorite = mutation({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const access = await hasAccessToFile(ctx, args.fileId)
    if (!access) {
      throw new ConvexError("no access to file")
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id)
      )
      .first()
    if (!favorites) {
      await ctx.db.insert("favorites", {
        fileId: access.file._id,
        userId: access.user._id,
        orgId: access.file.orgId,
      })
    } else {
      await ctx.db.delete(favorites._id)
    }
  },
})
export const getAllFavorite = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const hasAccess = await hasAccessToOrg(
      ctx,
      args.orgId
    )
    if (!hasAccess) {
      return []
    }

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q
          .eq("userId", hasAccess.user._id)
          .eq("orgId", args.orgId)
      ).collect();
    return favorites;
  },
})
