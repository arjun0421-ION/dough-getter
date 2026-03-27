export interface FlourItem {
  id: string;
  name: string;
  category: string;
  description: string;
  hydrationHint?: string;
  baseHydration?: number; // recommended base hydration %
}

export interface FlourSelection {
  flour: FlourItem;
  ratio: number; // 0-100, all selections must sum to 100
}

export interface FormulaInput {
  loaves: number;
  targetWeightPerLoaf: number; // baked weight in grams
  roomTemp: number; // °C
  flourSelections: FlourSelection[];
  hydration: number; // baker's % e.g. 75
  starterPercent: number; // baker's % e.g. 20
  starterFlourRatio: number; // levain flour ratio, e.g. 1 (for 1:1:1)
  starterWaterRatio: number; // levain water ratio, e.g. 1 (for 1:1:1)
  saltPercent: number; // baker's % e.g. 2.0
}

export interface FlourBreakdown {
  flour: FlourItem;
  ratio: number;
  weight: number; // grams
}

export interface LevainBuild {
  seedWeight: number;
  levainFlour: number;
  levainWater: number;
  totalLevain: number;
}

export interface FormulaResult {
  // Per-loaf amounts
  doughWeightPerLoaf: number;
  totalFlourWeight: number;
  waterWeight: number;
  starterWeight: number;
  saltWeight: number;
  flourBreakdown: FlourBreakdown[];
  levain: LevainBuild;

  // Total amounts (all loaves)
  totalDoughWeight: number;
  totalFlourWeightAll: number;
  totalWaterWeight: number;
  totalStarterWeight: number;
  totalSaltWeight: number;

  // Timing
  bulkRiseHours: number;
  bulkRiseNote: string;

  // Advice
  temperatureAdvice: string;
  hydrationAdvice: string;
}
