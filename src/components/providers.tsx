"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

import { TRPCReactProvider } from "@/lib/trpc/client";
import { AuthProvider } from "@/modules/auth/ui/components/auth-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      <TRPCReactProvider>
        <AuthProvider>{children}</AuthProvider>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
        <Toaster richColors />
      </TRPCReactProvider>
    </ThemeProvider>
  );
}
