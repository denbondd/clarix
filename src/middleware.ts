import { authMiddleware } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export default authMiddleware({
  afterAuth(auth, req, evt) {
    if (req.nextUrl.pathname.startsWith('/api') && !auth.userId && !auth.isPublicRoute) {
      return new NextResponse(null, { status: 401 })
    }
  },
  publicRoutes: []
})