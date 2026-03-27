"use client";

import Slider from "@/components/ui/Slider";

interface StepLoavesProps {
  value: number;
  onChange: (v: number) => void;
}

export default function StepLoaves({ value, onChange }: StepLoavesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">How many loaves?</h2>
        <p className="text-text-mid mt-1">We'll scale all ingredient weights automatically.</p>
      </div>

      <div className="text-center">
        <span className="text-6xl font-serif font-bold text-caramel">{value}</span>
        <span className="text-xl text-text-mid ml-2">{value === 1 ? "loaf" : "loaves"}</span>
      </div>

      <Slider
        min={1}
        max={20}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        unit=""
        showValue={false}
      />

      <div className="flex justify-between text-xs text-text-light px-1">
        <span>1 loaf</span>
        <span>20 loaves</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        {[1, 2, 4, 6].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
              value === n
                ? "bg-caramel text-white border-caramel"
                : "bg-white text-text-mid border-border hover:border-caramel"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
