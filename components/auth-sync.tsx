"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db/client";

export function AuthSync() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in, refreshing page...");
        // Force a refresh to ensure all components get the updated user state
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null;
}
