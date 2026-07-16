import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function POST(req: NextRequest) {
  try {
    const { email, password, referralCode } = await req.json()

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
