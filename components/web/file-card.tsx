"use client"
import { Doc, Id } from "@/convex/_generated/dataModel"
import {
  EllipsisVertical,
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  Trash2,
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
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
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
import Image from "next/image"
import { da } from "zod/locales"

const FileCardACtion = ({ file }: { file: Doc<"files"> }) => {
  const deleteFile = useMutation(api.files.deleteFile)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
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
          <DropdownMenuItem
            onClick={() => setIsConfirmOpen(true)}
            className="text-destructive/90"
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const FileCard = ({ file }: { file: Doc<"files"> & { fileUrl: string | null } }) => {
  const data = file
  console.log(data)
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {typeIcons[data.type]}
          {data.name}
        </CardTitle>
        <CardAction>
          <FileCardACtion file={data} />
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
      <CardFooter className="flex items-center justify-center">
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
