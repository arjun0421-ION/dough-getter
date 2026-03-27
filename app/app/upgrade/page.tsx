"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const PLANS = [
  {
    key: "free",
    name: "The Starter",
    price: "$0",
    period: "forever",
    features: [
      "3 calculator uses/day",
      "Single flour only",
      "Full community access",
    ],
  },
  {
    key: "monthly",
    name: "The Artisan",
    price: "$12",
    period: "/month",
    popular: true,
    features: [
      "Unlimited calculator uses",
      "Multi-flour blends (up to 5)",
      "Save & name formulas",
      "Full formula history",
      "Pro Baker badge",
      "Priority posts in feed",
    ],
    priceIdEnv: "NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID",
  },
  {
    key: "yearly",
    name: "The Bakery",
    price: "$39",
    period: "/month",
    features: [
      "Everything in The Artisan",
      "Early Backer badge",
      "Priority community support",
      "Lock in early pricing",
    ],
    priceIdEnv: "NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID",
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    const priceId =
      planKey === "monthly"
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      alert("Stripe is not yet configured. Add price IDs to .env.local");
      return;
    }

    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-brown">Upgrade Your Plan</h1>
        <p className="mt-2 text-text-mid">Unlock the full power of Dough Getter</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.key}
            hover={false}
            className={`relative ${plan.popular ? "border-caramel ring-1 ring-caramel/20" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="caramel">Most Popular</Badge>
              </div>
            )}

            <h3 className="text-lg font-semibold text-text-dark">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-brown">{plan.price}</span>
              <span className="text-text-light text-sm">{plan.period}</span>
            </div>

            <ul className="mt-6 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckIcon />
                  <span className="text-text-mid">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {plan.key === "free" ? (
                <Button variant="ghost" className="w-full" disabled>Current Plan</Button>
              ) : (
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  className="w-full"
                  loading={loading === plan.key}
                  onClick={() => handleSubscribe(plan.key)}
                >
                  Subscribe
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center mt-8 text-sm text-text-light">
        Cancel any time. Payments powered by Stripe.
      </p>
    </div>
  );
}
