import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUsageTodayCount } from "@/lib/calculator/usage";
import Link from "next/link";
import Button from "@/components/ui/Button";

const comingSoonFeatures = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    title: "Inventory Manager",
    description: "Track your ingredients in real time. Deduct automatically as you bake, get low-stock alerts before market day.",
    color: "sage",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "P&L Calculator",
    description: "Know your true margin on every loaf. Track income, expenses, and profit without the accounting degree.",
    color: "caramel",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: "AI Co-Founder",
    description: "A conversational business partner that helps you price products, plan batches, and grow — through simple chat.",
    color: "purple",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Baking Scheduler",
    description: "Plan your bake days, proof times, and market deadlines in one calendar built around your kitchen rhythm.",
    color: "caramel",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: "Starter Vitality Tracker",
    description: "Log your levain feedings, track peak activity, and keep your starter oven-ready with health trends over time.",
    color: "sage",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H15.75v-.008zm0 2.25h.008v.008H15.75V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
      </svg>
    ),
    title: "Cost Estimator",
    description: "See the exact cost per boule — flour, utilities, labor, packaging — so you never underprice again.",
    color: "caramel",
  },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  caramel: { bg: "bg-caramel/8",  icon: "text-caramel/50" },
  sage:    { bg: "bg-sage/8",     icon: "text-sage/50"    },
  purple:  { bg: "bg-purple/8",   icon: "text-purple/50"  },
};

export default async function AppHomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const firstName = profile?.full_name?.split(" ")[0] || "Baker";
  const usedToday = plan === "free" ? await getUsageTodayCount(user.id) : 0;
  const remainingToday = Math.max(0, 3 - usedToday);

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-brown">
          Welcome back, {firstName}
        </h1>
        <p className="text-text-mid mt-1">What are we baking today?</p>
      </div>

      {/* Active features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Calculator */}
        <Link href="/app/calculator" className="group">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md hover:border-caramel/40 transition-all h-full">
            <div className="w-11 h-11 bg-caramel/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-caramel/20 transition-colors">
              <svg className="w-6 h-6 text-caramel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H15.75v-.008zm0 2.25h.008v.008H15.75V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-text-dark text-lg">Sourdough Calculator</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-lt text-sage">Live</span>
            </div>
            <p className="text-text-mid text-sm leading-relaxed">
              Build your perfect formula. Set your loaves, flour, hydration, and get exact gram weights.
            </p>
            {plan === "free" && (
              <p className="mt-3 text-xs text-text-light">
                {remainingToday > 0
                  ? `${remainingToday} of 3 free uses left today`
                  : "Daily limit reached — upgrade for unlimited"}
              </p>
            )}
          </div>
        </Link>

        {/* Community */}
        <Link href="/app/community" className="group">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md hover:border-purple/40 transition-all h-full">
            <div className="w-11 h-11 bg-purple/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple/20 transition-colors">
              <svg className="w-6 h-6 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-text-dark text-lg">Community</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sage-lt text-sage">Live</span>
            </div>
            <p className="text-text-mid text-sm leading-relaxed">
              Ask questions, share your bakes, and connect with bakers who get it.
            </p>
          </div>
        </Link>
      </div>

      {/* Coming soon section */}
      <div className="mt-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold text-text-mid uppercase tracking-widest">Coming Soon</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {comingSoonFeatures.map((feature) => {
            const colors = colorMap[feature.color];
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-border p-5 opacity-70 cursor-default"
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <span className={colors.icon}>{feature.icon}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-dark text-sm">{feature.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream text-text-light border border-border">
                    Soon
                  </span>
                </div>
                <p className="text-text-light text-xs leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade banner for free users */}
      {plan === "free" && (
        <div className="bg-caramel/8 border border-caramel/20 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-brown text-sm">Unlock the full experience</p>
            <p className="text-text-mid text-sm mt-0.5">
              Save formulas, blend multiple flours, and get unlimited calculations. From $12/month.
            </p>
          </div>
          <Link href="/app/upgrade" className="shrink-0">
            <Button size="sm">See Plans</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
