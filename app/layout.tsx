import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "level up!",
  description: "created with love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}
