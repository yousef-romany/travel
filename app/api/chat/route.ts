import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || "https://n8n.zoeholidays.com/webhook/zoeholidays-website-portal";
const N8N_SECRET = process.env.N8N_CHAT_SECRET || "Z@9Lx3#WmA1qF!7^C8H6EJrS$0n5kP2yB4eD@M%VfQKXhRz&UjT*";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, session } = body;

        if (!message || !session) {
            return NextResponse.json({ error: "Missing message or session" }, { status: 400 });
        }

        // 1. Generate JWT with HS256 signature
        const secret = new TextEncoder().encode(N8N_SECRET);
        const token = await new SignJWT({ message, session })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2m") // Token valid for 2 minutes
            .sign(secret);

        // 2. Send to n8n Webhook
        const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Create a logical header, n8n might expect body logic or header. 
                // Based on "Key Type Passphrase and Algorithm HS256", usually implies JWT auth.
                // However, the prompt says "give u the structure {message, session}". 
                // We will send the structure in body, and if n8n needs to verify, it might verify a header.
                // Let's send the plain structure as requested, AND the token in header if they configured an auth trigger.
                // OR if they want strict payload structure. 
                // "I will give u the structure {message, session} ... Key Type Passphrase ... HS256"
                // This implies the entire payload might need to be the JWT? Or authenticated by it.
                // Usually, webhooks with "Key Type" in n8n are for "Webhook (Header Auth)" or similar.
                // Let's send the JSON body as requested, and add "X-Zoe-Auth": token or standard "Authorization": Bearer <jwt>.
            },
            body: JSON.stringify({
                message,
                session
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
