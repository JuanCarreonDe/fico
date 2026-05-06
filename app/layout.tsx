import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "../lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "../components/theme-provider";
import { NavigationWrapper } from "@/components/navigation-wrapper";
import { AuthProvider } from "@/components/auth-provider";
import { AuthSync } from "@/components/auth-sync";
import PageTransition from "@/components/page-transition";
import { getUserAccentColor } from "@/lib/server/get-user-accent-color";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Fico",
  description: "Aplicación de finanzas personales",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/FICOicon.svg", type: "image/svg+xml" }],
    apple: [
      {
        url: "/appstore-images/ios/180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
  interactiveWidget: "resizes-content" as const,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accentColor = await getUserAccentColor();

  return (
    <html
      className={cn(" font-sans", geist.variable)}
      lang="es"
      suppressHydrationWarning
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { --accent: ${accentColor}; }`,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Neon Glow Background - outside the clipped container */}
          <div className="ne-bg">
            <div className="ne-glow"></div>
            <div className="ne-orb"></div>
            {/* <div className="ne-particles"></div> */}
            <div className="ne-ring ne-ring-1"></div>
            <div className="ne-ring ne-ring-2"></div>
            <div className="ne-ring ne-ring-3"></div>
            <div className="ne-vignette"></div>
          </div>
          <AuthProvider>
            <AuthSync />
            <div className="h-dvh bg-transparent overflow-hidden p-2 flex flex-col gap-4">
              <main className="overflow-auto flex-1 rounded-2xl relative ">
                <div className="min-h-full p-4">
                  <PageTransition>{children}</PageTransition>
                </div>
              </main>
              <div className="h-fit">
                <NavigationWrapper />
              </div>
              <Toaster position="top-center" />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
