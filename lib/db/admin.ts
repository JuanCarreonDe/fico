import "server-only";

import { createClient } from "@supabase/supabase-js";

import { Database } from "@/database.types";

/**
 * Cliente Supabase con service role: salta RLS y no depende de cookies.
 *
 * Úsalo solo desde Route Handlers o Server Actions. El import de
 * "server-only" hace que Next falle el build si llega a un componente
 * cliente, que es la única forma de que la llave termine en el bundle.
 */
export const createAdmin = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

export type AdminClient = ReturnType<typeof createAdmin>;
