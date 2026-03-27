import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUsageTodayCount } from "@/lib/calculator/usage";
import CalculatorWizard from "@/components/calculator/CalculatorWizard";

export default async function CalculatorPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const usedToday = await getUsageTodayCount(user.id);

  return (
    <div className="py-8 px-4">
      <div className="max-w-lg mx-auto mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold text-brown">Sourdough Calculator</h1>
        <p className="text-text-mid mt-2">
          Precise ingredient weights for any loaf, any flour, any kitchen.
        </p>
        {plan === "free" && (
          <p className="text-xs text-text-light mt-1">
            Free plan: {usedToday}/3 calculations used today
          </p>
        )}
      </div>

      <CalculatorWizard userId={user.id} plan={plan} usedToday={usedToday} />
    </div>
  );
}
