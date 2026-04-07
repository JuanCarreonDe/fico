"use client";
import CategoryForm from "../categories/category-form";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/components/auth-provider";
import { AccountDetailsCarousel } from "../accounts/account-details-carousel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AccountForm from "../accounts/account-form";
import CategoryManage from "../categories/category-manage";
import { useTransactionStore } from "@/lib/store/transaction-store";

export default function SettingsPage() {
  const { user } = useAuth();
  const userCategories = useTransactionStore((state) => state.userCategories);
  const accountBalances = useTransactionStore((state) => state.accountBalances);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">My options</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Customize your account and categories options
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Accounts</span>
              <div className="flex gap-2">
                <div className="w-20">
                  {accountBalances && (
                    <AccountDetailsCarousel
                      accountBalances={accountBalances}
                      formatCurrency={formatCurrency}
                      label="Edit"
                    />
                  )}
                </div>
                <AccountForm />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Categories</span>
              <div className="flex gap-2">
                <div className="w-20">
                  {userCategories && (
                    <CategoryManage categories={userCategories} />
                  )}
                </div>
                <CategoryForm />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Profile Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your personal information
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Email</span>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Theme</span>
              <span className="text-sm text-muted-foreground">
                <ThemeToggle />
              </span>
            </div>
            <div className="flex w-full justify-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
