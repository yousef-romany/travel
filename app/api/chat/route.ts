import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || "https://n8n.zoeholidays.com/webhook/zoeholidays-website-portal";
const N8N_SECRET = process.env.N8N_CHAT_SECRET || "Z@9Lx3#WmA1qF!7^C8H6EJrS$0n5kP2yB4eD@M%VfQKXhRz&UjT*";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, session, userInfo } = body;

        if (!message || !session) {
            return NextResponse.json({ error: "Missing message or session" }, { status: 400 });
        }

        // Extract user's IP address
        const forwardedFor = req.headers.get("x-forwarded-for");
        const realIp = req.headers.get("x-real-ip");
        const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";

        // Get geolocation data from IP address
        let location = {
            country: "Unknown",
            countryCode: "Unknown",
            region: "Unknown",
            city: "Unknown",
            timezone: "Unknown",
            lat: null as number | null,
            lon: null as number | null
        };

        if (ip !== "unknown") {
            try {
                // Using ip-api.com free service (no API key required, 45 requests/minute limit)
                const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,timezone,lat,lon`);
                if (geoResponse.ok) {
                    const geoData = await geoResponse.json();
                    if (geoData.status === "success") {
                        location = {
                            country: geoData.country || "Unknown",
                            countryCode: geoData.countryCode || "Unknown",
                            region: geoData.regionName || "Unknown",
                            city: geoData.city || "Unknown",
                            timezone: geoData.timezone || "Unknown",
                            lat: geoData.lat || null,
                            lon: geoData.lon || null
                        };
                    }
                }
            } catch (geoError) {
                console.error("Geolocation lookup failed:", geoError);
                // Continue with unknown location
            }
        }

        // 1. Generate JWT with HS256 signature
        const secret = new TextEncoder().encode(N8N_SECRET);
        const token = await new SignJWT({ message, session, ip, location, userInfo })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2m") // Token valid for 2 minutes
            .sign(secret);

        // 2. Send to n8n Webhook
        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                message,
                session,
                ip,
                location,
                userInfo: userInfo || null
            }),
        });

        if (!n8nResponse.ok) {
            console.error("n8n Error:", n8nResponse.status, n8nResponse.statusText);
            return NextResponse.json({ error: "Failed to communicate with chatbot" }, { status: 502 });
        }

        const data = await n8nResponse.json();

        // Check if n8n returns simple text or object
        // Assuming it returns { response: "string" } or similar based on typical n8n flows
        // We pass it back as is.
        return NextResponse.json(data);

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
