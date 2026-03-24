export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your dashboard. This is an example page showing how the navigation works.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Overview</h3>
          <p className="text-sm text-muted-foreground">View your financial overview</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Check your recent transactions</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">Analyze your spending patterns</p>
        </div>
      </div>
    </div>
  );
}
