import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/files(.*)", "/dashboard(.*)"])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect() 
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|ttf|woff2?)).*)",
    "/(api|trpc)(.*)",
  ],
}
