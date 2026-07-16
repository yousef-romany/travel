import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// STRAPI_TOKEN is server-only (no NEXT_PUBLIC_ prefix) — never sent to browser
// Falls back to NEXT_PUBLIC_STRAPI_TOKEN for environments not yet migrated
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''
const STRAPI_TOKEN =
  process.env.STRAPI_TOKEN ||
  process.env.NEXT_PUBLIC_STRAPI_TOKEN ||
  ''

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userToken = cookieStore.get('authToken')?.value

    if (!userToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const res = await fetch(`${STRAPI_URL}/api/bookings/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Prefer the admin STRAPI_TOKEN for payment ops; fall back to user token
        Authorization: `Bearer ${STRAPI_TOKEN || userToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Payment verification failed' },
        { status: res.status }
      )
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
