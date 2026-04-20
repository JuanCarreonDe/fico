import { getUserCategories } from "../transactions/services/transactions.service";
import CategoryManage from "./category-manage";

export default async function CategoryManageWrapper() {
  const categories = await getUserCategories();
  return <CategoryManage categories={categories} />;
}
