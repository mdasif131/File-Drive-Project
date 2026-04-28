import * as z from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
 const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "text/csv",
  "application/pdf",
]

export const fileSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title must be at most 120 characters")
      .trim(),
    file: z
      .instanceof(File)
      .refine((file) => file.size > 0, "file is required")
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "Image must be less than 5MB"
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, pdf, csv and .webp formats are supported"
      ),
  })
  .strict()

