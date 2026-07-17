import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/app/api/lib/rate-limit'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limit by IP to prevent brute-force attacks
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, retryAfterMs } = checkRateLimit(`login:${ip}`, { windowMs: 60_000, maxRequests: 10 })

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const { identifier, password } = await req.json()

    // ✅ SECURITY: Basic input validation
    if (!identifier || typeof identifier !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (identifier.length > 254 || password.length > 128) {
      return NextResponse.json({ error: 'Invalid input length' }, { status: 400 })
    }

    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await strapiRes.json()

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Login failed' },
        { status: strapiRes.status }
      )
    }

    // Fetch full user profile server-side
    const userRes = await fetch(`${STRAPI_URL}/api/users/me?populate=profile`, {
      headers: { Authorization: `Bearer ${data.jwt}` },
      cache: 'no-store',
    })
    const rawUser = await userRes.json()

    // Set secure httpOnly cookie — never readable by JS
    const cookieStore = await cookies()
    cookieStore.set('authToken', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ user: { ...rawUser, token: data.jwt } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
