"use client";
import axios from "axios";
import Script from "next/script";
import { useEffect, useState } from "react";

const FreeSampleSchema = () => {
  const [offers, setOffers] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`
        );
        setOffers(response?.data || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  const generateFreeSampleSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FreeSampleService",
    "serviceType": ["FreeSample", "ProductSampling"],
    "name": "Free Flooring Samples",
    "description": "Request free samples of hardwood, laminate, and vinyl flooring delivered to your home. No obligation.",
    "provider": {
      "@type": "Organization",
      "name": "Ayatrio",
      "url": baseUrl
    },
    "areaServed": { "@type": "Country", "name": "India" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Free Sample Options",
      "itemListElement": offers.map(offer => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": offer.metadata?.name || "Free Sample",
          "description": offer.metadata?.description || "Free product sample",
          "serviceType": "FreeSample",
          "hasDeliveryCharge": {
            "@type": "DeliveryChargeSpecification",
            "appliesToDeliveryMethod": "https://schema.org/PostalMail",
            "eligibleRegion": { "@type": "Country", "name": "India" },
            "value": "0"
          }
        },
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "eligibleRegion": { "@type": "Country", "name": "India" },
        "eligibleQuantity": { "@type": "QuantitativeValue", "value": "1" }
      }))
    },
    "termsOfService": `${baseUrl}/free-samples-terms`
  });

  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFreeSampleSchema()) }}
    />
  );
};

export default FreeSampleSchema;