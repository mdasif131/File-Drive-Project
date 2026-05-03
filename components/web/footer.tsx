import Link from "next/link"

export function Footer() {
  return (
    <div className="mt-12 flex h-40 items-center ">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <Link href={"/"}>
          <h1 className="text-lg font-bold">
            File
            <span className="font-black tracking-wide text-primary">Drive</span>
          </h1>
        </Link>

        <Link className="text-primary/50 hover:text-primary" href="/privacy">
          Privacy Policy
        </Link>
        <Link
          className="text-primary/50 hover:text-primary"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link className="text-primary/50 hover:text-primary" href="/about">
          About
        </Link>
      </div>
    </div>
  )
}
