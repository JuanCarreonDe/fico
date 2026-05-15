"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/db/client";
import { useAuthStore } from "@/lib/store/auth-store";

async function applyUserAccentColor(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("accent_color")
    .eq("id", userId)
    .single();

  if (data?.accent_color) {
    document.documentElement.style.setProperty("--accent", data.accent_color);
    localStorage.setItem("fico-accent", data.accent_color);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);

      if (user?.id) {
        applyUserAccentColor(supabase, user.id);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user?.id) {
          applyUserAccentColor(supabase, session.user.id);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
        localStorage.removeItem("fico-accent");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser, setLoading]);

  return <>{children}</>;
}

export const useAuth = () => {
  const { user, loading } = useAuthStore();
  return { user, loading };
};
