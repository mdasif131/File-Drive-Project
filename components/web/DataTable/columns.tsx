"use client"

import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "convex/react"
import { formatRelative } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { FileCardACtion } from "./file-actions"

export const columns: ColumnDef<Doc<"files"> & {fileUrl: string | null, isFavorited?: boolean }>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: "Users",
    cell: ({ row }) => {
      const userProfile = useQuery(api.users.getUserProfile, {
        userId: row.original.userId,
      })
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <h3 className="text-muted-foreground hover:text-foreground">
            {userProfile?.name}
          </h3>
        </div>
      )
    },
  },
  {
    header: "Uploaded On",
    cell: ({ row }) => {
      const file = row.original
      return (
        <div>{formatRelative(new Date(file._creationTime), new Date())}</div>
      )
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const file = row.original
      return (
        <div>
          <FileCardACtion file={file} />
        </div>
      )
    },
  },
]
