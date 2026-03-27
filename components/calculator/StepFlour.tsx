"use client";

import { useState } from "react";
import { FLOUR_CATEGORIES } from "@/lib/calculator/flour-data";
import { FlourItem, FlourSelection } from "@/lib/calculator/types";
import { Lock } from "lucide-react";

interface StepFlourProps {
  selections: FlourSelection[];
  onChange: (selections: FlourSelection[]) => void;
  isPaid: boolean;
}

export default function StepFlour({ selections, onChange, isPaid }: StepFlourProps) {
  const [activeCategory, setActiveCategory] = useState(FLOUR_CATEGORIES[0].category);

  const categories = FLOUR_CATEGORIES.map((c) => c.category);
  const flours = FLOUR_CATEGORIES.find((c) => c.category === activeCategory)?.flours ?? [];

  const isSelected = (flour: FlourItem) =>
    selections.some((s) => s.flour.id === flour.id);

  const toggleFlour = (flour: FlourItem) => {
    if (isSelected(flour)) {
      // Remove it
      const updated = selections.filter((s) => s.flour.id !== flour.id);
      const redistributed = redistributeRatios(updated);
      onChange(redistributed);
    } else {
      // Add it — free users limited to 1 flour
      if (!isPaid && selections.length >= 1) return;
      if (selections.length >= 5) return;
      const updated = [...selections, { flour, ratio: 0 }];
      const redistributed = redistributeRatios(updated);
      onChange(redistributed);
    }
  };

  const updateRatio = (flourId: string, ratio: number) => {
    const updated = selections.map((s) =>
      s.flour.id === flourId ? { ...s, ratio } : s
    );
    onChange(updated);
  };

  const totalRatio = selections.reduce((sum, s) => sum + s.ratio, 0);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Choose your flour</h2>
        <p className="text-text-mid mt-1">
          {isPaid ? "Select up to 5 flours and set their ratios." : "Select 1 flour. Upgrade to blend up to 5."}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors border flex-shrink-0 ${
              activeCategory === cat
                ? "bg-caramel text-white border-caramel"
                : "bg-white text-text-mid border-border hover:border-caramel"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flour cards */}
      <div className="grid grid-cols-1 gap-2">
        {flours.map((flour) => {
          const selected = isSelected(flour);
          const locked = !isPaid && !selected && selections.length >= 1;
          return (
            <button
              key={flour.id}
              onClick={() => !locked && toggleFlour(flour)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selected
                  ? "border-caramel bg-caramel/5"
                  : locked
                  ? "border-border bg-gray-50 opacity-60 cursor-default"
                  : "border-border bg-white hover:border-caramel"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-brown">{flour.name}</div>
                  <div className="text-xs text-text-light mt-0.5">{flour.description}</div>
                </div>
                {locked ? (
                  <div className="flex items-center gap-1 text-xs text-text-light">
                    <Lock className="w-3 h-3" />
                    <span>Pro</span>
                  </div>
                ) : selected ? (
                  <div className="w-4 h-4 rounded-full bg-caramel flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      {/* Ratio sliders for selected flours */}
      {selections.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-brown">Flour ratios</span>
            <span className={`text-sm font-medium ${totalRatio === 100 ? "text-sage" : "text-red-500"}`}>
              {totalRatio}% / 100%
            </span>
          </div>
          {selections.map((sel) => (
            <div key={sel.flour.id} className="space-y-1">
              <div className="flex justify-between text-xs text-text-mid">
                <span>{sel.flour.name}</span>
                <span className="font-medium">{sel.ratio}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={sel.ratio}
                onChange={(e) => updateRatio(sel.flour.id, Number(e.target.value))}
                className="w-full h-1.5 rounded-full accent-caramel"
              />
            </div>
          ))}
          {totalRatio !== 100 && (
            <p className="text-xs text-red-500">Ratios must add up to 100% before continuing.</p>
          )}
        </div>
      )}
    </div>
  );
}

function redistributeRatios(selections: FlourSelection[]): FlourSelection[] {
  if (selections.length === 0) return [];
  const perFlour = Math.floor(100 / selections.length);
  const remainder = 100 - perFlour * selections.length;
  return selections.map((s, i) => ({
    ...s,
    ratio: i === 0 ? perFlour + remainder : perFlour,
  }));
}
