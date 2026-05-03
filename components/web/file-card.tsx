"use client"
import { Doc } from "@/convex/_generated/dataModel"
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import { Button } from "../ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { formatRelative } from "date-fns"
import Image from "next/image"
import { ReactNode } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { FileCardACtion } from "./DataTable/file-actions"


const FileCard = ({file}: {
  file: Doc<"files"> & { fileUrl: string | null; isFavorited?: boolean }
}) => {
  const data = file
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: data.userId,
  })
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], ReactNode>

  return (
    <Card className="py-4">
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
      <CardFooter className="flex-col px-2 pt-2">
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <h3 className="text-muted-foreground hover:text-foreground">
              {userProfile?.name}
            </h3>
          </div>
          <p className="text-muted-foreground font-stretch-50%">{`Uploaded on: ${formatRelative(new Date(file._creationTime), new Date())}`}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FileCard
