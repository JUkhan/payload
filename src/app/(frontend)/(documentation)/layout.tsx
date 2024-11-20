import { FumadocsProvider } from "@/providers/fumadocs-provider";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <FumadocsProvider>{children}</FumadocsProvider>
      </body>
    </html>
  );
}
