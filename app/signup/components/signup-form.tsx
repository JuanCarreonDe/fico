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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { signup } from "../../login/actions";

function SignupFormFields() {
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
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creando cuenta...
            </span>
          ) : (
            "Crear cuenta"
          )}
        </Button>
      </Field>
    </>
  );
}

function SignupFormInner() {
  const searchParamsHook = useSearchParams();
  const error = searchParamsHook.get("error");
  const toastShown = useRef(false);

  useEffect(() => {
    if (error && !toastShown.current) {
      toastShown.current = true;
      toast.error(error);
    }
  }, [error]);

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="border-0 ring-0">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para empezar a controlar tus finanzas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup}>
            <input type="hidden" name="redirectTo" value="/login" />
            <FieldGroup>
              <SignupFormFields />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="text-accent-foreground underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}

export default function SignupForm() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SignupFormInner />
    </Suspense>
  );
}