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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { toast } from "sonner";
import { signup } from "../../login/actions";

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
          <form method="POST">
            <input type="hidden" name="redirectTo" value="/login" />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button type="submit" variant="accent" formAction={signup}>
                  Crear cuenta
                </Button>
              </Field>
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
