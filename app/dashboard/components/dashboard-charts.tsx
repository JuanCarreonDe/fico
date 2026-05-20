import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { CategoryIconDisplay } from "@/lib/get-category-icon";

function DashboardCharts({
  categoryData,
}: {
  categoryData: { category_name: string; total_amount: number; category_icon: string | null }[];
}) {
  const pieData = categoryData.map((item) => ({
    name: item.category_name,
    value: Number(item.total_amount),
    category_icon: item.category_icon,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Gastos por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="space-y-2">
              {pieData.map((item) => {
                const total = pieData.reduce((sum, p) => sum + p.value, 0);
                const percent = (item.value / total) * 100;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIconDisplay icon={item.category_icon ?? null} type="expense" className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(item.value)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percent.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No hay gastos este mes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export { DashboardCharts };
