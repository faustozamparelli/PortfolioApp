import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Attribution from "@/components/attribution";
import PageTransition from "@/components/page-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Personal Portfolio",
  description:
    "A personal website showcasing projects, experience, and hobbies",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="portfolio-theme"
          forcedTheme="dark"
        >
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Attribution />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
