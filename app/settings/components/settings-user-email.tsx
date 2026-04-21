"use client";

import { useAuth } from "@/components/auth-provider";

export default function SettingsUserEmail() {
  const { user } = useAuth();
  return (
    <div className="flex gap-1 transition-opacity duration-300 animate-in fade-in w-full items-center justify-between py-2">
      <span className="text-sm">Correo</span>
      <span className="text-sm text-muted-foreground">{user?.email}</span>
    </div>
  );
}
