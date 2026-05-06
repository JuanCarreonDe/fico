"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
      });

      if (response.ok || response.redirected) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button
        className={`button block ${className}`}
        type="submit"
        variant={"destructive"}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Cerrando sesión...
          </span>
        ) : (
          "Cerrar sesión"
        )}
      </Button>
    </form>
  );
}