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
  const isVerificationRoute =
    request.nextUrl.pathname.startsWith("/verify-email") ||
    request.nextUrl.pathname.startsWith("/resend-verification");
  const isPasswordResetRoute =
    request.nextUrl.pathname.startsWith("/forgot-password") ||
    request.nextUrl.pathname.startsWith("/reset-password");

  // Check if it's an invitation-related route
  const isInvitationRoute =
    request.nextUrl.pathname.startsWith("/api/invitations") ||
    request.nextUrl.pathname.includes("/invitations/") ||
    (request.nextUrl.pathname === "/register" &&
      request.nextUrl.search.includes("invitation="));

  // Allow public routes, API auth routes, verification routes, password reset routes, and invitation routes
  if (
    isPublicRoute ||
    isApiAuthRoute ||
    isVerificationRoute ||
    isPasswordResetRoute ||
    isInvitationRoute
  ) {
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

  // Check if email is verified for protected routes
  if (token && !isAuthRoute && !isVerificationRoute && !isPasswordResetRoute) {
    try {
      // Skip verification check for specific endpoints to avoid infinite loops or blocking critical paths
      const skipVerificationCheckPaths = [
        "/api/auth/check-verification",
        "/api/invitations/verify", // Add invitation verification to skip list
      ];
      if (skipVerificationCheckPaths.includes(request.nextUrl.pathname)) {
        return NextResponse.next();
      }

      // Call the API to check if email is verified
      const verificationCheckUrl = new URL(
        "/api/auth/check-verification",
        request.url
      );

      const verificationResponse = await fetch(verificationCheckUrl, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      });

      if (!verificationResponse.ok) {
        // If the API call fails, allow the request to proceed
        // This prevents blocking users due to API errors
        console.error("Failed to check email verification status");
        return NextResponse.next();
      }

      const { verified } = await verificationResponse.json();

      // If email is not verified, redirect to verification needed page
      if (!verified) {
        // Don't redirect API routes, just return 403
        if (request.nextUrl.pathname.startsWith("/api/")) {
          return new NextResponse(
            JSON.stringify({
              message: "Email verification required",
            }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        // Redirect to verification needed page
        return NextResponse.redirect(
          new URL("/verify-email?needsVerification=true", request.url)
        );
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
      // If there's an error, allow the request to proceed
      // This prevents blocking users due to errors
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
