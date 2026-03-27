import Link from "next/link";

const plans = [
  {
    name: "The Starter",
    price: "Free",
    period: "",
    description: "For the weekend warrior just getting into the craft.",
    cta: "Get Started Free",
    href: "/signup",
    popular: false,
    features: [
      "3 calculator uses per day",
      "Single flour recipes",
      "Full community access",
    ],
  },
  {
    name: "The Artisan",
    price: "$12",
    period: "/mo",
    description: "For the serious home baker ready to level up.",
    cta: "Start The Artisan",
    href: "/signup",
    popular: true,
    features: [
      "Unlimited calculator uses",
      "Multi-flour blends (up to 5)",
      "Save & name formulas",
      "Full formula history",
      "Pro Baker badge",
      "Priority posts in feed",
    ],
  },
  {
    name: "The Bakery",
    price: "$39",
    period: "/mo",
    description: "Full-time operations and larger teams that need room to grow.",
    cta: "Start The Bakery",
    href: "/signup",
    popular: false,
    features: [
      "Everything in The Artisan",
      "Early Backer badge",
      "Priority community support",
      "Lock in early pricing",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-caramel text-sm font-semibold uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown">
            Simple Pricing for Every Bakery
          </h2>
          <p className="mt-4 text-text-mid text-lg">
            Choose the plan that fits your batch size. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col transition-all ${
                plan.popular
                  ? "bg-brown text-white shadow-xl shadow-brown/20 scale-[1.02]"
                  : "bg-cream border border-border hover:border-caramel/30 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-caramel text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-serif text-xl font-bold ${plan.popular ? "text-white" : "text-brown"}`}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-5xl font-bold ${plan.popular ? "text-white" : "text-brown"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-text-light"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm leading-relaxed ${plan.popular ? "text-white/75" : "text-text-mid"}`}>
                  {plan.description}
                </p>
              </div>

              <Link href={plan.href} className="mb-8">
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.popular
                      ? "bg-caramel hover:bg-caramel-lt text-white shadow-md"
                      : "bg-white hover:bg-cream border border-border text-brown"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2.5 text-sm ${
                      i === 0 && plan.name !== "The Starter"
                        ? plan.popular ? "font-semibold text-white" : "font-semibold text-brown"
                        : plan.popular ? "text-white/80" : "text-text-mid"
                    }`}
                  >
                    <svg
                      className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-caramel-lt" : "text-caramel"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-text-light">
          No credit card required. Free forever plan available.
        </p>
      </div>
    </section>
  );
}
