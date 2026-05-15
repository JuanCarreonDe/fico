import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/db/proxy";

export default async function proxy(request: NextRequest) {
  const { response: supabaseResponse, user } = await updateSession(request);

  // Rutas protegidas
  const protectedRoutes = [
    "/account",
    "/dashboard",
    "/settings",
    "/transactions",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  // Si no está autenticado y trata de acceder a ruta protegida
  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado y trata de acceder a /login
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|login|$).*)",
  ],
};
