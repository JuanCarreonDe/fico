import { getAllCategoriesBudgetSummary } from "./dashboard.service";
import DashboardBudgetList from "./dashboard-budget-list";

interface DashboardBudgetListWrapperProps {
  month?: string;
}

export default async function DashboardBudgetListWrapper({
  month,
}: DashboardBudgetListWrapperProps) {
  const budgetData = await getAllCategoriesBudgetSummary({ p_month: month });

  return <DashboardBudgetList data={budgetData} />;
}
