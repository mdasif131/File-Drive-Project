"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { useOrganization, useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { fileSchema } from "../schemas/fileSchema"
import { toast } from "sonner"

export default function Home() {
 const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFile = useQuery(api.files.getFile, orgId ? { orgId } : "skip")
  const createfile = useMutation(api.files.createFile)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const form = useForm({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })
const onSubmit = async (values: z.infer<typeof fileSchema>) => {
  if (!orgId) return

  try {
    const postUrl = await generateUploadUrl()

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file.type },
      body: values.file,
    })

    if (!result.ok) {
      throw new Error("File upload failed")
    }

    const { storageId } = await result.json()

    await createfile({
      name: values.title,
      fileId: storageId,
      orgId,
    })

    form.reset()
    setOpen(false)

    toast.success("File uploaded successfully")
  } catch (error) {
    toast.error("Upload failed", {
      description: String(error),
    })
  }
}

  return (
    <main className="container mx-auto pt-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Yours Files</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Upload file</Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>Upload your file here</DialogTitle>

              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="py-4">
                  <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="write your file title"
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="file"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Upload File</FieldLabel>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="write your blog title"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            field.onChange(file)
                          }}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Submit File</span>
                  )}
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        {getFile?.map((file) => (
          <div key={file._id}>{file.name}</div>
        ))}
      </div>
    </main>
  )
}
