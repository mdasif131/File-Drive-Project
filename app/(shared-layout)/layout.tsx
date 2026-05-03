import {Footer} from "@/components/web/footer"
import Header from "@/components/web/Header/Header"

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer/>
    </div>
  )
}
