"use client";

import { useState } from "react";
import { Post } from "@/lib/community/types";
import PostCard from "./PostCard";
import TopicSidebar from "./TopicSidebar";
import NewPostModal from "./NewPostModal";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface CommunityFeedProps {
  posts: Post[];
  userId: string;
  activeTopic: string;
  activeSort: string;
}

export default function CommunityFeed({ posts, userId, activeTopic, activeSort }: CommunityFeedProps) {
  const [newPostOpen, setNewPostOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/app/community?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <TopicSidebar activeTopic={activeTopic} />

      <div className="flex-1 min-w-0 space-y-4">
        {/* Mobile topic chips rendered inside TopicSidebar via md:hidden */}

        {/* Sort + new post header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 bg-white border border-border rounded-lg p-0.5">
            {["latest", "top"].map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                  activeSort === s ? "bg-caramel text-white" : "text-text-mid hover:text-brown"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setNewPostOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New post
          </Button>
        </div>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-text-light">
            <p className="text-lg font-serif text-brown mb-2">Nothing here yet</p>
            <p className="text-sm">Be the first to post in this topic.</p>
            <button
              onClick={() => setNewPostOpen(true)}
              className="mt-4 text-caramel text-sm font-medium underline"
            >
              Start a post →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} userId={userId} />
            ))}
          </div>
        )}
      </div>

      <NewPostModal
        isOpen={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        userId={userId}
      />
    </div>
  );
}
