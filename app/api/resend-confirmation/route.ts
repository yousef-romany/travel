import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/send-email-confirmation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { error: data?.error?.message || "Failed to resend confirmation" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
