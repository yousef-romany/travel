import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { checkRateLimit } from "@/app/api/lib/rate-limit";

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL;
const N8N_SECRET = process.env.N8N_CHAT_SECRET;

/** Max allowed message length (characters) */
const MAX_MESSAGE_LENGTH = 2000;

/** Timeout (ms) for external HTTP requests */
const GEO_TIMEOUT_MS = 3_000;
const N8N_TIMEOUT_MS = 30_000;

/** Validate that a string looks like a UUID v4 */
function isValidUUID(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Strip any non-printable / dangerous characters from user-supplied strings */
function sanitizeString(value: unknown, maxLength = 200): string | null {
    if (typeof value !== "string") return null;
    return value.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "").trim().slice(0, maxLength);
}

export async function POST(req: NextRequest) {
    try {
        // ✅ SECURITY: Validate required env vars at request time — no hardcoded fallbacks
        if (!N8N_WEBHOOK_URL || !N8N_SECRET) {
            return NextResponse.json({ error: "Chat service is not configured" }, { status: 503 });
        }

        // ✅ SECURITY: Rate limiting — 20 requests per minute per IP
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";

        const rateLimit = checkRateLimit(`chat:${ip}`, { windowMs: 60_000, maxRequests: 20 });
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many requests. Please slow down." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            );
        }

        // ✅ Parse and validate body
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!body || typeof body !== "object") {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { message, session, userInfo } = body as Record<string, unknown>;

        // Validate message
        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Missing or empty message" }, { status: 400 });
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return NextResponse.json(
                { error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` },
                { status: 400 }
            );
        }

        // Validate session (must be a UUID)
        if (!session || typeof session !== "string" || !isValidUUID(session)) {
            return NextResponse.json({ error: "Invalid or missing session ID" }, { status: 400 });
        }

        // Sanitize optional userInfo
        let sanitizedUserInfo: { name: string; phone: string } | null = null;
        if (userInfo && typeof userInfo === "object") {
            const ui = userInfo as Record<string, unknown>;
            const name = sanitizeString(ui.name, 100);
            const phone = sanitizeString(ui.phone, 30);
            if (name && phone) {
                sanitizedUserInfo = { name, phone };
            }
        }

        // ✅ Geolocation lookup with timeout
        let location = {
            country: "Unknown",
            countryCode: "Unknown",
            region: "Unknown",
            city: "Unknown",
            timezone: "Unknown",
            lat: null as number | null,
            lon: null as number | null,
        };

        if (ip !== "unknown") {
            try {
                const geoController = new AbortController();
                const geoTimer = setTimeout(() => geoController.abort(), GEO_TIMEOUT_MS);

                const geoResponse = await fetch(
                    `https://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,lat,lon`,
                    { signal: geoController.signal }
                );
                clearTimeout(geoTimer);

                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    if (geoData.status === "success") {
                        location = {
                            country: geoData.country || "Unknown",
                            countryCode: geoData.countryCode || "Unknown",
                            region: geoData.regionName || "Unknown",
                            city: geoData.city || "Unknown",
                            timezone: geoData.timezone || "Unknown",
                            lat: geoData.lat ?? null,
                            lon: geoData.lon ?? null,
                        };
                    }
                }
            } catch (geoError) {
                // Non-fatal — continue with unknown location
                if ((geoError as Error).name !== "AbortError") {
                    console.error("Geolocation lookup failed:", (geoError as Error).message);
                }
            }
        }

        // ✅ Generate JWT (lean payload — no geo in token)
        const secret = new TextEncoder().encode(N8N_SECRET);
        const token = await new SignJWT({ session, ip })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2m")
            .sign(secret);

        // ✅ Forward to n8n Webhook with timeout
        const n8nController = new AbortController();
        const n8nTimer = setTimeout(() => n8nController.abort(), N8N_TIMEOUT_MS);

        let n8nResponse: Response;
        try {
            n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: message.trim(),
                    session,
                    ip,
                    location,
                    userInfo: sanitizedUserInfo,
                }),
                signal: n8nController.signal,
            });
        } finally {
            clearTimeout(n8nTimer);
        }

        if (!n8nResponse.ok) {
            console.error("n8n Error:", n8nResponse.status, n8nResponse.statusText);
            return NextResponse.json({ error: "Failed to communicate with chatbot" }, { status: 502 });
        }

        const data = await n8nResponse.json();
        let responseData = data;

        // n8n might return a stringified JSON string
        if (typeof data === "string") {
            try {
                responseData = JSON.parse(data);
            } catch {
                responseData = { output: data };
            }
        } else if (Array.isArray(data) && data.length > 0) {
            // n8n often returns an array of items
            responseData = data[0];
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
