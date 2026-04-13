import { Database } from "@/database.types";
import { createClient } from "@/lib/db/server";

export async function getDailySummaryByMonth(
  params: Database["public"]["Functions"]["get_category_summary"]["Args"],
) {
  const db = await createClient();

  const { data, error } = await db.rpc("get_category_summary", params);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
