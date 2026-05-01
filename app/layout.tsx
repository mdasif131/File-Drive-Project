

import { Toaster } from "@/components/ui/sonner"
import ConvexClientProvider from "@/components/web/Header/ConvexClientProvider"
import { ThemeProvider } from "@/components/web/Header/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ClerkProvider>
          <ConvexClientProvider >
            <ThemeProvider>
              {children}
              <Toaster position="top-right" />
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
