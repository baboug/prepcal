"use client";

import { ThemeProvider } from "next-themes";

import { AuthProvider } from "@/modules/auth/components/auth-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <AuthProvider>{children}</AuthProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
