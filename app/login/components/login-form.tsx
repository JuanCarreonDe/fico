"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "../../login/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, startTransition, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function LoginFormFields() {
  const { pending } = useFormStatus();

  return (
    <>
      <Field>
        <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
        <Input
          name="email"
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          required
          disabled={pending}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Contraseña</FieldLabel>
        <PasswordInput
          id="password"
          name="password"
          required
          disabled={pending}
          placeholder="••••••••"
        />
      </Field>
      <Field>
        <Button type="submit" variant={"accent"} disabled={pending}>
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Iniciando sesión...
            </span>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </Field>
    </>
  );
}

function LoginFormInner() {
  const searchParamsHook = useSearchParams();
  const success = searchParamsHook.get("success");
  const error = searchParamsHook.get("error");
  const toastShown = useRef({ success: false, error: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEMO !== "true") return;

    const form = formRef.current;
    if (!form) return;

    setIsDemoLoggingIn(true);

    const formData = new FormData(form);
    formData.set("email", "test@test.com");
    formData.set("password", "test123");

    startTransition(() => {
      login(formData);
    });
  }, []);

  useEffect(() => {
    if (success === "signup" && !toastShown.current.success) {
      toastShown.current.success = true;
      toast.success("Revisa tu correo para confirmar tu cuenta");
    }
  }, [success]);

  useEffect(() => {
    if (error && !toastShown.current.error) {
      toastShown.current.error = true;
      toast.error(error);
    }
  }, [error]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      {isDemoLoggingIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 shadow-lg">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Iniciando sesión como usuario de prueba...
            </p>
          </div>
        </div>
      )}

      <Card className="border-0 ring-0">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} ref={formRef}>
            <input type="hidden" name="redirectTo" value="/transactions" />
            <FieldGroup>
              <LoginFormFields />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link href="/signup" className="text-accent-foreground underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginFormInner />
    </Suspense>
  );
}