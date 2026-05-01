import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "File Drive",
  description: "Insights, thoughts, and trends form our team.",
  category: "file storage",
  authors: [{ name: "MD ASIF CHOWDHURY" }],
}

export default function LandingPage() {
  return (
    <div className="relative">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* TOP BACKGROUND */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto max-w-2xl py-8 text-center">
          <Image
            src="/as_designer1.png"
            width={200}
            height={200}
            alt="file drive logo"
            className="mb-8 inline-block border-none"
          />

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            The most convenient way to upload and share files at work
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Create an account and begin organizing your files in under a minute.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard/files"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>

            <a href="#" className="text-sm font-semibold text-muted-foreground">
              Learn more →
            </a>
          </div>
        </div>

        {/* BOTTOM BACKGROUND */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
