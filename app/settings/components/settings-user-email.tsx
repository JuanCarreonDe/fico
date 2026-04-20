"use client";

import { useAuth } from "@/components/auth-provider";

export default function SettingsUserEmail() {
  const { user } = useAuth();
  return (
    <>
      <span className="text-sm">Correo</span>
      <span className="text-sm text-muted-foreground">{user?.email}</span>
    </>
  );
}
