import { getAccountBalances } from "@/app/accounts/accounts.service";
import AccountManageClient from "./account-manage-client";

export default async function AccountManageWrapper() {
  const accountBalances = await getAccountBalances();

  return <AccountManageClient accountBalances={accountBalances} />;
}
