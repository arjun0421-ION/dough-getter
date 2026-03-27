"use client";

import Slider from "@/components/ui/Slider";
import { getTemperatureAdvice } from "@/lib/calculator/engine";

interface StepTemperatureProps {
  value: number;
  onChange: (v: number) => void;
}

export default function StepTemperature({ value, onChange }: StepTemperatureProps) {
  const advice = getTemperatureAdvice(value);

  const emoji =
    value >= 28 ? "🔥" : value >= 24 ? "☀️" : value >= 20 ? "🌤️" : "❄️";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Room temperature</h2>
        <p className="text-text-mid mt-1">Your kitchen temp affects fermentation speed.</p>
      </div>

      <div className="text-center">
        <span className="text-6xl font-serif font-bold text-caramel">{value}</span>
        <span className="text-xl text-text-mid ml-1">°C</span>
        <span className="ml-3 text-3xl">{emoji}</span>
      </div>

      <Slider
        min={15}
        max={40}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        unit="°C"
        showValue={false}
      />

      <div className="flex justify-between text-xs text-text-light px-1">
        <span>15°C (cool)</span>
        <span>40°C (hot)</span>
      </div>

      <div className={`rounded-xl p-4 text-sm ${
        value >= 28 ? "bg-orange-50 text-orange-800" :
        value <= 18 ? "bg-blue-50 text-blue-800" :
        "bg-sage-lt text-text-mid"
      }`}>
        {advice}
      </div>
    </div>
  );
}
