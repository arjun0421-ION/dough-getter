"use client";

import { useState } from "react";
import { FormulaInput, FlourSelection } from "@/lib/calculator/types";
import { calculateFormula } from "@/lib/calculator/engine";
import { getFlourById } from "@/lib/calculator/flour-data";
import { recordUsage } from "@/lib/calculator/usage";
import WizardProgress from "./WizardProgress";
import StepLoaves from "./StepLoaves";
import StepWeight from "./StepWeight";
import StepTemperature from "./StepTemperature";
import StepFlour from "./StepFlour";
import StepHydration from "./StepHydration";
import StepStarter from "./StepStarter";
import StepSalt from "./StepSalt";
import Results from "./Results";
import UpgradeModal from "./UpgradeModal";
import Button from "@/components/ui/Button";

interface CalculatorWizardProps {
  userId: string;
  plan: string;
  usedToday: number;
}

type UpgradeReason = "usage_limit" | "multi_flour" | "save_formula";

const DEFAULT_INPUT: FormulaInput = {
  loaves: 1,
  targetWeightPerLoaf: 850,
  roomTemp: 24,
  flourSelections: [],
  hydration: 70,
  starterPercent: 20,
  starterFlourRatio: 1,
  starterWaterRatio: 1,
  saltPercent: 2,
};

const TOTAL_STEPS = 8; // 0-6 = input steps, 7 = results

export default function CalculatorWizard({ userId, plan, usedToday }: CalculatorWizardProps) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<FormulaInput>(DEFAULT_INPUT);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason>("usage_limit");
  const [submitting, setSubmitting] = useState(false);

  const isPaid = plan !== "free";
  const FREE_LIMIT = 3;

  const showUpgrade = (reason: UpgradeReason) => {
    setUpgradeReason(reason);
    setUpgradeOpen(true);
  };

  const patch = (partial: Partial<FormulaInput>) =>
    setInput((prev) => ({ ...prev, ...partial }));

  const canAdvance = (): boolean => {
    if (step === 3) {
      // Flour step: must have at least one flour and ratios summing to 100
      if (input.flourSelections.length === 0) return false;
      const total = input.flourSelections.reduce((s, f) => s + f.ratio, 0);
      return total === 100;
    }
    return true;
  };

  const handleNext = async () => {
    if (!canAdvance()) return;

    if (step === 6) {
      // About to show results — check usage gate for free users
      if (!isPaid && usedToday >= FREE_LIMIT) {
        showUpgrade("usage_limit");
        return;
      }
      // Record usage
      setSubmitting(true);
      await recordUsage(userId);
      setSubmitting(false);
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const result = step === TOTAL_STEPS - 1 ? calculateFormula(input) : null;

  return (
    <div className="max-w-lg mx-auto">
      <WizardProgress currentStep={step} />

      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm min-h-[380px]">
        {step === 0 && (
          <StepLoaves value={input.loaves} onChange={(v) => patch({ loaves: v })} />
        )}
        {step === 1 && (
          <StepWeight
            value={input.targetWeightPerLoaf}
            loaves={input.loaves}
            onChange={(v) => patch({ targetWeightPerLoaf: v })}
          />
        )}
        {step === 2 && (
          <StepTemperature
            value={input.roomTemp}
            onChange={(v) => patch({ roomTemp: v })}
          />
        )}
        {step === 3 && (
          <StepFlour
            selections={input.flourSelections}
            onChange={(selections) => patch({ flourSelections: selections })}
            isPaid={isPaid}
          />
        )}
        {step === 4 && (
          <StepHydration
            value={input.hydration}
            flourSelections={input.flourSelections}
            onChange={(v) => patch({ hydration: v })}
          />
        )}
        {step === 5 && (
          <StepStarter
            starterPercent={input.starterPercent}
            starterFlourRatio={input.starterFlourRatio}
            starterWaterRatio={input.starterWaterRatio}
            roomTemp={input.roomTemp}
            onStarterPercentChange={(v) => patch({ starterPercent: v })}
            onFlourRatioChange={(v) => patch({ starterFlourRatio: v })}
            onWaterRatioChange={(v) => patch({ starterWaterRatio: v })}
          />
        )}
        {step === 6 && (
          <StepSalt
            value={input.saltPercent}
            totalFlourWeight={
              input.targetWeightPerLoaf && input.loaves
                ? Math.round(
                    (input.targetWeightPerLoaf * input.loaves * 1.15) /
                      ((100 + input.hydration + input.starterPercent + input.saltPercent) / 100)
                  )
                : 0
            }
            onChange={(v) => patch({ saltPercent: v })}
          />
        )}
        {step === TOTAL_STEPS - 1 && result && (
          <Results
            result={result}
            input={input}
            isPaid={isPaid}
            userId={userId}
            onUpgrade={() => showUpgrade("save_formula")}
          />
        )}
      </div>

      {/* Navigation */}
      {step < TOTAL_STEPS - 1 && (
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            loading={submitting}
            disabled={!canAdvance()}
            className="flex-1"
          >
            {step === 6 ? "Calculate" : "Next"}
          </Button>
        </div>
      )}

      {step === TOTAL_STEPS - 1 && (
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => { setStep(0); setInput(DEFAULT_INPUT); }}
            className="w-full"
          >
            Start over
          </Button>
        </div>
      )}

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        reason={upgradeReason}
      />
    </div>
  );
}
