"use client";

import { useState } from "react";
import { Post } from "@/lib/community/types";
import { SavedFormula } from "@/lib/formulas/saved";
import PostCard from "@/components/community/PostCard";
import FormulaCard from "./FormulaCard";

interface ProfileTabsProps {
  userId: string;
  posts: Post[];
  savedPosts: Post[];
  formulas: SavedFormula[];
}

const TABS = [
  { key: "posts", label: "Posts" },
  { key: "saved", label: "Saved" },
  { key: "formulas", label: "Formulas" },
];

export default function ProfileTabs({ userId, posts, savedPosts, formulas }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-border mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === t.key
                ? "border-caramel text-caramel"
                : "border-transparent text-text-mid hover:text-brown"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {activeTab === "posts" && (
        posts.length === 0 ? (
          <p className="text-text-light text-sm text-center py-10">No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => <PostCard key={p.id} post={p} userId={userId} />)}
          </div>
        )
      )}

      {/* Saved */}
      {activeTab === "saved" && (
        savedPosts.length === 0 ? (
          <p className="text-text-light text-sm text-center py-10">No saved posts yet. Bookmark posts from the community.</p>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((p) => <PostCard key={p.id} post={p} userId={userId} />)}
          </div>
        )
      )}

      {/* Formulas */}
      {activeTab === "formulas" && (
        formulas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-light text-sm">No saved formulas yet.</p>
            <a href="/app/calculator" className="text-caramel text-sm mt-2 block hover:underline">
              Calculate and save your first formula →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {formulas.map((f) => <FormulaCard key={f.id} formula={f} userId={userId} />)}
          </div>
        )
      )}
    </div>
  );
}
