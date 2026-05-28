import type { Metadata } from "next";
import { Caveat, Nunito, Special_Elite } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const specialElite = Special_Elite({
  variable: "--font-letter",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Personalized Memory Letters",
  description: "A private memory letter for each friend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${caveat.variable} ${specialElite.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
