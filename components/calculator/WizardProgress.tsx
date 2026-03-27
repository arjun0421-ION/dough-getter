const STEPS = [
  "Loaves",
  "Weight",
  "Temp",
  "Flour",
  "Hydration",
  "Starter",
  "Salt",
  "Results",
];

interface WizardProgressProps {
  currentStep: number; // 0-indexed
}

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {STEPS.map((label, i) => {
        const isDone = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-caramel"
                    : isDone
                    ? "bg-sage"
                    : "bg-border"
                }`}
              />
              <span
                className={`text-[10px] hidden sm:block ${
                  isActive ? "text-caramel font-medium" : isDone ? "text-sage" : "text-text-light"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-6 h-px mb-3 ${isDone ? "bg-sage" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
