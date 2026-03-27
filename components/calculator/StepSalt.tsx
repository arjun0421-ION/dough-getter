"use client";

import Slider from "@/components/ui/Slider";

interface StepSaltProps {
  value: number;
  totalFlourWeight: number;
  onChange: (v: number) => void;
}

export default function StepSalt({ value, totalFlourWeight, onChange }: StepSaltProps) {
  const saltGrams = totalFlourWeight
    ? Math.round(totalFlourWeight * (value / 100) * 10) / 10
    : null;

  const saltTaste =
    value < 1.5 ? "Under-seasoned — bread may taste flat" :
    value <= 2.2 ? "Classic sourdough range — well seasoned" :
    value <= 3 ? "Slightly salty — robust flavour" :
    "Very salty — consider reducing";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Salt</h2>
        <p className="text-text-mid mt-1">As a percentage of total flour weight.</p>
      </div>

      <div className="text-center">
        <span className="text-6xl font-serif font-bold text-caramel">{value}</span>
        <span className="text-xl text-text-mid ml-1">%</span>
        {saltGrams !== null && (
          <p className="text-text-light text-sm mt-1">≈ {saltGrams}g for your formula</p>
        )}
      </div>

      <Slider
        min={0}
        max={5}
        step={0.1}
        value={value}
        onChange={(e) => onChange(Math.round(Number(e.target.value) * 10) / 10)}
        unit="%"
        showValue={false}
      />

      <div className="flex justify-between text-xs text-text-light px-1">
        <span>0%</span>
        <span>5%</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1.8, 2.0, 2.2].map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
              value === v
                ? "bg-caramel text-white border-caramel"
                : "bg-white text-text-mid border-border hover:border-caramel"
            }`}
          >
            {v}%
          </button>
        ))}
      </div>

      <div className="bg-sage-lt rounded-xl p-4 text-sm text-text-mid">
        {saltTaste}
      </div>
    </div>
  );
}
