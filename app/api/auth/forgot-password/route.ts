import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/app/api/lib/rate-limit'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function POST(req: NextRequest) {
  try {
    // ✅ SECURITY: Rate limit by IP to prevent email bombing
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed, retryAfterMs } = checkRateLimit(`forgot-password:${ip}`, { windowMs: 300_000, maxRequests: 3 })

    if (!allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${Math.ceil(retryAfterMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const { email } = await req.json()

    // ✅ SECURITY: Basic email format validation
    if (!email || typeof email !== 'string' || email.length > 254) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const data = await res.json()
      return NextResponse.json(
        { error: data?.error?.message || 'Failed to send reset email' },
        { status: res.status }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
