import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const zalora = localFont({
  src: "../public/zalora-regular.otf",
  variable: "--font-zalora",
  display: "swap",
  weight: "400",
});

const zaloraDisplay = localFont({
  src: "../public/zalora-inline-bold-grunge.otf",
  variable: "--font-zalora-display",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Pools & Pool - Luxurious Lounge & Bar",
  description: "Digital menu for Pools & Pool Luxurious Lounge & Bar. Browse our menu of food, drinks, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${zalora.variable} ${zaloraDisplay.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
