// "use server";

// // Client actions that call server actions
// export async function refreshSummaryClient() {
//   const { getMonthlyFinancialSummary } =
//     await import("@/app/transactions/services/transactions.service");
//   return await getMonthlyFinancialSummary();
// }

// export async function refreshDailySummaryClient() {
//   const { getDailySummaryByMonth } =
//     await import("@/app/transactions/services/transactions.service");
//   return await getDailySummaryByMonth();
// }

// export async function refreshAccountBalancesClient() {
//   const { getAccountBalances } =
//     await import("@/app/accounts/accounts.service");
//   return await getAccountBalances();
// }
