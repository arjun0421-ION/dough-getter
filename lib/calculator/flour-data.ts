import { FlourItem } from "./types";

// Flour list matches ShardulG7777/Sourdough-Project src/types/baker.ts
export const FLOUR_CATEGORIES: { category: string; flours: FlourItem[] }[] = [
  {
    category: "Wheat",
    flours: [
      { id: "bread-flour", name: "Bread Flour", category: "Wheat", description: "High protein (12-14%), great structure", baseHydration: 70 },
      { id: "all-purpose", name: "All Purpose Flour", category: "Wheat", description: "Versatile (10-12% protein)", baseHydration: 68 },
      { id: "whole-wheat", name: "Whole Wheat Flour", category: "Wheat", description: "Nutty flavour, dense crumb — add extra water", baseHydration: 75 },
      { id: "white-whole-wheat", name: "White Whole Wheat", category: "Wheat", description: "Lighter whole wheat, easier to handle", baseHydration: 72 },
    ],
  },
  {
    category: "Rye",
    flours: [
      { id: "rye-flour", name: "Rye Flour", category: "Rye", description: "Earthy, complex flavour — high absorption", baseHydration: 90 },
    ],
  },
  {
    category: "Ancient Wheat",
    flours: [
      { id: "spelt", name: "Spelt", category: "Ancient Wheat", description: "Nutty, sweet — weaker gluten, lower hydration", baseHydration: 65 },
      { id: "einkorn", name: "Einkorn", category: "Ancient Wheat", description: "Ancient grain, rich golden colour — absorbs slowly", baseHydration: 62.5 },
      { id: "emmer", name: "Emmer", category: "Ancient Wheat", description: "Nutty and slightly sweet", baseHydration: 68 },
      { id: "kamut", name: "Kamut", category: "Ancient Wheat", description: "Buttery, sweet — high protein ancient grain", baseHydration: 68 },
    ],
  },
  {
    category: "European Bread Flour",
    flours: [
      { id: "t55", name: "T55", category: "European Bread Flour", description: "Classic French flour — light, soft crumb", baseHydration: 68 },
      { id: "t65", name: "T65", category: "European Bread Flour", description: "Baguette flour — airy, open crumb", baseHydration: 72 },
      { id: "t85", name: "T85", category: "European Bread Flour", description: "Semi-wholemeal French flour, earthy flavour", baseHydration: 75 },
    ],
  },
  {
    category: "Specialty Wheat",
    flours: [
      { id: "durum", name: "Durum", category: "Specialty Wheat", description: "Golden semolina wheat — firm crumb", baseHydration: 65 },
      { id: "semolina", name: "Semolina", category: "Specialty Wheat", description: "Coarse durum — golden crust, use as 10-20% blend", baseHydration: 65 },
    ],
  },
  {
    category: "Flavor Flours",
    flours: [
      { id: "oat", name: "Oat", category: "Flavor Flours", description: "Mild, slightly sweet — use as 10-15% blend", baseHydration: 70 },
      { id: "barley", name: "Barley", category: "Flavor Flours", description: "Earthy, malty flavour — use as 10-20% blend", baseHydration: 68 },
    ],
  },
];

export function getAllFlours(): FlourItem[] {
  return FLOUR_CATEGORIES.flatMap((c) => c.flours);
}

export function getFloursByCategory(category: string): FlourItem[] {
  return FLOUR_CATEGORIES.find((c) => c.category === category)?.flours ?? [];
}

export function getFlourById(id: string): FlourItem | undefined {
  return getAllFlours().find((f) => f.id === id);
}

// Recommended base hydration for a flour blend
export function getBlendBaseHydration(selections: { flour: FlourItem; ratio: number }[]): number {
  if (selections.length === 0) return 70;
  const weighted = selections.reduce(
    (sum, s) => sum + (s.flour.baseHydration ?? 70) * (s.ratio / 100),
    0
  );
  return Math.round(weighted);
}
