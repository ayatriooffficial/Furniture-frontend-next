// components/Features/MulticardServiceSchema.js
"use client";
import { fetchProfileData } from "@/actions/fetchProfileData";
import Script from "next/script";
import { useEffect, useState } from "react";

const MulticardServiceSchema = () => {
  const [profileData, setProfileData] = useState([]);
  const [offers, setOffers] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await fetchProfileData();
        setProfileData(profileResponse);
        
        const offersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`
        );
        const offersData = await offersResponse.json();
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching schema data:", error);
      }
    };
    fetchData();
  }, []);

  const generateServiceSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": ["InteriorDesign", "HomeDecorConsultation", "InteriorDesignConsultation"],
    "name": "Free Home Decor & Interior Design Consultation",
    "description": "Get expert home decor and furnishing advice in three ways: In-Store, At-Home, or Virtual. 37,600+ happy customers rated us 4.93/5.",
    "provider": {
      "@type": "Organization",
      "name": "Ayatrio",
      "url": baseUrl,
      "employee": profileData.slice(0, 3).map((person, index) => ({
        "@type": "Person",
        "name": person.user?.displayName || `Ayatrio Designer ${index + 1}`,
        "jobTitle": person.user?.role || "Senior Interior Designer",
        "knowsAbout": person.user?.expertise?.length > 0 
          ? person.user.expertise 
          : ["Residential Design", "Space Planning", "Material Selection"],
        "image": person.user?.image || `${baseUrl}/default-designer.jpg`
      })),
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.93",
        "reviewCount": "37600",
        "bestRating": "5"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Special Offers",
      "itemListElement": offers.map((offer, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": offer.metadata?.name || "Special Offer",
          "description": offer.metadata?.description || "Exclusive home decor offer",
          "serviceType": "HomeDecorOffer"
        },
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "eligibleRegion": [
          { "@type": "City", "name": "Kolkata" },
          { "@type": "City", "name": "Bangalore" },
          { "@type": "City", "name": "Delhi" },
          { "@type": "City", "name": "Mumbai" },
          { "@type": "City", "name": "Hyderabad" },
        ],
        "availabilityStarts": offer.metadata?.startDate,
        "availabilityEnds": offer.metadata?.endDate,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceComponent": {
            "@type": "PriceComponent",
            "name": "discount",
            "type": "discount",
            "value": offer.metadata?.percentageOff
          }
        },
        "discountCode": offer.metadata?.type,
        "url": `${baseUrl}/offers/${offer._id}`
      }))
    },
    "termsOfService": `${baseUrl}/free-consultation-terms`
  });

  return (
    <Script
      id="multicard-service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceSchema()) }}
    />
  );
};

export default MulticardServiceSchema;