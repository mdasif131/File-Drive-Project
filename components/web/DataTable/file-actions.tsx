import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  EllipsisVertical,
  FileIcon,
  StarHalf,
  StarIcon,
  Trash2,
  UndoIcon,
} from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

export const FileCardACtion = ({
  file,
}: {
  file: Doc<"files"> & {fileUrl: string | null, isFavorited?: boolean }
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
              This action will mark the file for our deletion process. files are
              deleted periodically
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
                {file?.isFavorited ? (
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
                className="cursor-pointer hover:text-primary!"
                onClick={() => {
                  if (file?.fileUrl) {
                    window.open(file.fileUrl, "_blank")
                  }
                }}
              >
              <FileIcon/> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  if (file.shouldDeleted) {
                    await restoreFile({ fileId: file._id })
                  } else {
                    setIsConfirmOpen(true)
                  }
                }}
                className="text-destructive/90"
              >
                {file.shouldDeleted ? (
                  <div className="flex items-center gap-1 text-primary/80">
                    <UndoIcon /> Restore
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
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
                {file?.isFavorited ? (
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
