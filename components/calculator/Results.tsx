"use client";

import { useState } from "react";
import { FormulaResult, FormulaInput } from "@/lib/calculator/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatWeight } from "@/lib/utils/format";
import { saveFormula } from "@/lib/formulas/saved";

interface ResultsProps {
  result: FormulaResult;
  input: FormulaInput;
  isPaid: boolean;
  userId: string;
  onUpgrade: () => void;
}

export default function Results({ result, input, isPaid, userId, onUpgrade }: ResultsProps) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!savedName.trim()) return;
    setSaving(true);
    const { error } = await saveFormula(userId, savedName.trim(), input, result);
    setSaving(false);
    if (error) setSaveError(error);
    else setSaved(true);
  };

  const rows = [
    { label: "Total flour", value: formatWeight(result.totalFlourWeight) },
    { label: "Water", value: formatWeight(result.waterWeight) },
    { label: "Starter / Levain", value: formatWeight(result.starterWeight) },
    { label: "Salt", value: `${result.saltWeight}g` },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-brown">Your formula</h2>
        <p className="text-text-mid mt-1">
          {input.loaves} {input.loaves === 1 ? "loaf" : "loaves"} × {input.targetWeightPerLoaf}g baked
        </p>
      </div>

      {/* Main formula */}
      <Card>
        <table className="w-full text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-border last:border-0">
                <td className="py-2.5 text-text-mid">{label}</td>
                <td className="py-2.5 text-right font-semibold text-brown">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Flour breakdown */}
      {result.flourBreakdown.length > 1 && (
        <Card>
          <p className="text-xs text-text-light mb-2 font-medium uppercase tracking-wide">Flour breakdown</p>
          <table className="w-full text-sm">
            <tbody>
              {result.flourBreakdown.map(({ flour, ratio, weight }) => (
                <tr key={flour.id} className="border-b border-border last:border-0">
                  <td className="py-2 text-text-mid">{flour.name}</td>
                  <td className="py-2 text-right text-text-light">{ratio}%</td>
                  <td className="py-2 text-right font-semibold text-brown">{formatWeight(weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Levain build */}
      <Card className="bg-caramel/5 border-caramel/30">
        <p className="text-xs text-text-light mb-2 font-medium uppercase tracking-wide">Levain build</p>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text-mid">Seed (mature starter)</td>
              <td className="py-2 text-right font-semibold text-brown">{result.levain.seedWeight}g</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text-mid">Levain flour</td>
              <td className="py-2 text-right font-semibold text-brown">{result.levain.levainFlour}g</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-text-mid">Levain water</td>
              <td className="py-2 text-right font-semibold text-brown">{result.levain.levainWater}g</td>
            </tr>
            <tr>
              <td className="py-2 text-text-mid font-medium">Total levain</td>
              <td className="py-2 text-right font-bold text-caramel">{result.levain.totalLevain}g</td>
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Bulk rise */}
      <Card className="bg-sage-lt border-sage/30">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-text-light font-medium uppercase tracking-wide mb-1">Bulk fermentation</p>
            <p className="text-2xl font-serif font-bold text-brown">{result.bulkRiseHours}h</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-mid max-w-[180px]">{result.bulkRiseNote}</p>
          </div>
        </div>
      </Card>

      {/* Save formula (paid only) */}
      {isPaid && !saved && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name this formula (e.g. Weekend Country Loaf)"
            value={savedName}
            onChange={(e) => setSavedName(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:border-caramel"
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSave}
            loading={saving}
            disabled={!savedName.trim()}
          >
            Save formula
          </Button>
          {saveError && <p className="text-xs text-red-500">{saveError}</p>}
        </div>
      )}

      {saved && (
        <div className="text-center text-sm text-sage font-medium py-2">
          ✓ Formula saved to your profile
        </div>
      )}

      {!isPaid && (
        <button
          onClick={onUpgrade}
          className="w-full py-2.5 rounded-xl border border-dashed border-caramel text-caramel text-sm font-medium hover:bg-caramel/5 transition-colors"
        >
          Save formula → Upgrade to Pro
        </button>
      )}

      {/* Share to community */}
      <a
        href="/app/community"
        className="block text-center text-sm text-text-light hover:text-caramel transition-colors"
      >
        Share this formula with the community →
      </a>
    </div>
  );
}
