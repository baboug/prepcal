"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
      {children}
      <Toaster richColors />
    </ThemeProvider>
  );
}
