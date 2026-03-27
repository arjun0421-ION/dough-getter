import { getStripe } from "./config";

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  appUrl: string
): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId },
    success_url: `${appUrl}/app/upgrade?success=1`,
    cancel_url: `${appUrl}/app/upgrade`,
  });

  return session.url!;
}

export async function createPortalSession(
  stripeCustomerId: string,
  appUrl: string
): Promise<string> {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${appUrl}/app/profile`,
  });
  return session.url;
}
