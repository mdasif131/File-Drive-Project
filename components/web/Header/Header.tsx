"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs"
import { Authenticated, Unauthenticated } from "convex/react"

const Header = () => {
  return (
    <div className="border-b bg-muted py-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">
          File
          <span className="font-black tracking-wide text-primary">Drive</span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <Authenticated>
              <OrganizationSwitcher />
              <UserButton />
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button>Sign in</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
          <ThemeToggle/>
        </div>
      </div>
    </div>
  )
}

export default Header