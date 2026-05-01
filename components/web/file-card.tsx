"use client"
import { Doc, Id } from "@/convex/_generated/dataModel"
import {
  EllipsisVertical,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  StarHalf,
  StarIcon,
  Trash2,
  UndoIcon,
} from "lucide-react"
import { Button } from "../ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import Image from "next/image"
import { ReactNode, useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { useAuth } from "@clerk/nextjs"

const FileCardACtion = ({
  file,
  isFavorited,
}: {
  file: Doc<"files">
  isFavorited: boolean
}) => {
  const deleteFile = useMutation(api.files.deleteFile)
  const restoreFile = useMutation(api.files.deleteFileRestore)
  const toggleFavorite = useMutation(api.files.toggleFavorite)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { orgRole } = useAuth()
  const isAdmin = orgRole === "org:admin"
  const isMember = orgRole === "org:member"

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. files are deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({ fileId: file._id })
                toast.success("File deleted", {
                  description: "Your file is now gone from the system",
                })
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="size-5.5 cursor-pointer text-primary/90" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          {isAdmin ? (
            <>
              <DropdownMenuItem
                onClick={async () => {
                  await toggleFavorite({ fileId: file._id })
                }}
                className="cursor-pointer hover:text-primary!"
              >
                {isFavorited ? (
                  <span className="flex items-center gap-1">
                    <StarIcon /> Favorites
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <StarHalf /> Unfavorites
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async() => {
                  if (file.shouldDeleted) {
                   await restoreFile({fileId: file._id})
                  } else {
                    setIsConfirmOpen(true)
                  }
                }}
                className="text-destructive/90"
              >
                {file.shouldDeleted ? (
                  <div className="flex gap-1 items-center text-primary/80">
                    <UndoIcon /> Restore
                  </div>
                ) : (
                  <div className="flex gap-1 items-center">
                    <Trash2 />
                    Trash
                  </div>
                )}
              </DropdownMenuItem>
            </>
          ) : isMember ? (
            <>
              <DropdownMenuItem
                onClick={async () => {
                  await toggleFavorite({ fileId: file._id })
                }}
                className="cursor-pointer hover:text-primary!"
              >
                {isFavorited ? (
                  <span className="flex items-center gap-1">
                    <StarIcon /> Favorites
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <StarHalf /> Unfavorites
                  </span>
                )}
              </DropdownMenuItem>
            </>
          ) : (
            <p>Unauthorize</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const FileCard = ({
  file,
  favorites,
}: {
  file: Doc<"files"> & { fileUrl: string | null }
  favorites: Doc<"favorites">[]
}) => {
  const data = file
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>
  const isFavorited = favorites.some((favorite) => favorite.fileId === data._id)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {typeIcons[data.type]}
          {data.name}
        </CardTitle>
        <CardAction>
          <FileCardACtion isFavorited={isFavorited} file={data} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardContent className="flex h-50 items-center justify-center">
          {data.type === "image" && data.fileUrl && (
            <Image
              src={data.fileUrl}
              alt={data.name}
              width={200}
              height={100}
            />
          )}
          {data.type === "csv" && <GanttChartIcon className="h-20 w-20" />}
          {data.type === "pdf" && <FileTextIcon className="h-20 w-20" />}
        </CardContent>
      </CardContent>
      <CardFooter className="flex items-center justify-center pt-2">
        <Button
          onClick={() => {
            if (data.fileUrl) {
              window.open(data.fileUrl, "_blank")
            }
          }}
        >
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FileCard
