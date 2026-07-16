import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

    const res = await fetch(`${STRAPI_URL}/api/bookings/validate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN || userToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    // 400 = price changed — pass through so client can show updated price
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
