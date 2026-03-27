"use server";

import { createClient } from "@/lib/supabase/server";

export async function togglePostUpvote(
  userId: string,
  postId: string,
  currentlyUpvoted: boolean
): Promise<void> {
  const supabase = await createClient();
  if (currentlyUpvoted) {
    await supabase
      .from("post_upvotes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
  } else {
    await supabase.from("post_upvotes").insert({ user_id: userId, post_id: postId });
  }
}

export async function toggleCommentUpvote(
  userId: string,
  commentId: string,
  currentlyUpvoted: boolean
): Promise<void> {
  const supabase = await createClient();
  if (currentlyUpvoted) {
    await supabase
      .from("comment_upvotes")
      .delete()
      .eq("user_id", userId)
      .eq("comment_id", commentId);
  } else {
    await supabase
      .from("comment_upvotes")
      .insert({ user_id: userId, comment_id: commentId });
  }
}
