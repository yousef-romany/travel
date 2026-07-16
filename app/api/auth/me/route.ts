import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const res = await fetch(`${STRAPI_URL}/api/users/me?populate=profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!res.ok) {
      // Token invalid or expired — clear the stale cookie
      const cookieStore2 = await cookies()
      cookieStore2.delete('authToken')
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const rawUser = await res.json()
    // Return token so in-memory state can use it for client-side Strapi calls
    return NextResponse.json({ user: { ...rawUser, token } })
  } catch {
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
