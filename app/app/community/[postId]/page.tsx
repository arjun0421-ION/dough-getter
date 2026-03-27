import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getPostById } from "@/lib/community/posts";
import { getComments } from "@/lib/community/comments";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import CommentThread from "@/components/community/CommentThread";
import CommentForm from "@/components/community/CommentForm";
import { timeAgo } from "@/lib/utils/time";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

const PLAN_BADGE: Record<string, { label: string; variant: "caramel" | "sage" }> = {
  monthly: { label: "Pro Baker", variant: "caramel" },
  yearly: { label: "Early Backer", variant: "sage" },
};

const TYPE_COLORS: Record<string, string> = {
  question: "bg-purple-lt text-purple",
  share: "bg-sage-lt text-sage",
  discussion: "bg-sage-lt text-sage",
};

const TYPE_LABELS: Record<string, string> = {
  question: "question",
  share: "discussion",
  discussion: "discussion",
};

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { postId } = await params;
  const [post, comments] = await Promise.all([
    getPostById(postId, user.id),
    getComments(postId, user.id),
  ]);

  if (!post) notFound();

  const authorName = post.author.full_name ?? post.author.username ?? "Baker";
  const planBadge = PLAN_BADGE[post.author.plan];

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/app/community"
        className="flex items-center gap-1 text-sm text-text-mid hover:text-brown"
      >
        <ChevronLeft className="w-4 h-4" />
        Community
      </Link>

      {/* Post */}
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Avatar src={post.author.avatar_url} name={authorName} size="sm" />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-brown">{authorName}</span>
              {planBadge && <Badge variant={planBadge.variant}>{planBadge.label}</Badge>}
            </div>
            <span className="text-xs text-text-light">{timeAgo(post.created_at)}</span>
          </div>
          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_COLORS[post.type] ?? TYPE_COLORS.discussion}`}>
            {TYPE_LABELS[post.type] ?? "discussion"}
          </span>
        </div>

        <div>
          <h1 className="text-xl font-serif font-bold text-brown">{post.title}</h1>
          <p className="text-text-dark mt-2 whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>
        </div>

        {post.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt="Post image"
            className="rounded-xl w-full object-cover max-h-80"
          />
        )}

        <div className="text-xs text-text-light pt-1">
          {post.upvotes} upvotes · {post.comment_count} comments
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="font-semibold text-brown">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </h2>
        <CommentThread
          comments={comments}
          postAuthorId={post.user_id}
          userId={user.id}
          isQuestion={post.type === "question"}
        />
        <div className="pt-2">
          <CommentForm postId={post.id} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
