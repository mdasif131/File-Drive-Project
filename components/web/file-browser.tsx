"use client"

import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { GridIcon, Loader2, RowsIcon, SearchX } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import FileCard from "@/components/web/file-card"
import SearchBar from "@/components/web/search-bar"
import UploadButton from "@/components/web/upload-button"
import { api } from "@/convex/_generated/api"
import { DataTable } from "./DataTable/file-table"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { columns } from "./DataTable/columns"
import { Doc } from "@/convex/_generated/dataModel"
import { Label } from "../ui/label"
export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string
  favoritesOnly?: boolean
  deletedOnly?: boolean
}) {
  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all")

  const orgId =
    organization.isLoaded && user.isLoaded
      ? (organization.organization?.id ?? user.user?.id)
      : undefined

  const favorites =
    useQuery(api.files.getAllFavorite, orgId ? { orgId } : "skip") ?? []
  const fileType: Doc<"files">["type"] | undefined = type === "all" ? undefined : type
  const files = useQuery(
    api.files.getFile,
    orgId
      ? {
          orgId,
          query,
          favorites: favoritesOnly,
          deletedOnly,
          type: fileType,
        }
      : "skip"
  )
  const modifiedFiles = files?.map((file) => ({
    ...file,
    isFavorited: (favorites ?? []).some(
      (favorite) => favorite.fileId === file._id
    ),
  }))

 
  const isLoading = modifiedFiles === undefined
  const isEmpty = !isLoading && modifiedFiles.length === 0

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex items-center justify-between gap-4">
          <SearchBar query={query} setQuery={setQuery} />
          <UploadButton />
        </div>
      </div>
      <Tabs defaultValue="grid" className="flex-col">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger
              value="grid"
              className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <GridIcon />
              grid
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <RowsIcon />
              table
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Label htmlFor="type-file">
              Filter by type:
            </Label>
            <Select value={type} onValueChange={(newType)=> setType(newType as Doc<"files">["type"] | "all")}>
              <SelectTrigger id="type-file" className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">Pdf</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="grid">
          {!isLoading && modifiedFiles.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {modifiedFiles.map((file) => (
                <FileCard key={file._id} file={file} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles ?? []} />
        </TabsContent>
      </Tabs>
      {isLoading && (
        <div className="mt-24 flex w-full flex-col items-center gap-8">
          <Loader2 className="h-32 w-32 animate-spin text-muted-foreground/50" />
          <p className="text-2xl text-muted-foreground">
            Loading your files...
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
    </div>
  )
}
