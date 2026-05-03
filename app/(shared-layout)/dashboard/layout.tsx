import SideNav from "@/components/web/side-nav"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "File Drive Dashboard",
  description: "Insights, thoughts, and trends form our team.",
  category: "file storage",
  authors: [{ name: "MD ASIF CHOWDHURY" }],
}
export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container mx-auto min-h-screen pt-12">
      <div className="flex">
        <SideNav />

        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
