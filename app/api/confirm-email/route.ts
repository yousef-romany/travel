import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("confirmation");

  if (!token) {
    return NextResponse.json({ error: "Missing confirmation token" }, { status: 400 });
  }

  const url = `${STRAPI_URL}/api/auth/email-confirmation?confirmation=${token}`;
  const res = await fetch(url, { method: "GET", redirect: "manual" });
  const contentType = res.headers.get("content-type") || "";

  // Strapi sometimes returns HTML redirect on success
  if (contentType.includes("text/html") || res.status === 302 || res.status === 301) {
    // ✅ Strapi confirmed the email — now log the user in automatically
    // We need a login token. We redirect them to a success page and let them log in.
    return NextResponse.redirect(
      new URL("/email-confirmation?confirmed=true", req.url)
    );
  }

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error || "Verification failed" },
      { status: res.status }
    );
  }

  // ✅ Strapi returned JSON with JWT — auto-login the user
  if (data?.jwt) {
    const cookieStore = await cookies();
    cookieStore.set("authToken", data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Redirect to complete-profile after successful confirmation
    return NextResponse.redirect(
      new URL("/complete-profile?confirmed=true", req.url)
    );
  }

  return NextResponse.json(data, { status: res.status });
}
