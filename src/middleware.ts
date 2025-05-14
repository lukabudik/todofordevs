import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  const isApiAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = request.nextUrl.pathname === "/";

  // Allow public routes and API auth routes
  if (isPublicRoute || isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without token
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to projects if accessing auth routes with token
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
