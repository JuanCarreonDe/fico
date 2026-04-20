import { getAllCategoriesBudgetSummary } from "./dashboard.service";
import DashboardBudgetList from "./dashboard-budget-list";

export default async function DashboardBudgetListWrapper() {
  const budgetData = await getAllCategoriesBudgetSummary();

  return <DashboardBudgetList data={budgetData} />;
}
