import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import Providers from "@/components/providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | PrepCal",
    default: "PrepCal - Automated meal planning for lifters",
  },
  description: "Streamline your meal prep with an AI-powered meal planner designed to help you achieve your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
