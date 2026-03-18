import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server"

// Add webhook route here 👇
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)", // ✅ allow webhooks
])

export default clerkMiddleware(async (auth, req) => {

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
