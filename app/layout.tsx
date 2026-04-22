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

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FICO",
  description: "Aplicación de finanzas personales",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/FICOicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/appstore-images/ios/180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
  interactiveWidget: "resizes-content" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(" font-sans", geist.variable)}
      lang="es"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthSync />
            <div className="h-dvh bg-background overflow-hidden p-2 flex flex-col gap-4">
              {/* <div className="h-dvh bg-background overflow-hidden p-2 flex flex-col gap-4 bg-[radial-gradient(ellipse_at_top_right,var(--accent)_1%,transparent_50%)]"> */}
              <main className="overflow-auto flex-1 rounded-2xl relative bg-card">
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
