import { timingSafeEqual } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { createAdmin } from "@/lib/db/admin";

export const maxDuration = 30;

const DEDUP_WINDOW_MS = 5 * 60_000;

type IngestBody = {
  user_id?: unknown;
  text?: unknown;
  app?: unknown;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Evita un lookup a GoTrue por cada notificación.
let cachedUserId: string | null = null;

function secretMatches(provided: string): boolean {
  const expected = process.env.INGEST_SECRET ?? "";
  if (!expected || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  console.log("🚀 ~ POST ~ request:", request);
  const bearer = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  if (!bearer || !secretMatches(bearer)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as IngestBody | null;
  const userId = typeof body?.user_id === "string" ? body.user_id.trim() : "";
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const app = typeof body?.app === "string" ? body.app.trim() : "unknown";

  if (!userId || !UUID_RE.test(userId) || !text) {
    return NextResponse.json(
      { error: "user_id (uuid) and text are required" },
      { status: 400 },
    );
  }

  const db = createAdmin();

  if (!cachedUserId) {
    const { data, error } = await db.auth.admin.getUserById(userId);
    if (error || !data.user) {
      return NextResponse.json(
        { error: `no user found for ${userId}` },
        { status: 404 },
      );
    }
    cachedUserId = data.user.id;
  }

  // MacroDroid puede reintentar si la respuesta tarda (cold start). Si el
  // mismo texto ya entró hace poco, lo damos por procesado.
  const since = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString();
  const { data: duplicate } = await db
    .from("transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("raw_text", text)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (duplicate) {
    return NextResponse.json({ duplicate: true, id: duplicate.id });
  }

  const [{ data: accounts }, { data: categories }] = await Promise.all([
    db
      .from("accounts")
      .select("id,name,type")
      .eq("user_id", userId)
      .eq("is_archived", false),
    db
      .from("categories")
      .select("id,name,type")
      .eq("user_id", userId)
      .eq("is_archived", false),
  ]);

  if (!accounts?.length || !categories?.length) {
    return NextResponse.json(
      { error: "user has no active accounts or categories" },
      { status: 409 },
    );
  }

  // TODO(etapa 6): reemplazar por la clasificación con IA.
  const account = accounts[0];
  const category =
    categories.find((c) => c.type === "expense") ?? categories[0];

  const { data: inserted, error } = await db
    .from("transactions")
    .insert({
      user_id: userId,
      account_id: account.id,
      category_id: category.id,
      type: "expense",
      amount: 30,
      description: "prueba de ingesta",
      transaction_date: new Date().toLocaleDateString("en-CA"),
      source: "auto",
      raw_text: text,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: inserted.id,
      account: account.name,
      category: category.name,
      app,
    },
    { status: 201 },
  );
}
