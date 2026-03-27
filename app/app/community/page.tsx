import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getPosts } from "@/lib/community/posts";
import { PostFilter, PostSort, PostTopic } from "@/lib/community/types";
import CommunityFeed from "@/components/community/CommunityFeed";

interface CommunityPageProps {
  searchParams: Promise<{ topic?: string; sort?: string }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { topic = "all", sort = "latest" } = await searchParams;

  const filter: PostFilter = {
    topic: topic as PostTopic | "all" | "saved",
    sort: sort as PostSort,
  };

  const posts = await getPosts(filter, user.id);

  return (
    <div className="py-6 px-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-brown">Community</h1>
        <p className="text-text-mid mt-1">Ask questions and join discussions with fellow bakers.</p>
      </div>

      <CommunityFeed
        posts={posts}
        userId={user.id}
        activeTopic={topic}
        activeSort={sort}
      />
    </div>
  );
}
