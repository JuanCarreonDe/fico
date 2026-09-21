import { getAccountBalances } from "@/app/accounts/accounts.service";
import { getUserAccounts } from "@/app/transactions/services/transactions.service";
import AccountManageClient from "./account-manage-client";

export default async function AccountManageWrapper() {
  const [accountBalances, userAccounts] = await Promise.all([
    getAccountBalances(),
    getUserAccounts(),
  ]);

  return (
    <AccountManageClient
      accountBalances={accountBalances}
      userAccounts={userAccounts}
    />
  );
}
