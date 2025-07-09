import { fetchOffers } from "@/utils/fetchOffers";

export default async function PromotionEventSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
  let offers = [];

  try {
    offers = await fetchOffers();
    
  } catch (error) {
    console.error("Error fetching offers server-side:", error);
  }

  const promotionSchema = {
    "@context": "https://schema.org",
    "@type": "PromotionEvent",
    name: "Ayatrio Current Promotions",
    description: "Active discounts and special offers from Ayatrio",
    url: `${baseUrl}/offers`,
    startDate: offers.length > 0
      ? (offers[0]?.startDate
        ? new Date(offers[0].startDate).toISOString()
        : new Date().toISOString())
      : new Date().toISOString(),
    endDate: offers.length > 0 && offers[0]?.endDate
      ? new Date(offers[0].endDate).toISOString()
      : undefined,
    location: {
      "@type": "VirtualLocation",
      url: baseUrl,
    },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    itemListElement: offers.length > 0 ? offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SaleEvent",
        name: offer?.name || "Special Offer",
        description: offer?.description || "Exclusive home decor deals",
        startDate: offer?.startDate
          ? new Date(offer.startDate).toISOString()
          : new Date().toISOString(),
        endDate: offer?.endDate
          ? new Date(offer.endDate).toISOString()
          : undefined,
        url: `${baseUrl}/offers/${offer?.id || index}`,
        offers: {
          "@type": "Offer",
          price: `${offer?.percentageOff || 0}% off`,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: offer?.startDate
            ? new Date(offer.startDate).toISOString()
            : new Date().toISOString(),
          eligibleCustomerType: "Ayatrio members",
        },
        location: {
          "@type": "VirtualLocation",
          url: baseUrl,
        },
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
      },
    })) : [{
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SaleEvent",
        name: "Ayatrio Promotions",
        description: "Check out our latest home decor deals",
        startDate: new Date().toISOString(),
        url: `${baseUrl}/offers`,
        offers: {
          "@type": "Offer",
          price: "0% off",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString(),
        },
        location: {
          "@type": "VirtualLocation",
          url: baseUrl,
        },
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
      },
    }],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(promotionSchema) }}
    />
  );
}