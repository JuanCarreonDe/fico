import { Button } from "./ui/button";

export function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <Button
        className={`button block ${className}`}
        type="submit"
        variant={"destructive"}
      >
        Sign out
      </Button>
    </form>
  );
}
