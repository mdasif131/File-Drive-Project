import { searchSchema } from "@/app/schemas/fileSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2, SearchIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import z from "zod"

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}) => {
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
   setQuery(values.query.trim())
   
  }
  return (
    <form className="w-full min-w-100" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="flex flex-row items-center gap-2">
        <Controller
          name="query"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="max-w-sm">
              <Input
                aria-invalid={fieldState.invalid}
                placeholder="Search you file"
                type="search"
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <div>
              <Loader2 className="size-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-2">
              <SearchIcon />
              Search
            </span>
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}

export default SearchBar
