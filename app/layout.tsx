import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "gym app",
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
