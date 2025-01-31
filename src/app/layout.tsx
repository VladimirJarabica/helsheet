import { skSK } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "./components/Header";
import NewSheetButton from "./components/NewSheetButtonServer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HelSheet",
  description: "Zápis piesní pre Heligonkárov",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={skSK}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-hel-bgDefault`}
        >
          <Header newSheetButton={<NewSheetButton size="small" />} />
          <main className="flex justify-center">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
