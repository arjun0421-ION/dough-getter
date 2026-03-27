"use server";

import { createClient } from "@/lib/supabase/server";

const FREE_DAILY_LIMIT = 3;

export async function getUsageTodayCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("calculator_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("used_at", todayStart.toISOString());

  return count ?? 0;
}

export async function recordUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("calculator_usage")
    .insert({ user_id: userId });
}

export async function canUseCalculator(
  userId: string,
  plan: string
): Promise<{ allowed: boolean; usedToday: number; limit: number }> {
  if (plan !== "free") {
    return { allowed: true, usedToday: 0, limit: Infinity };
  }
  const usedToday = await getUsageTodayCount(userId);
  return {
    allowed: usedToday < FREE_DAILY_LIMIT,
    usedToday,
    limit: FREE_DAILY_LIMIT,
  };
}
