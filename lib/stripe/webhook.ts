import Stripe from "stripe";
import { getStripe } from "./config";
import { createAdminClient } from "@/lib/supabase/admin";

export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId || !session.customer) break;

      // Determine plan from subscription
      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price.id;
      const plan =
        priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
          ? "yearly"
          : "monthly";

      await supabase
        .from("profiles")
        .update({
          plan,
          stripe_customer_id: session.customer as string,
        })
        .eq("id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const priceId = sub.items.data[0]?.price.id;

      const plan =
        sub.status === "active" || sub.status === "trialing"
          ? priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID
            ? "yearly"
            : "monthly"
          : "free";

      await supabase
        .from("profiles")
        .update({ plan })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from("profiles")
        .update({ plan: "free" })
        .eq("stripe_customer_id", sub.customer as string);
      break;
    }
  }
}
