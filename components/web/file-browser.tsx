"use client"

import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { Loader2, SearchX } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import FileCard from "@/components/web/file-card"
import SearchBar from "@/components/web/search-bar"
import UploadButton from "@/components/web/upload-button"
import { api } from "@/convex/_generated/api"

export default function FileBrowser({
  title,
  favoritesOnly,
}: {
  title: string
  favoritesOnly?: boolean
}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")

  const orgId =
    organization.isLoaded && user.isLoaded
      ? (organization.organization?.id ?? user.user?.id)
      : undefined

  const favorites = useQuery(api.files.getAllFavorite, orgId ? { orgId } : 'skip') ?? []
  const files = useQuery(
    api.files.getFile,
    orgId ? { orgId, query, favorites: favoritesOnly } : "skip"
  )

  const isLoading = files === undefined
  const isEmpty = !isLoading && files.length === 0

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex items-center justify-between gap-4">
          <SearchBar query={query} setQuery={setQuery} />
          <UploadButton />
        </div>
      </div>
      {isLoading && (
        <div className="mt-24 flex w-full flex-col items-center gap-8">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground/50" />
          <p className="text-2xl text-muted-foreground">
            Loading your library...
          </p>
        </div>
      )}

      {isEmpty && (
        <div className="mt-24 flex w-full flex-col items-center gap-4">
          {query ? (
            <>
              <SearchX className="h-40 w-40 text-muted-foreground/40" />
              <p className="text-xl text-muted-foreground">
                No files match "{query}"
              </p>
            </>
          ) : (
            <>
              <Image
                src="/empty.svg"
                alt="Empty state illustration"
                width={300}
                height={300}
              />
              <p className="text-lg text-muted-foreground">
                Your vault is empty. Let's fix that!
              </p>
              <UploadButton />
            </>
          )}
        </div>
      )}

      {!isLoading && files.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <FileCard favorites={favorites} key={file._id} file={file} />
          ))}
        </div>
      )}
    </div>
  )
}
