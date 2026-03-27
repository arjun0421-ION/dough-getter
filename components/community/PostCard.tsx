"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Post } from "@/lib/community/types";
import { togglePostUpvote } from "@/lib/community/upvotes";
import { togglePostSave } from "@/lib/community/saves";
import { timeAgo } from "@/lib/utils/time";
import { Bookmark, MessageSquare, ChevronUp } from "lucide-react";

interface PostCardProps {
  post: Post;
  userId: string;
}

const TYPE_LABELS: Record<string, string> = {
  question: "Question",
  share: "Discussion",
  discussion: "Discussion",
};

const PLAN_BADGE: Record<string, { label: string; variant: "caramel" | "sage" }> = {
  monthly: { label: "Pro Baker", variant: "caramel" },
  yearly: { label: "Early Backer", variant: "sage" },
};

export default function PostCard({ post, userId }: PostCardProps) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(post.has_upvoted);
  const [hasSaved, setHasSaved] = useState(post.has_saved);

  const authorName =
    post.author.full_name ?? post.author.username ?? "Baker";
  const planBadge = PLAN_BADGE[post.author.plan];

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !hasUpvoted;
    setHasUpvoted(next);
    setUpvotes((v) => v + (next ? 1 : -1));
    await togglePostUpvote(userId, post.id, hasUpvoted);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !hasSaved;
    setHasSaved(next);
    // togglePostSave is a server action — call it but don't await for instant UI
    togglePostSave(userId, post.id, hasSaved);
  };

  return (
    <Link href={`/app/community/${post.id}`} className="block">
      <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Avatar
            src={post.author.avatar_url}
            name={authorName}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-brown truncate">{authorName}</span>
              {planBadge && (
                <Badge variant={planBadge.variant}>{planBadge.label}</Badge>
              )}
            </div>
            <span className="text-xs text-text-light">{timeAgo(post.created_at)}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            post.type === "question" ? "bg-purple-lt text-purple" :
            post.type === "share" ? "bg-sage-lt text-sage" :
            "bg-sage-lt text-sage"
          }`}>
            {TYPE_LABELS[post.type]}
          </span>
        </div>

        {/* Title + body */}
        <div>
          <h3 className="font-semibold text-text-dark line-clamp-2">{post.title}</h3>
          <p className="text-sm text-text-mid mt-1 line-clamp-2">{post.body}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 text-sm transition-colors ${
              hasUpvoted ? "text-caramel" : "text-text-light hover:text-caramel"
            }`}
          >
            <ChevronUp className="w-4 h-4" />
            <span>{upvotes}</span>
          </button>

          <span className="flex items-center gap-1 text-sm text-text-light">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.comment_count}</span>
          </span>

          <span className="flex-1" />

          <button
            onClick={handleSave}
            className={`transition-colors ${
              hasSaved ? "text-caramel" : "text-text-light hover:text-caramel"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={hasSaved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </Link>
  );
}
