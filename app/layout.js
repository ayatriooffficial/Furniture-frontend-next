import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RootProviders } from "@/components/RootProviders";
import { HomeDataProvider } from "@/providers/HomeDataProvider";
import FooterWrapper from "@/components/FooterWrapper/FooterWrapper";
import { BASE_URL } from "@/constants/base-url";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:
      "Ayatrio: Buy Home Furnishing & Decor Products Online at Best Price",
  },
  description:
    "India's biggest home furnishing & decor solutions: Get Upto 50% Off on Wallpaper, Flooring, Curtain, Bedding, Mattresses, Cushion & Covers, Dinner & Kitchenware. Free Shipping & Cash on Delivery Available.",
  openGraph: {
    title: "Ayatrio: Buy Home Furnishing & Decor Products Online at Best Price",
    description:
      "India's biggest home furnishing & decor solutions: Get Upto 50% Off on Wallpaper, Flooring, Curtain, Bedding, Mattresses, Cushion & Covers, Dinner & Kitchenware.",
    images: [
      {
        url: "https://res.cloudinary.com/dcvabpy6e/image/upload/v1770676180/ayatrio-room-furnishing_m29isq.avif",
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
    <html
      lang="en"
      className={`${inter.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link
          rel="dns-prefetch"
          href="https://ayatrio-bucket-data.s3.ap-south-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        {/* ✅ CRITICAL: Preload hero image IMMEDIATELY
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/dvhbdkrla/image/upload/c_scale,w_1920,q_auto:best,f_auto/v1768495536/ayatrio/images/wnzktqamhwrdo3gr5u9z.webp"
          fetchPriority="high"
          imagesrcset="
            https://res.cloudinary.com/dvhbdkrla/image/upload/c_scale,w_768,q_auto:best,f_auto/v1768495536/ayatrio/images/wnzktqamhwrdo3gr5u9z.webp 768w,
            https://res.cloudinary.com/dvhbdkrla/image/upload/c_scale,w_1920,q_auto:best,f_auto/v1768495536/ayatrio/images/wnzktqamhwrdo3gr5u9z.webp 1920w
          "
          imagesizes="100vw"
        /> */}

        {/* Font loading optimized with display=swap */}

        {/* ✅ Google Tag Manager */}
        {gtmId && (
          <>
            <Script
              id="gtm"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
              }}
            />
            {/* GTM NO-SCRIPT */}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          </>
        )}
      </head>
      <body>
        <RootProviders>
          {/* ✅ HomeDataProvider: Defers all below-fold API calls */}
          {/* Uses requestIdleCallback - won't block LCP */}
          <HomeDataProvider>
            {children}
            <FooterWrapper />
          </HomeDataProvider>
        </RootProviders>
      </body>
    </html>
  );
}
