import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("confirmation");

  if (!token) {
    return NextResponse.json({ error: "Missing confirmation token" }, { status: 400 });
  }

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const url = `${STRAPI_URL}/api/auth/email-confirmation?confirmation=${token}`;

  const res = await fetch(url, { method: "GET" });
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    return NextResponse.redirect("https://zoeholidays.com/login");
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
