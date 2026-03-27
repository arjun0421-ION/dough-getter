"use server";

import { createClient } from "@/lib/supabase/server";
import { Comment } from "./types";

export async function getComments(postId: string, userId?: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, author:profiles(id, full_name, username, avatar_url, plan)")
    .eq("post_id", postId)
    .order("is_answer", { ascending: false })
    .order("created_at", { ascending: true });

  if (!data) return [];

  if (!userId) return data.map(toComment);

  const ids = data.map((c) => c.id);
  const { data: upvotes } = await supabase
    .from("comment_upvotes")
    .select("comment_id")
    .eq("user_id", userId)
    .in("comment_id", ids);

  const upvotedSet = new Set((upvotes ?? []).map((u: { comment_id: string }) => u.comment_id));
  return data.map((c) => ({ ...toComment(c), has_upvoted: upvotedSet.has(c.id) }));
}

export async function createComment(
  userId: string,
  postId: string,
  body: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .insert({ user_id: userId, post_id: postId, body });
  return { error: error?.message ?? null };
}

export async function markAsAnswer(
  postAuthorId: string,
  commentId: string
): Promise<void> {
  const supabase = await createClient();
  // Only the post author can mark — enforced by RLS too
  await supabase
    .from("comments")
    .update({ is_answer: true })
    .eq("id", commentId);
  void postAuthorId; // used by RLS
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toComment(c: any): Comment {
  return {
    id: c.id,
    post_id: c.post_id,
    user_id: c.user_id,
    body: c.body,
    upvotes: c.upvotes ?? 0,
    is_answer: c.is_answer ?? false,
    created_at: c.created_at,
    author: c.author ?? { id: "", full_name: null, username: null, avatar_url: null, plan: "free" },
    has_upvoted: false,
  };
}
