import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { skSK } from "@clerk/localizations";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("skSK", skSK);
  return (
    <ClerkProvider localization={skSK}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#e0dac8]`}
        >
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
