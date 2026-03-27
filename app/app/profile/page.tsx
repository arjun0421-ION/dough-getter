import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ProfileTabs from "@/components/profile/ProfileTabs";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { getPosts } from "@/lib/community/posts";
import { getFormulas } from "@/lib/formulas/saved";
import ManageSubscriptionButton from "@/components/profile/ManageSubscriptionButton";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";

  // Fetch posts, saved posts, and formulas in parallel
  const [userPosts, savedPosts, formulas] = await Promise.all([
    // User's own posts
    supabase
      .from("posts")
      .select("*, author:profiles(id, full_name, username, avatar_url, plan), comments(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => data ?? []),
    // Posts the user saved
    getPosts({ topic: "saved" }, user.id),
    // Saved formulas
    getFormulas(user.id),
  ]);

  const planBadge =
    plan === "yearly"
      ? { label: "Early Backer", variant: "sage" as const }
      : plan === "monthly"
      ? { label: "Pro Baker", variant: "caramel" as const }
      : { label: "Free Plan", variant: "gray" as const };

  const experienceLabel = profile?.experience_level
    ? profile.experience_level.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
    : null;

  const postsForTabs = userPosts.map((p: Record<string, unknown>) => ({
    ...(p as object),
    author: (p.author as Record<string, unknown>) ?? { id: "", full_name: null, username: null, avatar_url: null, plan: "free" },
    comment_count: Array.isArray(p.comments) ? (p.comments[0] as Record<string, number>)?.count ?? 0 : 0,
    has_upvoted: false,
    has_saved: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })) as any[];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Profile header */}
      <Card hover={false}>
        <div className="flex items-start gap-4">
          <Avatar
            src={profile?.avatar_url}
            name={profile?.full_name ?? user.email ?? "User"}
            size="lg"
          />
          <div className="flex-1">
            <h1 className="text-xl font-serif font-bold text-brown">
              {profile?.full_name ?? "Baker"}
            </h1>
            {profile?.username && (
              <p className="text-sm text-text-light">@{profile.username}</p>
            )}
            <p className="text-sm text-text-mid">{user.email}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Badge variant={planBadge.variant}>{planBadge.label}</Badge>
              {experienceLabel && <Badge variant="purple">{experienceLabel}</Badge>}
            </div>
          </div>
        </div>

        {/* Manage subscription */}
        {plan !== "free" && (
          <div className="mt-4 pt-4 border-t border-border">
            <ManageSubscriptionButton />
          </div>
        )}
      </Card>

      {/* Edit profile */}
      <Card hover={false}>
        <h2 className="font-semibold text-brown mb-4">Edit profile</h2>
        <EditProfileForm
          userId={user.id}
          initialName={profile?.full_name ?? ""}
          initialUsername={profile?.username ?? ""}
          initialExperienceLevel={profile?.experience_level ?? "home_baker"}
        />
      </Card>

      {/* Tabs: Posts / Saved / Formulas */}
      <ProfileTabs
        userId={user.id}
        posts={postsForTabs}
        savedPosts={savedPosts}
        formulas={formulas}
      />
    </div>
  );
}

