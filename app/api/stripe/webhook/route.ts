import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, handleWebhookEvent } from "@/lib/stripe/webhook";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = verifyWebhookSignature(body, signature);
    await handleWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
