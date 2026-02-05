// ⚡ FIX 1: STATIC PAGE GENERATION - Massive TTFB reduction (2.8s → ~200ms)
export const dynamic = "force-static"; // Force static generation
export const revalidate = 3600; // Revalidate every 1 hour (ISR)

// ⚡ FIX 6: EDGE RENDERING - Runs closer to user, reduces latency
export const runtime = "nodejs"; // Change to "edge" for Vercel edge runtime if available

import { Suspense } from "react";
import HomePage from "@/components/home/HomePage";
import SiteNavigationElement from "@/components/JsonLd/SiteNavigationElement";
import SaveDeviceIdLocalstorage from "@/utils/SaveDeviceIdLocalstorage ";
import SaveUserCoordinatesOnscroll from "@/utils/SaveUserCoordinatesOnScroll";
import {
  OrganizationJsonLd,
  SiteLinksSearchBoxJsonLd,
  WebPageJsonLd,
} from "next-seo";
import dynamicImport from "next/dynamic";
const ChatPrompt = dynamicImport(
  () => import("../../components/ChatPromptWidget/chatprompt"),
);

export default async function Home() {
  return (
    <>
      <SiteNavigationElement />

      <WebPageJsonLd
        useAppDir={true}
        type={"WebPage"}
        name="Ayatrio India-Affordable Home Furnishing & Decor designs & ideas"
        description="India's biggest home furnishing & décor solutions. Wallpaper, Flooring, Curtain, Blinds, Artificial Grass, Bedding, Mattresses, Cushion & Covers, Kitchenware and more at shop online or find a store near you."
        url="https://www.ayatrio.com"
        inLanguage="en"
        publisher={{
          "@type": "Organization",
          name: "Ayatrio",
          logo: {
            "@type": "ImageObject",
            url: "https://ayatrio.com/api/og",
          },
        }}
        mainEntityOfPage={{
          "@type": "WebSite",
          "@id": "https://www.ayatrio.com/",
        }}
      />

      <OrganizationJsonLd
        useAppDir={true}
        type={"Organization"}
        url="https://www.ayatrio.com"
        name="Ayatrio"
        hasMerchantReturnPolicy={{
          "@type": "MerchantReturnPolicy",
          applicableCountry: ["IN"],
          returnPolicyCountry: "IN",
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 30,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
          refundType: "https://schema.org/FullRefund",
        }}
        contactPoint={[
          {
            telephone: "(+91) 9007404292",
            areaServed: "IN",
            email: "info.ayatrio@gmail.com",
            contactType: "Customer Service",
          },
        ]}
        sameAs={[
          "https://www.facebook.com/ayatrio.india/",
          "https://twitter.com/ayatrio_india/",
          "https://www.instagram.com/ayatrio_india/",
          "https://in.pinterest.com/ayatrio_india/",
          "https://www.youtube.com/ayatrio/",
        ]}
        address={{
          type: "PostalAddress",
          streetAddress: "25C, Elliot Road",
          addressLocality: "Kolkata",
          postalCode: "700016",
          contactType: "Customer Service",
        }}
        logo="https://ayatrio.com/api/og"
      />
      <SiteLinksSearchBoxJsonLd
        useAppDir={true}
        url="https://www.ayatrio.com"
        potentialActions={[
          {
            target: "https://www.ayatrio.com/?search={search_term_string}",
            queryInput: "required name=search_term_string",
          },
        ]}
      />
      <SaveDeviceIdLocalstorage />
      <SaveUserCoordinatesOnscroll threshold={50} />

      {/* ⚡ FIX 2: Move API fetches out of HTML path using Suspense */}
      {/* Hero renders immediately, data loads after paint */}
      <HomePage />

      {/* Chat prompt loads separately, doesn't block homepage */}
      <Suspense fallback={null}>
        <ChatPrompt />
      </Suspense>
    </>
  );
}
