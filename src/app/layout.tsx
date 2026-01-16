import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Battle Cards Arena",
  description: "Um jogo de cartas em React + Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
