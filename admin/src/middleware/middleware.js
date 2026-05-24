import { NextResponse } from 'next/server';

/**
 * Next.js Middleware — Server-side route protection
 *
 * This runs BEFORE the page renders — provides a first layer of security.
 * The client-side ProtectedRoute is the second layer.
 *
 * In production:
 *   - Decode JWT from cookies here instead of reading localStorage
 *   - Verify the token signature with your secret key
 *   - Extract role from the verified payload
 *
 * For this demo we use a simple cookie check.
 */

// Routes that need authentication (no specific role needed)
const PROTECTED_ROUTES = [
  '/products',
  '/orders',
];

// Routes that need specific roles
const ROLE_ROUTES = {
  '/admin': ['admin', 'super_admin'],
  '/admin/users': ['admin', 'super_admin', 'moderator'],
  '/admin/settings': ['admin', 'super_admin'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read auth from cookie (in production: verify JWT here)
  // For demo purposes only — replace with real JWT verification
  const userRole = request.cookies.get('user_role')?.value;
  const isLoggedIn = !!userRole;

  // Redirect to login if not authenticated
  if (PROTECTED_ROUTES.some(r => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based routes
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to these paths only (skip static files, api routes)
  matcher: [
    '/products/:path*',
    '/orders/:path*',
    '/admin/:path*',
  ],
};
