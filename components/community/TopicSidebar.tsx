"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bookmark } from "lucide-react";

const TOPICS = [
  { value: "all", label: "All Posts" },
  { value: "sourdough", label: "Sourdough" },
  { value: "pricing", label: "Pricing" },
  { value: "decorating", label: "Decorating" },
  { value: "business", label: "Business" },
  { value: "general", label: "General" },
  { value: "saved", label: "Saved", icon: true },
];

interface TopicSidebarProps {
  activeTopic: string;
}

export default function TopicSidebar({ activeTopic }: TopicSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setTopic = (topic: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("topic", topic);
    router.push(`/app/community?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col gap-1 w-44 flex-shrink-0">
        {TOPICS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTopic(t.value)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
              activeTopic === t.value
                ? "bg-caramel/10 text-caramel"
                : "text-text-mid hover:bg-cream"
            }`}
          >
            {t.icon && <Bookmark className="w-3.5 h-3.5" />}
            {t.label}
          </button>
        ))}
      </nav>

      {/* Mobile chips */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {TOPICS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTopic(t.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors border ${
              activeTopic === t.value
                ? "bg-caramel text-white border-caramel"
                : "bg-white text-text-mid border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}
