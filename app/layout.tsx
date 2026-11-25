import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";

import "./globals.css";

// Define local fonts with CSS variables
const charismaExtraBold = localFont({
  src: "../public/fonts/CharismaTF-ExtraBold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-charisma-extra-bold",
});

const charismaRegular = localFont({
  src: "../public/fonts/CharismaTF-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-charisma-regular",
});

const irSansXRegular = localFont({
  src: "../public/fonts/Woff2/IRSansXFaNum-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-irsansx-regular",
});

const irSansXMedium = localFont({
  src: "../public/fonts/Woff2/IRSansXFaNum-Medium.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-irsansx-medium",
});

const irSansXBold = localFont({
  src: "../public/fonts/Woff2/IRSansXFaNum-Bold.woff2",
  weight: "700",
  style: "normal",
  variable: "--font-irsansx-bold",
});

const montserrat = localFont({
  src: "../public/fonts/Montserrat-VariableFont.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Goal Leveling",
  description: "سیستم شخصی مدیریت هدف، مهارت و پیشرفت با گیمیفیکیشن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${charismaExtraBold.variable} ${charismaRegular.variable} ${irSansXRegular.variable} ${irSansXMedium.variable} ${irSansXBold.variable} ${montserrat.variable} rtl min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          enableColorScheme
        >
          <SessionProvider>
            <QueryProvider>
              <ConfirmProvider>
                <Navbar />
                {children}
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  toastOptions={{
                    style: {
                      fontSize: "14px",
                      direction: "rtl",
                    },
                  }}
                />
              </ConfirmProvider>
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
