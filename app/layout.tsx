import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BloomTV",
  description: "BloomTV where moments Bloom Live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="sakura">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-theme text-theme`}
        >
          <ThemeProvider>{children}</ThemeProvider>

          <Toaster theme="light" position="bottom-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
