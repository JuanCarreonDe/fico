import LoginForm from "./components/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  return (
    <div className="h-full flex justify-center flex-col">
      <LoginForm searchParams={searchParams} />
    </div>
  );
}
