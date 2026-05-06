import { createClient } from "@/lib/db/server";

export async function getUserAccentColor(): Promise<string> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return "#ff7301";

    const { data } = await supabase
      .from("profiles")
      .select("accent_color")
      .eq("id", user.id)
      .single();

    return data?.accent_color || "#ff7301";
  } catch {
    return "#ff7301";
  }
}