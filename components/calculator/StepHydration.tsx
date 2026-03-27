"use client";

import Slider from "@/components/ui/Slider";
import { getHydrationAdvice } from "@/lib/calculator/engine";
import { getBlendBaseHydration } from "@/lib/calculator/flour-data";
import { FlourSelection } from "@/lib/calculator/types";

interface StepHydrationProps {
  value: number;
  flourSelections: FlourSelection[];
  onChange: (v: number) => void;
}

export default function StepHydration({ value, flourSelections, onChange }: StepHydrationProps) {
  const advice = getHydrationAdvice(value);
  const recommended = getBlendBaseHydration(flourSelections);

  const label =
    value >= 85 ? "Expert" :
    value >= 75 ? "High" :
    value >= 65 ? "Moderate" :
    "Low";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Hydration</h2>
        <p className="text-text-mid mt-1">Ratio of water to flour — affects crumb openness and handling.</p>
      </div>

      <div className="text-center">
        <span className="text-6xl font-serif font-bold text-caramel">{value}</span>
        <span className="text-xl text-text-mid ml-1">%</span>
        <span className="ml-3 text-sm text-text-light">({label})</span>
      </div>

      <Slider
        min={50}
        max={90}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        unit="%"
        showValue={false}
      />

      <div className="flex justify-between text-xs text-text-light px-1">
        <span>50% (stiff)</span>
        <span>90% (very wet)</span>
      </div>

      {flourSelections.length > 0 && recommended !== value && (
        <button
          onClick={() => onChange(recommended)}
          className="w-full py-2 rounded-lg border border-caramel text-caramel text-sm font-medium hover:bg-caramel/5 transition-colors"
        >
          Use recommended for your flour blend: {recommended}%
        </button>
      )}

      <div className="bg-sage-lt rounded-xl p-4 text-sm text-text-mid">
        {advice}
      </div>
    </div>
  );
}
