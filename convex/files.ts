import { ConvexError, v } from "convex/values"
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { getUser } from "./users"
import { fileTypes } from "./schema"

async function hasAccessToOrg(ctx:QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
  const user = await getUser(ctx, tokenIdentifier)

  const hasAccess =
    user.orgIds.includes(orgId) ||
    user.tokenIdentifier.includes(orgId)
  return hasAccess;
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
    fileId:v.optional(v.id("_storage")),
    orgId: v.string(),
    type: fileTypes,
  },
  handler: async (ctx, args) => {
    
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("you must be logged in to upload a file")
    }
    const hasAccess = await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId)
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
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return []
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    )
     if (!hasAccess) {
       return []
     }
    const filesItem = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect()
    return await Promise.all(filesItem.map(async (file) => {
      const resolveFile = file.fileId !== undefined ? await ctx.storage.getUrl(file.fileId) : null;
      return {
        ...file,
        fileUrl: resolveFile,
      }
    }))
  },
})
export const deleteFile = mutation({
  args: {fileId: v.id("files")},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("you do not have access to this org")
    }
    const file = await ctx.db.get(args.fileId)
    if (!file) {
      throw new ConvexError("this file does not exist")
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId,
    )
    if (!hasAccess) {
      throw new ConvexError("you do not have access to delete this file")
    }
    return await ctx.db.delete(args.fileId)
  }
})