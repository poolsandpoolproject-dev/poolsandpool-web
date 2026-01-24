import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy for route protection (Next.js 16+)
 * Protects admin routes - requires authentication
 * 
 * In Next.js 16, middleware.ts was renamed to proxy.ts
 * This file runs before routes are rendered
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    // Skip login page - always allow access
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for admin token in cookie (server-side check)
    const adminToken = request.cookies.get("admin_token")?.value;

    // If no token, redirect to login
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      // Save the intended destination to redirect after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists - allow access and forward request
    return NextResponse.next();
  }

  // Allow all other routes (public routes)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all admin routes
    "/admin/:path*",
  ],
};
