"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavedFormula } from "@/lib/formulas/saved";
import { deleteFormula } from "@/lib/formulas/saved";
import { timeAgo } from "@/lib/utils/time";
import { Trash2 } from "lucide-react";

interface FormulaCardProps {
  formula: SavedFormula;
  userId: string;
}

export default function FormulaCard({ formula, userId }: FormulaCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${formula.name}"?`)) return;
    setDeleting(true);
    await deleteFormula(userId, formula.id);
    router.refresh();
  };

  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-brown">{formula.name}</h3>
          <p className="text-xs text-text-light">{timeAgo(formula.created_at)}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 text-text-light hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs text-text-mid">
        <div>
          <span className="text-text-light">Loaves</span>
          <p className="font-medium text-brown">{formula.loaves}</p>
        </div>
        <div>
          <span className="text-text-light">Hydration</span>
          <p className="font-medium text-brown">{formula.hydration}%</p>
        </div>
        <div>
          <span className="text-text-light">Target weight</span>
          <p className="font-medium text-brown">{formula.target_weight}g</p>
        </div>
      </div>

      <div className="pt-1 border-t border-border grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between text-text-mid">
          <span>Flour</span>
          <span className="font-medium text-brown">{formula.result.totalFlourWeight}g</span>
        </div>
        <div className="flex justify-between text-text-mid">
          <span>Water</span>
          <span className="font-medium text-brown">{formula.result.waterWeight}g</span>
        </div>
        <div className="flex justify-between text-text-mid">
          <span>Starter</span>
          <span className="font-medium text-brown">{formula.result.starterWeight}g</span>
        </div>
        <div className="flex justify-between text-text-mid">
          <span>Salt</span>
          <span className="font-medium text-brown">{formula.result.saltWeight}g</span>
        </div>
      </div>
    </div>
  );
}
