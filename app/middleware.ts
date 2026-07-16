import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/me',
  '/invoices',
  '/edit-profile',
  '/booking',
  '/wishlist',
  '/promo-codes',
]

// Routes that should redirect to /me if already authenticated
const AUTH_ONLY_ROUTES = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // ✅ AUTH-01: Protect routes — redirect to login if not authenticated
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Redirect already-logged-in users away from login/signup
  if (token && AUTH_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  // ✅ CSP Configuration
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com https://www.instagram.com https://translate.google.com https://translate.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdn.jsdelivr.net;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https://dashboard.zoeholidays.com https://www.google-analytics.com https://graph.instagram.com https://*.cdninstagram.com https://*.fbcdn.net https://translate.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com https://www.paypalobjects.com;
    media-src 'self' blob: data: https:;
    frame-src 'self' https://www.google.com https://www.instagram.com https://translate.google.com https://www.paypal.com https://www.sandbox.paypal.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
`

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm)$).*)',
  ],
}