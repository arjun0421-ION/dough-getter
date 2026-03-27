import { createClient } from "@/lib/supabase/server";
import AppShell from "@/components/layout/AppShell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile data if user exists
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, plan")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <AppShell
      user={
        user
          ? {
              email: user.email,
              full_name: profile?.full_name || undefined,
              avatar_url: profile?.avatar_url || undefined,
              plan: profile?.plan || undefined,
            }
          : null
      }
    >
      {children}
    </AppShell>
  );
}
