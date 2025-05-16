import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check for token in cookies (Next-Auth)
  let token = await getToken({ req: request });

  // If no token in cookies, check for token in Authorization header (CLI)
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7);
      // TODO: For production, implement proper JWT verification here using `jose` and NEXTAUTH_SECRET
      // For now, we assume if a Bearer token exists, it's a CLI request.
      // The actual token validation will happen in the API route itself.
      // This simplified `token` object is just to satisfy the middleware's later checks.
      token = { sub: "cli-user", isCli: true };
    }
  }

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isPublicRoute = pathname === "/";
  const isLegalRoute =
    pathname.startsWith("/privacy") || pathname.startsWith("/terms");
  const isVerificationRoute =
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/resend-verification");
  const isPasswordResetRoute =
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");
  const isInvitationRoute =
    pathname.startsWith("/api/invitations") ||
    pathname.includes("/invitations/") ||
    (pathname === "/register" &&
      request.nextUrl.search.includes("invitation="));
  const isApiRoute = pathname.startsWith("/api/");
  const isCliTokenRequest = token && (token as any).isCli;

  // Allow public routes, legal routes, API auth routes, verification routes, password reset routes, and invitation routes
  if (
    isPublicRoute ||
    isLegalRoute ||
    isApiAuthRoute ||
    isVerificationRoute ||
    isPasswordResetRoute ||
    isInvitationRoute
  ) {
    return NextResponse.next();
  }

  // If it's a CLI request to an API route, and we've constructed a placeholder token, let it pass.
  // The API route itself is responsible for validating the Bearer token.
  if (isCliTokenRequest && isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without any token (web or CLI)
  if (!token && !isAuthRoute) {
    // No need to check isCliRequest && isApiRoute here, covered above
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to projects if accessing auth routes with a valid web token
  if (token && !(token as any).isCli && isAuthRoute) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // Email verification check for non-CLI, non-API, authenticated users
  if (
    token &&
    !(token as any).isCli &&
    !isApiRoute &&
    !isAuthRoute &&
    !isVerificationRoute &&
    !isPasswordResetRoute
  ) {
    try {
      const skipVerificationCheckPaths = [
        "/api/auth/check-verification",
        "/api/invitations/verify",
      ];
      if (skipVerificationCheckPaths.includes(pathname)) {
        return NextResponse.next();
      }

      const verificationCheckUrl = new URL(
        "/api/auth/check-verification",
        request.url
      );
      const verificationResponse = await fetch(verificationCheckUrl, {
        headers: { Cookie: request.headers.get("cookie") || "" },
      });

      if (!verificationResponse.ok) {
        // console.error("Failed to check email verification status"); // Keep commented for prod
        return NextResponse.next();
      }

      const { verified } = await verificationResponse.json();

      if (!verified) {
        // For web routes, redirect to verification page
        return NextResponse.redirect(
          new URL("/verify-email?needsVerification=true", request.url)
        );
      }
    } catch (error) {
      // console.error("Error checking email verification:", error); // Keep commented for prod
      return NextResponse.next();
    }
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
