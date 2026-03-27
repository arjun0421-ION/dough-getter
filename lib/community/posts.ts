"use server";

import { createClient } from "@/lib/supabase/server";
import { Post, PostFilter, PostTopic, PostType } from "./types";

export async function getPosts(
  filter: PostFilter,
  userId?: string
): Promise<Post[]> {
  const supabase = await createClient();

  // Saved posts: get saved post_ids first
  if (filter.topic === "saved" && userId) {
    const { data: saves } = await supabase
      .from("post_saves")
      .select("post_id")
      .eq("user_id", userId);
    const ids = (saves ?? []).map((s) => s.post_id);
    if (ids.length === 0) return [];
    filter = { ...filter, topic: "all" };
    // Re-query with these ids (handled below via a separate path)
    const { data } = await supabase
      .from("posts")
      .select("*, author:profiles(id, full_name, username, avatar_url, plan), comments(count)")
      .in("id", ids)
      .order("created_at", { ascending: false });
    return enrichPosts(data ?? [], userId, supabase);
  }

  let query = supabase
    .from("posts")
    .select("*, author:profiles(id, full_name, username, avatar_url, plan), comments(count)");

  if (filter.topic && filter.topic !== "all") {
    query = query.eq("topic", filter.topic as PostTopic);
  }

  // Paid-user priority boost: sort by (upvotes + boost) DESC then created_at
  if (filter.sort === "top") {
    query = query.order("upvotes", { ascending: false }).order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data } = await query.limit(50);
  return enrichPosts(data ?? [], userId, supabase);
}

export async function getPostById(
  postId: string,
  userId?: string
): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(id, full_name, username, avatar_url, plan), comments(count)")
    .eq("id", postId)
    .single();
  if (!data) return null;
  const [enriched] = await enrichPosts([data], userId, supabase);
  return enriched ?? null;
}

export async function createPost(
  userId: string,
  payload: { type: PostType; topic: PostTopic; title: string; body: string; image_url?: string }
): Promise<{ id: string | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: userId, ...payload })
    .select("id")
    .single();
  return { id: data?.id ?? null, error: error?.message ?? null };
}

export async function deletePost(userId: string, postId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", postId).eq("user_id", userId);
}

// ── helpers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function enrichPosts(rows: any[], userId: string | undefined, supabase: any): Promise<Post[]> {
  if (!userId || rows.length === 0) {
    return rows.map(toPost);
  }

  const ids = rows.map((r) => r.id);

  const [{ data: upvotes }, { data: saves }] = await Promise.all([
    supabase.from("post_upvotes").select("post_id").eq("user_id", userId).in("post_id", ids),
    supabase.from("post_saves").select("post_id").eq("user_id", userId).in("post_id", ids),
  ]);

  const upvotedSet = new Set((upvotes ?? []).map((u: { post_id: string }) => u.post_id));
  const savedSet = new Set((saves ?? []).map((s: { post_id: string }) => s.post_id));

  return rows.map((r) => ({
    ...toPost(r),
    has_upvoted: upvotedSet.has(r.id),
    has_saved: savedSet.has(r.id),
  }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPost(r: any): Post {
  return {
    id: r.id,
    user_id: r.user_id,
    type: r.type,
    title: r.title,
    body: r.body,
    image_url: r.image_url,
    topic: r.topic,
    upvotes: r.upvotes ?? 0,
    created_at: r.created_at,
    author: r.author ?? { id: "", full_name: null, username: null, avatar_url: null, plan: "free" },
    comment_count: r.comments?.[0]?.count ?? 0,
    has_upvoted: false,
    has_saved: false,
  };
}
