import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/files(.*)", "/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
   console.log("middleware hit:", req.nextUrl.pathname)
  if (isProtectedRoute(req)) {
    auth.protect() //you redirect model:signIn"
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|ttf|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
}
