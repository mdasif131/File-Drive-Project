"use client"
import FileCard from "@/components/web/file-card"
import UploadButton from "@/components/web/upload-button"
import { api } from "@/convex/_generated/api"
import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFile = useQuery(api.files.getFile, orgId ? { orgId } : "skip")
  const isLoading = getFile === undefined;

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="mt-24 flex w-full flex-col items-center gap-8">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground" />
          <p className="text-2xl">Loading your images....</p>
        </div>
      )}
      {!isLoading && getFile.length === 0 && (
        <div className="mt-24 flex w-full flex-col items-center gap-4">
          <Image
            src="/empty.svg"
            alt="an image of a pictrue and directory icon"
            width={300}
            height={300}
          />
          <p className="text-muted-foreground">
            You have no files, uplaod one now
          </p>
          <UploadButton />
        </div>
      )}

      {!isLoading && getFile.length > 0 && (
        <>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold">Yours Files</h1>

            <UploadButton />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {getFile?.map((file) => (
              <div key={file._id}>
                <FileCard file={file} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
