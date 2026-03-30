// "use client";

// import TransactionForm from "./transactions-form";
// import { TransactionList } from "./transactions-list";
// import { TransactionSummary } from "./transactions-summary";
// import { Database } from "@/database.types";
// import { useTransactionStore } from "@/lib/store/transaction-store";
// import { useEffect } from "react";

// interface Props {
//   summary: Database["public"]["Functions"]["get_monthly_financial_summary"]["Returns"];
//   userAccounts: Database["public"]["Functions"]["get_user_accounts"]["Returns"];
//   userCategories: Database["public"]["Functions"]["get_user_categories"]["Returns"];
//   dailySummaryCurrentMonth: Database["public"]["Functions"]["get_daily_summary_by_month"]["Returns"];
//   accountBalances: Database["public"]["Functions"]["get_account_balances"]["Returns"];
// }

// export default function TransactionPageClient({
//   summary,
//   userAccounts,
//   userCategories,
//   dailySummaryCurrentMonth,
//   accountBalances,
// }: Props) {
//   const { setSummary, setDailySummaryCurrentMonth, setAccountBalances } =
//     useTransactionStore();

//   // Initialize global state with server data
//   useEffect(() => {
//     setSummary(summary);
//     setDailySummaryCurrentMonth(dailySummaryCurrentMonth);
//     setAccountBalances(accountBalances);
//   }, [
//     summary,
//     dailySummaryCurrentMonth,
//     accountBalances,
//     setSummary,
//     setDailySummaryCurrentMonth,
//     setAccountBalances,
//   ]);

//   // Get data from store for reactive updates
//   const {
//     summary: globalSummary,
//     dailySummaryCurrentMonth: globalDailySummary,
//     accountBalances: globalAccountBalances,
//   } = useTransactionStore();

//   return (
//     <div className="p-4 h-full flex flex-col gap-4">
//       <div>
//         <TransactionSummary
//           summary={globalSummary || summary}
//           accountBalances={globalAccountBalances || accountBalances}
//         />
//         <div className="flex flex-col gap-4">
//           <TransactionList
//             dailySummaryCurrentMonth={
//               globalDailySummary || dailySummaryCurrentMonth
//             }
//           />
//         </div>
//       </div>
//       <div className="fixed bottom-30 right-10">
//         <TransactionForm
//           userAccounts={userAccounts}
//           userCategories={userCategories}
//         />
//       </div>
//     </div>
//   );
// }
