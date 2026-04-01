import { Database } from "@/database.types";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "./server";
import { unstable_cache } from "next/cache";

// Función para obtener el user ID de forma segura
async function getUserId(): Promise<string> {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  return user?.id || "anonymous";
}

// Wrapper para crear cache functions con user ID
export function createUserCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
) {
  return unstable_cache(
    async (...args: Parameters<T>) => {
      console.log(`🔄 Cache miss for ${cacheKey} - llamando a Supabase`);
      return await fn(...args);
    },
    [cacheKey],
    {
      revalidate: 3600, // 1 hora
      tags: [cacheKey],
    },
  );
}

// Funciones de cache con user ID dinámico
export const getCachedUserAccounts = async () => {
  const userId = await getUserId();
  const cacheKey = `user-accounts-${userId}`;

  return createUserCache(async () => {
    const db = await createClient();
    const { data, error } = await db.rpc("get_user_accounts");
    if (error) throw error;
    return data;
  }, cacheKey)();
};

export const getCachedUserCategories = async () => {
  const userId = await getUserId();
  const cacheKey = `user-categories-${userId}`;

  return createUserCache(async () => {
    const db = await createClient();
    const { data, error } = await db.rpc("get_user_categories");
    if (error) throw error;
    return data;
  }, cacheKey)();
};

export const getCachedAccountBalances = async () => {
  const userId = await getUserId();
  const cacheKey = `account-balances-${userId}`;

  return createUserCache(async () => {
    const db = await createClient();
    const { data, error } = await db.rpc("get_account_balances");
    if (error) throw error;
    return data;
  }, cacheKey)();
};

export const getCachedMonthlySummary = async () => {
  const userId = await getUserId();
  const cacheKey = `monthly-summary-${userId}`;

  return createUserCache(async () => {
    const db = await createClient();
    const { data, error } = await db.rpc("get_monthly_financial_summary");
    if (error) throw error;
    return data;
  }, cacheKey)();
};

export const getCachedDailySummary = async () => {
  const userId = await getUserId();
  const cacheKey = `daily-summary-${userId}`;

  return createUserCache(async () => {
    const db = await createClient();
    const { data, error } = await db.rpc("get_daily_summary_by_month");
    if (error) throw error;
    return data;
  }, cacheKey)();
};
