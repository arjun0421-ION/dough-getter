"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Comment } from "@/lib/community/types";
import { toggleCommentUpvote } from "@/lib/community/upvotes";
import { markAsAnswer } from "@/lib/community/comments";
import { timeAgo } from "@/lib/utils/time";
import { ChevronUp, CheckCircle } from "lucide-react";

interface CommentThreadProps {
  comments: Comment[];
  postAuthorId: string;
  userId: string;
  isQuestion: boolean;
}

const PLAN_BADGE: Record<string, { label: string; variant: "caramel" | "sage" }> = {
  monthly: { label: "Pro Baker", variant: "caramel" },
  yearly: { label: "Early Backer", variant: "sage" },
};

function CommentItem({
  comment,
  userId,
  postAuthorId,
  isQuestion,
}: {
  comment: Comment;
  userId: string;
  postAuthorId: string;
  isQuestion: boolean;
}) {
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(comment.has_upvoted);
  const [isAnswer, setIsAnswer] = useState(comment.is_answer);

  const authorName = comment.author.full_name ?? comment.author.username ?? "Baker";
  const planBadge = PLAN_BADGE[comment.author.plan];
  const canMarkAnswer = isQuestion && userId === postAuthorId && !isAnswer;

  const handleUpvote = async () => {
    const next = !hasUpvoted;
    setHasUpvoted(next);
    setUpvotes((v) => v + (next ? 1 : -1));
    await toggleCommentUpvote(userId, comment.id, hasUpvoted);
  };

  const handleMarkAnswer = async () => {
    setIsAnswer(true);
    await markAsAnswer(postAuthorId, comment.id);
  };

  return (
    <div className={`p-4 rounded-xl border ${isAnswer ? "border-sage bg-sage-lt/50" : "border-border bg-white"}`}>
      {isAnswer && (
        <div className="flex items-center gap-1.5 text-sage text-xs font-medium mb-2">
          <CheckCircle className="w-3.5 h-3.5" />
          Accepted Answer
        </div>
      )}

      <div className="flex items-start gap-3">
        <Avatar src={comment.author.avatar_url} name={authorName} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm font-medium text-brown">{authorName}</span>
            {planBadge && <Badge variant={planBadge.variant}>{planBadge.label}</Badge>}
            <span className="text-xs text-text-light">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-text-dark whitespace-pre-wrap">{comment.body}</p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1 text-xs transition-colors ${
                hasUpvoted ? "text-caramel" : "text-text-light hover:text-caramel"
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              {upvotes}
            </button>
            {canMarkAnswer && (
              <button
                onClick={handleMarkAnswer}
                className="text-xs text-sage hover:underline"
              >
                Mark as answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentThread({ comments, postAuthorId, userId, isQuestion }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-text-light text-sm">
        No comments yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          userId={userId}
          postAuthorId={postAuthorId}
          isQuestion={isQuestion}
        />
      ))}
    </div>
  );
}
