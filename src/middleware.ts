import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";

// Define route types for better organization
type RouteType = "public" | "auth" | "api" | "protected";

// Debug mode - set to true to enable console logs for debugging
const DEBUG = process.env.NODE_ENV !== "production";

/**
 * Log debug information if debug mode is enabled
 */
function debug(...args: any[]) {
  if (DEBUG) {
    console.log("[Middleware]", ...args);
  }
}

/**
 * Extract and validate authentication token from request
 */
async function getAuthToken(request: NextRequest) {
  try {
    // Try to get token from cookies (Next-Auth)
    const token = await getToken({ req: request });

    if (token) {
      debug("Found token in cookies:", token.sub);
      return { token, source: "cookie" };
    }

    // If no token in cookies, check for token in Authorization header (CLI)
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      debug("Found Bearer token in Authorization header");
      // This simplified token object is just to satisfy the middleware's checks
      // The actual token validation happens in the API route
      return {
        token: { sub: "cli-user", isCli: true },
        source: "bearer",
      };
    }

    debug("No authentication token found");
    return { token: null, source: null };
  } catch (error) {
    debug("Error extracting token:", error);
    return { token: null, source: "error", error };
  }
}

/**
 * Determine the type of route being accessed
 */
function classifyRoute(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const search = request.nextUrl.search;

  // Public routes that don't require authentication
  if (
    pathname === "/" ||
    pathname.startsWith("/cli") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/resend-verification") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/invitations") ||
    pathname.includes("/invitations/") ||
    (pathname === "/register" && search.includes("invitation="))
  ) {
    return "public";
  }

  // Authentication routes
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return "auth";
  }

  // API routes
  if (pathname.startsWith("/api/")) {
    return "api";
  }

  // All other routes are protected
  return "protected";
}

/**
 * Check if a user's email is verified
 * Uses direct database access instead of fetch for reliability
 */
async function checkEmailVerification(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) {
      debug("User not found for email verification check");
      return false;
    }

    debug("Email verification status:", !!user.emailVerified);
    return !!user.emailVerified;
  } catch (error) {
    debug("Error checking email verification:", error);
    // In case of error, we'll allow access and let the UI handle verification
    return true;
  }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  // Step 1: Get authentication token
  const { token, source } = await getAuthToken(request);

  // Step 2: Classify the route
  const routeType = classifyRoute(request);
  debug("Route type:", routeType, "for path:", request.nextUrl.pathname);

  // Step 3: Apply access rules based on route type and authentication status

  // Public routes are always accessible
  if (routeType === "public") {
    debug("Allowing access to public route");
    return NextResponse.next();
  }

  // CLI requests to API routes with bearer token
  if (token && (token as any).isCli && routeType === "api") {
    debug("Allowing CLI access to API route");
    return NextResponse.next();
  }

  // Redirect to login if accessing protected route without token
  if (!token && routeType !== "auth") {
    debug("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to projects if accessing auth routes with a valid web token
  if (token && !(token as any).isCli && routeType === "auth") {
    debug("Authenticated user accessing auth route, redirecting to projects");
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // For protected routes with web authentication, check email verification
  if (token && !(token as any).isCli && routeType === "protected") {
    debug("Checking email verification for protected route");

    // Skip verification for certain paths
    const { pathname } = request.nextUrl;
    const skipVerificationCheckPaths = [
      "/api/auth/check-verification",
      "/api/invitations/verify",
    ];

    if (skipVerificationCheckPaths.includes(pathname)) {
      debug("Skipping verification check for special path");
      return NextResponse.next();
    }

    // Check email verification directly using the database
    const isVerified = await checkEmailVerification(token.sub as string);

    if (!isVerified) {
      debug("Email not verified, redirecting to verification page");
      return NextResponse.redirect(
        new URL("/verify-email?needsVerification=true", request.url)
      );
    }
  }

  // Allow access for all other cases
  debug("Access allowed");
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
