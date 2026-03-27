"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: "usage_limit" | "multi_flour" | "save_formula";
}

const COPY: Record<UpgradeModalProps["reason"], { title: string; body: string; cta: string }> = {
  usage_limit: {
    title: "You've used your 3 free calculations today",
    body: "Upgrade to Pro for unlimited daily calculations, multi-flour blending, and formula saving.",
    cta: "Upgrade for unlimited access",
  },
  multi_flour: {
    title: "Multi-flour blending is a Pro feature",
    body: "Upgrade to unlock blending up to 5 flours with custom ratios — and save every formula you create.",
    cta: "Unlock multi-flour blending",
  },
  save_formula: {
    title: "Save your formula with Pro",
    body: "Never lose a perfect formula again. Pro bakers can save, name, and recall all their formulas.",
    cta: "Upgrade to save formulas",
  },
};

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const router = useRouter();
  const { title, body, cta } = COPY[reason];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-4 pt-2">
        <div className="text-4xl">🍞</div>
        <h2 className="text-xl font-serif font-bold text-brown">{title}</h2>
        <p className="text-text-mid text-sm">{body}</p>

        <div className="space-y-2 pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => { onClose(); router.push("/app/upgrade"); }}
          >
            {cta}
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Maybe later
          </Button>
        </div>

        <div className="text-xs text-text-light border-t border-border pt-3">
          Pro is <strong>$6/month</strong> or <strong>$49/year</strong> — cancel any time.
        </div>
      </div>
    </Modal>
  );
}
