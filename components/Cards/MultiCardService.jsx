"use client";

import { fetchProfileData } from "@/actions/fetchProfileData";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./styles.css";

const MultiCardServiceSlider = dynamic(() => import("./MultiCardServiceSlider"));
// Static schema data based on image content
// const servicesSchema = {
//   "@context": "https://schema.org",
//   "@type": "Service",
//   "itemListElement": [
//     {
//       "@type": "ListItem",
//       "position": 1,
//       "item": {
//         "@type": "Service",
//         "name": "Shop online with click and collect at store",
//         "description": "Order online and pick up at your nearest Ayatrio store",
//         "url": "https://www.ayatrio.com/services/click-and-collect",
//         "image": "https://www.ayatrio.com/icons/click-and-collect.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 2,
//       "item": {
//         "@type": "Service",
//         "name": "Furnishing & Measuring service",
//         "description": "Professional space measurement and furniture planning",
//         "url": "https://www.ayatrio.com/services/furnishing-measuring",
//         "image": "https://www.ayatrio.com/icons/maserment.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     // Add remaining services following the same pattern
//     {
//       "@type": "ListItem",
//       "position": 3,
//       "item": {
//         "@type": "Service",
//         "name": "Financing Service",
//         "description": "Flexible payment options and credit facilities",
//         "url": "https://www.ayatrio.com/services/financing",
//         "image": "https://www.ayatrio.com/icons/payment.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 4,
//       "item": {
//         "@type": "Service",
//         "name": "Buyback & Resell",
//         "description": "Sell back your used furniture through Ayatrio",
//         "url": "https://www.ayatrio.com/services/buyback-resell",
//         "image": "https://www.ayatrio.com/icons/buy-back.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 5,
//       "item": {
//         "@type": "Service",
//         "name": "Warranty Service",
//         "description": "Extended warranty and product protection plans",
//         "url": "https://www.ayatrio.com/services/warranty",
//         "image": "https://www.ayatrio.com/icons/warranty-registration.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 6,
//       "item": {
//         "@type": "Service",
//         "name": "Installation Service",
//         "description": "Professional furniture assembly and installation",
//         "url": "https://www.ayatrio.com/services/installation",
//         "image": "https://www.ayatrio.com/icons/instalation.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 7,
//       "item": {
//         "@type": "Service",
//         "name": "Gift Registry",
//         "description": "Create and manage your home furnishing gift list",
//         "url": "https://www.ayatrio.com/services/gift-registry",
//         "image": "https://www.ayatrio.com/icons/gift.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     },
//     {
//       "@type": "ListItem",
//       "position": 8,
//       "item": {
//         "@type": "Service",
//         "name": "Ayatrio Family Card",
//         "description": "Exclusive benefits and rewards program",
//         "url": "https://www.ayatrio.com/services/family-card",
//         "image": "https://www.ayatrio.com/icons/ayatrio-family-care-plus.svg",
//         "provider": {
//           "@type": "Organization",
//           "name": "Ayatrio",
//           "url": "https://www.ayatrio.com"
//         }
//       }
//     }
//   ]
// };

const MulticardService = () => {

  return (
    <section
  className="bg-[#f5f5f7] pb-[5rem] ml-0 pl-[12px] sm:ml-[20px] md:ml-[0px] md:pl-[52px] overflow-x-auto"
  aria-label="Financial and support services"
>
      {/* Schema script placed directly in component */}
      
      <div className="w-full flex justify-between items-center">
        <h2 className="font-semibold sm:text-[16px] md:text-[24px] lg:text-[24px] pb-[20px] pt-[30px]">
          Service and Financial help on shopping
        </h2>
        <div className="flex text-2xl cursor-pointer text-white rounded-full gap-4">
          <Image
            loading="lazy"
            src="/icons/backarrowblack.svg"
            width={20}
            height={20}
            alt="Previous services"
            className="back rounded-full h-7 w-7"
          />
          <Image
            loading="lazy"
            src="/icons/rightarrowblack.svg"
            width={20}
            height={20}
            alt="Next services"
            className="right lg:mr-16 mr-6 rounded-full h-7 w-7"
          />
        </div>
      </div>
      
      <MultiCardServiceSlider data={[
        {
          id: 1,
          headerTitle: "Shop online with click and collect at store",
          iconPath: "/icons/click and collect.svg",
        },
        {
          id: 2,
          headerTitle: "Furnishing & Measuring service",
          iconPath: "/icons/maserment.svg",
        },
        {
          id: 3,
          headerTitle: "Financing Service",
          iconPath: "/icons/payment.svg",
        },
        {
          id: 4,
          headerTitle: "Buyback & Resell",
          iconPath: "/icons/buy back.svg",
        },
        {
          id: 5,
          headerTitle: "Warranty Service",
          iconPath: "/icons/warranty registration.svg",
        },
        {
          id: 6,
          headerTitle: "Installation Service",
          iconPath: "/icons/instalation.svg",
        },
        {
          id: 7,
          headerTitle: "Gift Registry",
          iconPath: "/icons/gift.svg",
        },
        {
          id: 8,
          headerTitle: "Ayatrio Family Card",
          iconPath: "/icons/ayatrio famaly care+.svg",
        }
      ]} />
    </section>
  );
};

export default MulticardService;