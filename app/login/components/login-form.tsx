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
import { login, signup } from "../actions";

export default async function LoginForm({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  const { redirectTo } = await searchParams;
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="border-0 ring-0">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <input
              type="hidden"
              name="redirectTo"
              value={redirectTo || "/transactions"}
            />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button formAction={login} type="submit" variant={"accent"}>
                  Login
                </Button>
                <Button formAction={signup} variant="outline" type="button">
                  Singup
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
