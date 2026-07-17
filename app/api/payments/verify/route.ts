import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// STRAPI_TOKEN is server-only (no NEXT_PUBLIC_ prefix) — never sent to browser
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || ''
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userToken = cookieStore.get('authToken')?.value

    if (!userToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // ✅ SECURITY: Validate required fields before forwarding to Strapi
    if (!body?.orderID || typeof body.orderID !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid orderID' }, { status: 400 })
    }

    if (!body?.bookingData || typeof body.bookingData !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid bookingData' }, { status: 400 })
    }

    const { bookingData } = body
    if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.travelDate || !bookingData.totalAmount || !bookingData.numberOfTravelers) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    if (typeof bookingData.totalAmount !== 'number' || bookingData.totalAmount <= 0) {
      return NextResponse.json({ error: 'Invalid totalAmount' }, { status: 400 })
    }

    const res = await fetch(`${STRAPI_URL}/api/bookings/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
