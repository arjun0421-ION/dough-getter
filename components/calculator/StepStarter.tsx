"use client";

import Slider from "@/components/ui/Slider";

interface StepStarterProps {
  starterPercent: number;
  starterFlourRatio: number;
  starterWaterRatio: number;
  roomTemp: number;
  onStarterPercentChange: (v: number) => void;
  onFlourRatioChange: (v: number) => void;
  onWaterRatioChange: (v: number) => void;
}

const FEED_PRESETS = [
  { label: "1:1:1", flour: 1, water: 1 },
  { label: "1:2:2", flour: 2, water: 2 },
  { label: "1:3:3", flour: 3, water: 3 },
  { label: "1:5:5", flour: 5, water: 5 },
];

export default function StepStarter({
  starterPercent,
  starterFlourRatio,
  starterWaterRatio,
  roomTemp,
  onStarterPercentChange,
  onFlourRatioChange,
  onWaterRatioChange,
}: StepStarterProps) {
  const fermentSpeed =
    starterPercent >= 30 ? "Fast fermentation — bulk will move quickly" :
    starterPercent >= 20 ? "Moderate fermentation — reliable and predictable" :
    starterPercent >= 10 ? "Slower fermentation — more flavour development time" :
    "Very slow — good for overnight cold proofing";

  // Recommend starter % based on temp (mirrors original StarterStep.tsx logic)
  const recommended =
    roomTemp > 26 ? 15 :
    roomTemp < 21 ? 25 :
    20;

  const feedLabel = `1:${starterFlourRatio}:${starterWaterRatio}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Starter</h2>
        <p className="text-text-mid mt-1">How much starter as a percentage of total flour.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-brown">Starter %</span>
          <span className="text-caramel font-bold text-lg">{starterPercent}%</span>
        </div>
        <Slider
          min={5}
          max={50}
          step={1}
          value={starterPercent}
          onChange={(e) => onStarterPercentChange(Number(e.target.value))}
          unit="%"
          showValue={false}
        />
        <div className="flex justify-between text-xs text-text-light">
          <span>5% (very slow)</span>
          <span>50% (very fast)</span>
        </div>
        {recommended !== starterPercent && (
          <button
            onClick={() => onStarterPercentChange(recommended)}
            className="text-xs text-caramel underline"
          >
            Use recommended for {roomTemp}°C: {recommended}%
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-brown">Feed ratio (seed:flour:water)</span>
          <span className="text-caramel font-bold">{feedLabel}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FEED_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { onFlourRatioChange(p.flour); onWaterRatioChange(p.water); }}
              className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                starterFlourRatio === p.flour && starterWaterRatio === p.water
                  ? "bg-caramel text-white border-caramel"
                  : "bg-white text-text-mid border-border hover:border-caramel"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-sage-lt rounded-xl p-4 text-sm text-text-mid">
        {fermentSpeed}
      </div>
    </div>
  );
}
