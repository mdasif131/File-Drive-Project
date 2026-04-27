"use client"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { SignInButton, useOrganization, UserButton, useUser } from "@clerk/nextjs"
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react"

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  const getFile = useQuery(api.files.getFile, orgId ? {orgId} : "skip")
  const createfile = useMutation(api.files.createFile)
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Authenticated>
        <UserButton />
      </Authenticated>
      <Unauthenticated>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </Unauthenticated>
      <Button onClick={() => {
        if(!orgId) return
        createfile({ name: "hello World", orgId: orgId})
      }}>Click Me</Button>
      <div>
        {getFile?.map((file) => (
          <div key={file._id}>{file.name}</div>
        ))}
      </div>
    </div>
  )
}


