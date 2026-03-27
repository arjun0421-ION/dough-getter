"use server";

import { createClient } from "@/lib/supabase/server";

export async function togglePostSave(
  userId: string,
  postId: string,
  currentlySaved: boolean
): Promise<void> {
  const supabase = await createClient();
  if (currentlySaved) {
    await supabase
      .from("post_saves")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
  } else {
    await supabase.from("post_saves").insert({ user_id: userId, post_id: postId });
  }
}

export async function getSavedPosts(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_saves")
    .select("post_id")
    .eq("user_id", userId);
  return (data ?? []).map((s) => s.post_id);
}
