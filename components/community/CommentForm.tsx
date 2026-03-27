"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createComment } from "@/lib/community/comments";
import Button from "@/components/ui/Button";

interface CommentFormProps {
  postId: string;
  userId: string;
}

export default function CommentForm({ postId, userId }: CommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await createComment(userId, postId, body.trim());
    setSubmitting(false);
    if (err) { setError(err); return; }
    setBody("");
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <textarea
        rows={3}
        placeholder="Add a comment..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-caramel"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button
        variant="primary"
        onClick={handleSubmit}
        loading={submitting}
        disabled={!body.trim()}
      >
        Post comment
      </Button>
    </div>
  );
}
