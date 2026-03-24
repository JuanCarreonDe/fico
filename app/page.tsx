export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="text-muted-foreground">
        Welcome to your financial control application. Navigate through
        different sections using the navigation menu above.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Balance
              </span>
              <span className="font-semibold">$12,450.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Monthly Income
              </span>
              <span className="font-semibold text-green-600">+$3,200.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Monthly Expenses
              </span>
              <span className="font-semibold text-red-600">-$1,850.00</span>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="text-sm font-medium">Grocery Store</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <span className="text-sm font-medium text-red-600">-$85.20</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="text-sm font-medium">Salary Deposit</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
              <span className="text-sm font-medium text-green-600">
                +$3,200.00
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium">Electric Bill</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <span className="text-sm font-medium text-red-600">-$120.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">Navigation Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-1">Dashboard</h3>
            <p className="text-muted-foreground">
              View your financial overview and analytics
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-1">Transactions</h3>
            <p className="text-muted-foreground">
              Manage and track all your transactions
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-1">Accounts</h3>
            <p className="text-muted-foreground">
              Manage your bank accounts and cards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
