"use client";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/components/auth-provider";
import AccountManage from "../accounts/account-manage";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
      <h1 className="text-2xl font-bold">Configuración</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Mis opciones</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Personaliza las opciones de tu cuenta y categorías
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Cuentas</span>
              <div className="w-fit">
                {accountBalances && (
                  <AccountManage
                    accountBalances={accountBalances}
                    formatCurrency={formatCurrency}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Categorías</span>
              <div className="w-fit">
                {userCategories && (
                  <CategoryManage categories={userCategories} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Perfil</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Actualiza tu información personal
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Correo</span>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Tema</span>
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
