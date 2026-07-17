import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/app/api/lib/rate-limit'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limit registration by IP to prevent spam accounts
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, retryAfterMs } = checkRateLimit(`register:${ip}`, { windowMs: 300_000, maxRequests: 3 })

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const { email, password, referralCode } = await req.json()

    // ✅ SECURITY: Input validation
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (email.length > 254 || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    if (password.length > 128) {
      return NextResponse.json({ error: 'Password is too long' }, { status: 400 })
    }

    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, email, password }),
    })

    const data = await strapiRes.json()

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Signup failed' },
        { status: strapiRes.status }
      )
    }

    // Create profile record
    await fetch(`${STRAPI_URL}/api/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({
        data: { user: data.user.id, isProfileCompleted: false },
      }),
    })

    // Process referral code (non-fatal)
    if (referralCode) {
      try {
        await fetch(`${STRAPI_URL}/api/referrals/use-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.jwt}`,
          },
          body: JSON.stringify({ referralCode, newUserId: data.user.documentId }),
        })
      } catch {
        // Referral errors are non-fatal
      }
    }

    // ✅ Auto-confirm: no email verification step.
    // Set cookie immediately so the user is logged in right after registration.
    const cookieStore = await cookies()
    cookieStore.set('authToken', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ user: { ...data.user, token: data.jwt } })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
