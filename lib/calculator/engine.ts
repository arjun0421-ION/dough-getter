import { FormulaInput, FormulaResult, LevainBuild } from "./types";

/**
 * Core sourdough calculator — ported from ShardulG7777/Sourdough-Project RecipeView.tsx
 *
 * Key math:
 *   totalDoughWeight = targetLoafWeight * loaves * 1.15  (15% bake-off buffer)
 *   totalPercentage  = 100 + hydration + starter + salt
 *   totalFlourWeight = totalDoughWeight / (totalPercentage / 100)
 *   waterWeight      = totalFlourWeight * (hydration / 100)
 *   starterWeight    = totalFlourWeight * (starter / 100)
 *   saltWeight       = totalFlourWeight * (salt / 100)
 *
 * Levain build:
 *   levainBuffer  = 10g (discard safety)
 *   levainParts   = 1 + starterFlourRatio + starterWaterRatio
 *   levainUnit    = ceil((starterWeight + levainBuffer) / levainParts)
 *   seedWeight    = levainUnit
 *   levainFlour   = round(levainUnit * starterFlourRatio)
 *   levainWater   = round(levainUnit * starterWaterRatio)
 */
export function calculateFormula(input: FormulaInput): FormulaResult {
  const {
    loaves,
    targetWeightPerLoaf,
    roomTemp,
    flourSelections,
    hydration,
    starterPercent,
    starterFlourRatio,
    starterWaterRatio,
    saltPercent,
  } = input;

  // ── Dough weights ──────────────────────────────────────────────────────────
  const totalDoughWeight = Math.round(targetWeightPerLoaf * loaves * 1.15);
  const doughWeightPerLoaf = Math.round(totalDoughWeight / loaves);

  const totalPercentage = 100 + hydration + starterPercent + saltPercent;
  const totalFlourWeight = Math.round(totalDoughWeight / (totalPercentage / 100));

  const waterWeight = Math.round(totalFlourWeight * (hydration / 100));
  const starterWeight = Math.round(totalFlourWeight * (starterPercent / 100));
  const saltWeight = Math.round(totalFlourWeight * (saltPercent / 100));

  // ── Flour breakdown ────────────────────────────────────────────────────────
  const flourBreakdown = flourSelections.map((sel) => ({
    flour: sel.flour,
    ratio: sel.ratio,
    weight: Math.round(totalFlourWeight * (sel.ratio / 100)),
  }));

  // ── Levain build ──────────────────────────────────────────────────────────
  const levainBuffer = 10;
  const levainParts = 1 + starterFlourRatio + starterWaterRatio;
  const levainUnit = Math.ceil((starterWeight + levainBuffer) / levainParts);
  const levain: LevainBuild = {
    seedWeight: levainUnit,
    levainFlour: Math.round(levainUnit * starterFlourRatio),
    levainWater: Math.round(levainUnit * starterWaterRatio),
    totalLevain: levainUnit + Math.round(levainUnit * starterFlourRatio) + Math.round(levainUnit * starterWaterRatio),
  };

  // ── All-loaf totals ────────────────────────────────────────────────────────
  const totalFlourWeightAll = totalFlourWeight;
  const totalWaterWeight = waterWeight;
  const totalStarterWeight = starterWeight;
  const totalSaltWeight = saltWeight;

  // ── Bulk rise estimate ─────────────────────────────────────────────────────
  const { hours, note } = getBulkRiseEstimate(roomTemp, starterPercent, hydration, starterFlourRatio);

  return {
    doughWeightPerLoaf,
    totalFlourWeight,
    waterWeight,
    starterWeight,
    saltWeight,
    flourBreakdown,
    levain,
    totalDoughWeight,
    totalFlourWeightAll,
    totalWaterWeight,
    totalStarterWeight,
    totalSaltWeight,
    bulkRiseHours: hours,
    bulkRiseNote: note,
    temperatureAdvice: getTemperatureAdvice(roomTemp),
    hydrationAdvice: getHydrationAdvice(hydration),
  };
}

export function getBulkRiseEstimate(
  tempC: number,
  starterPercentage: number,
  hydration: number,
  avgRatio: number = 1
): { hours: number; note: string } {
  // From original RecipeView.tsx
  let hours = 5; // base at 24°C, 20% starter, 70% hydration
  hours -= (tempC - 24) * 0.25;
  hours -= (starterPercentage - 20) * 0.05;
  hours -= (hydration - 70) * 0.02;
  if (avgRatio > 1) hours += (avgRatio - 1) * 0.25;
  if (tempC >= 28) hours += 0.75; // cold water lag in hot kitchen

  hours = Math.max(2, Math.min(12, hours));
  hours = Math.round(hours * 2) / 2; // round to nearest 0.5h

  let note = "";
  if (tempC >= 28) note = "Warm kitchen — use cold water, watch closely";
  else if (tempC <= 18) note = "Cool kitchen — great for flavour, expect a longer bulk";
  else if (starterPercentage >= 30) note = "High starter % — bulk will move quickly";
  else if (starterPercentage <= 10) note = "Low starter % — allow extra time";
  else note = "Check: dough should be domed, jiggly, and 50-75% risen";

  return { hours, note };
}

export function getTemperatureAdvice(temp: number): string {
  if (temp >= 30) return "Hot kitchen! Use cold water and reduce starter by 5%. Monitor bulk closely.";
  if (temp >= 27) return "Warm — consider cold water and shortening bulk time.";
  if (temp >= 22) return "Ideal baking temperature. No adjustments needed.";
  if (temp >= 18) return "Cool kitchen. A longer bulk ferment is fine — great for flavour.";
  return "Very cool. Consider proofing in your oven with just the light on.";
}

export function getHydrationAdvice(hydration: number): string {
  if (hydration >= 85) return "Very high hydration — wet, sticky dough. Use wet hands and a bench scraper.";
  if (hydration >= 75) return "High hydration — open, airy crumb. Handle gently with stretch-and-fold.";
  if (hydration >= 65) return "Moderate hydration — easy to handle. Great for beginners.";
  if (hydration >= 55) return "Low hydration — stiff dough, dense crumb. Good for rolls and bagels.";
  return "Very low hydration — good for crackers or flatbreads.";
}
