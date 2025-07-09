// "use client";
// import axios from "axios";
// import Script from "next/script";
// import { useEffect, useState } from "react";

// const InstallationServiceSchema = () => {
//   const [offers, setOffers] = useState([]);
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";

//   useEffect(() => {
//     const fetchOffers = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`
//         );
//         setOffers(response?.data || []);
//       } catch (error) {
//         console.error("Error fetching offers:", error);
//         setOffers([]);
//       }
//     };
//     fetchOffers();
//   }, []);

//   const generateInstallationSchema = () => ({
//     "@context": "https://schema.org",
//     "@type": "InstallationService",
//     "serviceType": ["FloorInstallation", "HomeImprovement"],
//     "name": "Professional Hardwood & Laminate Flooring Installation in Mumbai | Ayatrio",
//     "description": "Certified NWFA flooring installation experts for hardwood, vinyl, and laminate floors in Mumbai. 15-year warranty, free estimates, same-day service available. Rated 4.9/5 by 850+ clients.",
//     "brand": { "@type": "Brand", "name": "Ayatrio Floors", "logo": `${baseUrl}/logo.png` },
//     "provider": {
//       "@type": "LocalBusiness",
//       "name": "Ayatrio",
//       "url": baseUrl,
//       "image": [`${baseUrl}/floor-installation-team.jpg`, `${baseUrl}/flooring-showroom.jpg`],
//       "hasCredential": "NWFA-Certified Flooring Installer",
//       "openingHoursSpecification": {
//         "@type": "OpeningHoursSpecification",
//         "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
//         "opens": "09:00",
//         "closes": "18:00"
//       },
//       "aggregateRating": {
//         "@type": "AggregateRating",
//         "ratingValue": "4.9",
//         "reviewCount": "850",
//         "bestRating": "5"
//       },
//       "address": {
//         "@type": "PostalAddress",
//         "streetAddress": "123 Flooring St",
//         "addressLocality": "Mumbai",
//         "addressRegion": "Maharashtra",
//         "postalCode": "400001",
//         "addressCountry": "IN"
//       },
//       "telephone": "+912234567890"
//     },
//     "areaServed": [
//       { "@type": "Country", "name": "India" },
//       { "@type": "State", "name": "Maharashtra" },
//       { "@type": "City", "name": "Mumbai" },
//       { "@type": "City", "name": "Pune" },
//       { "@type": "City", "name": "Thane" }
//     ],
//     "hasOfferCatalog": {
//       "@type": "OfferCatalog",
//       "name": "Flooring Installation Services",
//       "itemListElement": offers.map(offer => ({
//         "@type": "Offer",
//         "itemOffered": {
//           "@type": "Service",
//           "name": offer.metadata?.name || "Installation Service",
//           "description": offer.metadata?.description || "Professional installation service",
//           "serviceType": "FloorInstallation"
//         },
//         "price": offer.metadata?.price || "999.00",
//         "priceCurrency": "INR",
//         "availability": "https://schema.org/InStock",
//         "availabilityStarts": "T09:00",
//         "eligibleRegion": { "@type": "City", "name": "Mumbai" }
//       }))
//     },
//     "award": "Best Flooring Installer 2023 (Times Home Awards)",
//     "termsOfService": `${baseUrl}/installation-terms`
//   });

//   return (
//     <Script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(generateInstallationSchema()) }}
//     />
//   );
// };

// export default InstallationServiceSchema;