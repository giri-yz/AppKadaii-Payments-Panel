import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectsProvider } from "@/contexts/ProjectsContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppKadaii Payments Panel",
  description: "Offline-first PWA to track project income and expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className={`${inter.className} dark bg-background text-foreground`}>
        <AuthProvider>
          <ProjectsProvider>
            {children}
            <Toaster />
          </ProjectsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
