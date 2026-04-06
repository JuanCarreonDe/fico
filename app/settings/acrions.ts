"use server";
import { createClient } from "@/lib/db/server";

export async function getProfile(userId: string) {
  const db = await createClient();

  const { data, error } = await db
    .from("profiles")
    .select(`full_name, username`)
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}
