import { createClient } from "@/lib/db/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const db = await createClient();

  const {
    data: { user },
  } = await db.auth.getUser();

  if (user) {
    await db.auth.signOut();
  }

  revalidatePath("/", "layout");

  const origin = req.headers.get("origin") || req.nextUrl.origin;
  return NextResponse.redirect(`${origin}/login`, {
    status: 302,
  });
}
