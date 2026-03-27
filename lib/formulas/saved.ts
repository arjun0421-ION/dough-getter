"use server";

import { createClient } from "@/lib/supabase/server";
import { FormulaInput, FormulaResult } from "@/lib/calculator/types";

export interface SavedFormula {
  id: string;
  user_id: string;
  name: string;
  loaves: number;
  target_weight: number;
  room_temp: number;
  flours: FormulaInput["flourSelections"];
  hydration: number;
  starter: number;
  salt: number;
  result: FormulaResult;
  created_at: string;
}

export async function saveFormula(
  userId: string,
  name: string,
  input: FormulaInput,
  result: FormulaResult
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("saved_formulas").insert({
    user_id: userId,
    name,
    loaves: input.loaves,
    target_weight: input.targetWeightPerLoaf,
    room_temp: input.roomTemp,
    flours: input.flourSelections,
    hydration: input.hydration,
    starter: input.starterPercent,
    salt: input.saltPercent,
    result,
  });
  return { error: error?.message ?? null };
}

export async function getFormulas(userId: string): Promise<SavedFormula[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_formulas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as SavedFormula[];
}

export async function deleteFormula(
  userId: string,
  formulaId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("saved_formulas")
    .delete()
    .eq("id", formulaId)
    .eq("user_id", userId);
}
