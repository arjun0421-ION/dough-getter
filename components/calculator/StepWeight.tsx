"use client";

import Input from "@/components/ui/Input";

interface StepWeightProps {
  value: number;
  loaves: number;
  onChange: (v: number) => void;
}

const QUICK_WEIGHTS = [500, 750, 850, 1000];

export default function StepWeight({ value, loaves, onChange }: StepWeightProps) {
  const doughWeight = Math.round(value * 1.15);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Target loaf weight</h2>
        <p className="text-text-mid mt-1">The baked weight per loaf (before any slicing).</p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          label="Grams per loaf"
          type="number"
          min={200}
          max={2000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_WEIGHTS.map((w) => (
          <button
            key={w}
            onClick={() => onChange(w)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
              value === w
                ? "bg-caramel text-white border-caramel"
                : "bg-white text-text-mid border-border hover:border-caramel"
            }`}
          >
            {w}g
          </button>
        ))}
      </div>

      <div className="bg-sage-lt rounded-xl p-4 text-sm text-text-mid space-y-1">
        <div className="flex justify-between">
          <span>Dough weight per loaf</span>
          <span className="font-medium text-brown">{doughWeight}g</span>
        </div>
        <div className="flex justify-between">
          <span>Total dough ({loaves} {loaves === 1 ? "loaf" : "loaves"})</span>
          <span className="font-medium text-brown">{doughWeight * loaves}g</span>
        </div>
        <p className="text-text-light text-xs mt-2">+15% accounts for moisture lost during baking.</p>
      </div>
    </div>
  );
}
