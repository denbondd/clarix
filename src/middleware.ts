import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],

}

export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (!auth.isPublicRoute && !auth.userId) {
      if (req.nextUrl.pathname.startsWith('/api')) {
        return new NextResponse(undefined, { status: 401 })
      }
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
  publicRoutes: []
})