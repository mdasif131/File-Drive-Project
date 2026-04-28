"use client"

import { fileSchema } from "@/app/schemas/fileSchema"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useOrganization, useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function UploadButton() {
  const [open, setOpen] = useState<boolean>(false)
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined = undefined
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
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
      const fileType = values.file.type
      const postUrl = await generateUploadUrl()

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType },
        body: values.file,
      })

      if (!result.ok) {
        throw new Error("File upload failed")
      }

      const { storageId } = await result.json()
      const types = {
        "image/png": "image",
        "image/jpg": "image",
        "image/jpeg": "image",
        "image/webp": "image",
        "application/pdf": "pdf",
        "text/csv": "csv",
      } as Record<string, Doc<"files">["type"]>

      await createfile({
        name: values.title,
        fileId: storageId,
        orgId,
        type: types[fileType],
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
                      accept="/*"
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
  )
}
