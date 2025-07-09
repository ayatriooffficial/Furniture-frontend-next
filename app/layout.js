import {  Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider";
import { GoogleTagManager } from "@next/third-parties/google";
import FooterWrapper from "@/components/FooterWrapper/FooterWrapper";
import NextTopLoader from "nextjs-toploader";
import { BASE_URL } from "@/constants/base-url";
import SwiperProvider from "@/providers/SwiperProvider";





const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Ayatrio: Buy Home Furnishing & Decor Products Online at Best Price",
  },
  description:
    "India's biggest home furnishing & decor solutions: Get Upto 50% Off on Wallpaper, Flooring, Curtain, Bedding, Mattresses, Cushion & Covers, Dinner & Kitchenware. Free Shipping & Cash on Delivery Available.",
  openGraph: {
    title: "Ayatrio: Buy Home Furnishing & Decor Products Online at Best Price",
    description:
      "India's biggest home furnishing & decor solutions: Get Upto 50% Off on Wallpaper, Flooring, Curtain, Bedding, Mattresses, Cushion & Covers, Dinner & Kitchenware.",
    images: [
      {
        url: "/ayatrio-room.jpg",
        width: 600,
        height: 600,
        alt: "Ayatrio: Buy Home Furnishing & Decor Products Online at Best Price",
      },
    ],
  },
  applicationName: "Ayatrio Furnishing",
  keywords: [
    "Ayatrio",
    "Flooring store",
    "Wallpaper store",
    "Custom Wallpaper",
    "Wooden Flooring",
    "Curtains",
    "Blinds",
    "Laminate & Vinyl Floors",
  ],
  authors: [{ name: "Ayatrio" }],
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-US": "/en-US",
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en" className={`${inter.variable}`}>
      {process.env.NEXT_PUBLIC_ENABLE_GTM === "true" && (
        <GoogleTagManager gtmId={gtmId} />
      )}
      <body>
        <Providers>
          <SwiperProvider>
            <NextTopLoader color="#000" showSpinner={false} zIndex={99999} />
            {children}
            <FooterWrapper />
          </SwiperProvider>
        </Providers>
      </body>
    </html>
  );
}
