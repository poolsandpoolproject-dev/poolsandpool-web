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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://poolsandpool.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pools & Pool - Luxurious Lounge & Bar",
    template: "%s | Pools & Pool",
  },
  description:
    "Digital menu for Pools & Pool Luxurious Lounge & Bar. Browse our menu of food, drinks, and more.",
  keywords: ["Pools & Pool", "lounge", "bar", "menu", "food", "drinks", "cocktails"],
  openGraph: {
    type: "website",
    locale: "en",
    url: siteUrl,
    siteName: "Pools & Pool",
    title: "Pools & Pool - Luxurious Lounge & Bar",
    description:
      "Digital menu for Pools & Pool Luxurious Lounge & Bar. Browse our menu of food, drinks, and more.",
    images: [
      {
        url: "/graph.png",
        width: 1200,
        height: 630,
        alt: "Pools & Pool - Luxurious Lounge & Bar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pools & Pool - Luxurious Lounge & Bar",
    description:
      "Digital menu for Pools & Pool Luxurious Lounge & Bar. Browse our menu of food, drinks, and more.",
    images: ["/graph.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
