import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json()

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
