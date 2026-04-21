import {
  getUserAccounts,
  getUserCategories,
} from "../services/transactions.service";
import FloatingActions from "./floating-actions";

export default async function FloatingActionsWrapper() {
  const [userAccounts, userCategories] = await Promise.all([
    getUserAccounts(),
    getUserCategories(),
  ]);
  return (
    <FloatingActions
      userAccounts={userAccounts}
      userCategories={userCategories}
    />
  );
}
