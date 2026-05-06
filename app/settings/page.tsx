import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AccountManageWrapper from "../transactions/components/account-manage-wrapper";
import CategoryManageWrapper from "../categories/category-manage-wrapper";
import SettingsUserEmail from "./components/settings-user-email";
import AccentColorPicker from "./components/accent-color-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function SettingsPage() {
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
                <Suspense fallback={<Skeleton className="h-12 w-12" />}>
                  <AccountManageWrapper />
                </Suspense>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Categorías</span>
              <div className="w-fit">
                <Suspense fallback={<Skeleton className="h-12 w-12" />}>
                  <CategoryManageWrapper />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold mb-2">Perfil</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Cerrar sesión y cambiar tema
          </p>
          <div className="space-y-2">
            <div className="">
              <Suspense fallback={<Skeleton className="h-6 w-45" />}>
                <SettingsUserEmail />
              </Suspense>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Tema</span>
              <span className="text-sm text-muted-foreground">
                <ThemeToggle />
              </span>
            </div>
            <AccentColorPicker />
            <div className="flex w-full justify-center pt-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
