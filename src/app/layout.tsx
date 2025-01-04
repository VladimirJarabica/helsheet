import { skSK } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { getTags } from "../utils/tags";
import Header from "./components/Header";
import { TagsContextProvider } from "./components/TagsContext";
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
  const tags = await getTags();
  return (
    <ClerkProvider localization={skSK}>
      <TagsContextProvider tags={tags}>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-hel-bgDefault`}
          >
            <Header />
            <main className="flex justify-center">
              <div className="max-w-full mx-4">{children}</div>
            </main>
          </body>
        </html>
      </TagsContextProvider>
    </ClerkProvider>
  );
}
