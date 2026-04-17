import { getCategoryBudgetSummary } from "./dashboard.service";
import DashboardBudgetList from "./dashboard-budget-list";

export default async function DashboardBudgetListWrapper() {
  const budgetData = await getCategoryBudgetSummary();

  return <DashboardBudgetList data={budgetData} />;
}
