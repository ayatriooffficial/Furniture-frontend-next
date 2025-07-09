"use client";

import { fetchGalleryData } from "@/actions/fetchGalleryData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TabImage from "../Cards/TabImage";
import RoomCardSkeleton from "../Skeleton/RoomCardSkeleton";

// Define the base URL for Ayatrio at the top
const AYATRIO_BASE_URL = "https://www.ayatrio.com";

const RoomCard = () => {
  const [gallery, setGallery] = useState(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch gallery data
      const galleryData = await fetchGalleryData();
      setGallery(galleryData);

      // Fetch all offers
      try {
        const offersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`
        );
        const offersData = await offersResponse.json();
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setOffers([]);
      }
    };
    fetchData();
  }, []);

  if (!gallery) {
    return <RoomCardSkeleton />;
  }

  // Find the matching offer from fetched offers (if gallery.items[0].offer exists)
  const matchedOffer = offers.find(offer => offer.name === gallery.items[0]?.offer) || null;

  // Construct the schema dynamically based on gallery and offer data
  // const schemaData = {
  //   "@context": "https://schema.org",
  //   "@type": "Blog",
  //   "headline": gallery.items[0]?.mainHeading || "Room Inspiration",
  //   "description": gallery.items[0]?.description || "Explore room design ideas and inspiration",
  //   "publisher": {
  //     "@type": "Organization",
  //     "name": "Ayatrio",
  //     "logo": {
  //       "@type": "ImageObject",
  //       "url": `${AYATRIO_BASE_URL}/logo.png`
  //     }
  //   },
  //   "blogPost": gallery.rooms.map((room, index) => ({
  //     "@type": "BlogPosting",
  //     "headline": room.children || `Room ${index + 1}`,
  //     "description": `Inspiration for ${room.productCategory} design and decor.`,
  //     "image": room.imgSrc || `${AYATRIO_BASE_URL}/images/${room.productCategory.toLowerCase().replace(/ /g, '-')}-inspiration.jpg`,
  //     "url": `${AYATRIO_BASE_URL}/${room.productCategory.replace(/ /g, '-')}/rooms`,
  //     "author": {
  //       "@type": "Organization",
  //       "name": "Ayatrio"
  //     },
  //     "publisher": {
  //       "@type": "Organization",
  //       "name": "Ayatrio",
  //       "logo": {
  //         "@type": "ImageObject",
  //         "url": `${AYATRIO_BASE_URL}/logo.png`
  //       }
  //     },
  //     "mainEntityOfPage": {
  //       "@type": "WebPage",
  //       "@id": `${AYATRIO_BASE_URL}/${room.productCategory.replace(/ /g, '-')}/rooms`
  //     },
  //     "keywords": `${room.productCategory.toLowerCase()}, ${room.productCategory.toLowerCase()} design, ${room.productCategory.toLowerCase()} furniture, ${room.productCategory.toLowerCase()} ideas`
  //   })),
  //   "offers": matchedOffer ? {
  //     "@type": "Offer",
  //     "name": matchedOffer.name,
  //     "description": matchedOffer.description,
  //     "discount": matchedOffer.discountValue,
  //     "discountType": matchedOffer.discountType === "percentage" ? "Percent" : "Fixed",
  //     "availabilityStarts": matchedOffer.startDate,
  //     "availabilityEnds": matchedOffer.endDate,
  //     "priceSpecification": {
  //       "@type": "PriceSpecification",
  //       "price": matchedOffer.minimumPurchase,
  //       "priceCurrency": "INR"
  //     },
  //     "url": `${AYATRIO_BASE_URL}/offers/new/${matchedOffer.name.replace(/%/g, "percent").replace(/ /g, "-")}`
  //   } : null,
  //   "keywords": "home decor, interior design, room inspiration, flooring, furniture, room design"
  // };

  return (
    <section aria-labelledby="new festival offer"
      data-citation="new festival offer" className="w-full">
      {/* Add the schema as a script tag */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      /> */}
      <div className="mb-[32px] px-[12px] sm:px-[20px] md:px-[52px]">
        <h2 id="new festival offer title" itemProp="name" className="mb-[8px] text-2xl font-semibold">
          {gallery.items[0]?.mainHeading}
        </h2>
        <div className="flex items-center justify-between">
          <p itemProp="description" className="text-[16px] lg:w-[70%] line-clamp-2 font-normal">
            {gallery.items[0]?.description}
          </p>
          <div className="border hidden border-black rounded-full lg:flex items-center justify-center h-[40px] cursor-pointer hover:border-gray-700 transition-colors">
            <Link
              href={`offers/new/${gallery.items[0].offer
                .replace(/%/g, "percent")
                .replace(/ /g, "-")}`}
            >
              <div className="flex items-center gap-5 px-5">
                <p className="text-[12px] font-semibold">
                  Shop all New lower price
                </p>
                <Image
                  loading="lazy"
                  src={"/icons/top_arrow-black.svg"}
                  height={15}
                  width={15}
                  alt="arrow icon"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
      {gallery && (
        <section className="flex justify-between mx-auto mb-[10px] px-[12px] sm:px-[20px] md:px-[52px]">
          <div className="w-full flex justify-center screens">
            <div className="w-full h-[1000px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
              {/* 1 */}
              <div
                className="parent col-start-1 col-end-3 row-start-1 lg:mb-0 row-end-6
      lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12"
              >
                <Link
                  href={`offers/new/${gallery.items[0].offer
                    .replace(/%/g, "percent")
                    .replace(/ /g, "-")}`}
                >
                  <div className="parent relative w-full h-full overflow-hidden">
                    <Image
                      loading="lazy"
                      className="child object-cover hover-zoom"
                      src={gallery.items[0].img}
                      fill
                      alt={gallery.items[0].heading}
                    />
                    <div className="absolute bottom-0 left-0 justify-start p-[30px] items-center">
                      <div className="flex flex-col">
                        <h2 className="text-white text-[12px]">
                          {gallery.items[0].heading}
                        </h2>
                        <p className="text-[12px] font-semibold text-blue-500">
                          View More
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              {/* 2 */}
              {gallery.mode === "room" &&
                (gallery?.rooms?.length === 4 ? (
                  <>
                    <div className="parent col-start-1 col-end-2 row-start-6 row-span-2 lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6">
                      <TabImage
                        src={gallery?.rooms[0]?.imgSrc}
                        href={`/${gallery?.rooms[0]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        alt={`Image of ${gallery?.rooms[0]?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[0]?.children}
                        firstData
                      />
                    </div>
                    <div
                      className="parent col-start-2 col-end-3 row-start-6 row-span-3
    lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7"
                    >
                      <TabImage
                        src={gallery?.rooms[1]?.imgSrc}
                        alt={`Image of ${gallery?.rooms[1]?.children}`}
                        href={`/${gallery?.rooms[1]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[1]?.children}
                      />
                    </div>
                    <div
                      className="parent col-start-1 col-end-2 row-start-8 row-span-3
      lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12"
                    >
                      <TabImage
                        src={gallery?.rooms[2]?.imgSrc}
                        alt={`Image of ${gallery?.rooms[2]?.children}`}
                        href={`/${gallery?.rooms[2]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[2]?.children}
                      />
                    </div>
                    <div
                      className="parent col-start-2 col-end-3 row-start-9 row-span-2
      lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12"
                    >
                      <TabImage
                        src={gallery?.rooms[3]?.imgSrc}
                        href={`/${gallery?.rooms[3]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        alt={`Image of ${gallery?.rooms[3]?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[3]?.children}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="parent col-start-1 col-end-3 row-start-6 row-span-2 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:row-end-6">
                      <TabImage
                        src={gallery?.rooms[0]?.imgSrc}
                        href={`/${gallery?.rooms[0]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        alt={`Image of ${gallery?.rooms[0]?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[0]?.children}
                        firstData
                      />
                    </div>
                    <div className="parent col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12">
                      <TabImage
                        src={gallery?.rooms[2]?.imgSrc}
                        alt={`Image of ${gallery?.rooms[2]?.children}`}
                        href={`/${gallery?.rooms[2]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[2]?.children}
                      />
                    </div>
                    <div className="parent col-start-2 col-end-3 row-start-8 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-6 lg:row-end-12">
                      <TabImage
                        src={gallery?.rooms[1]?.imgSrc}
                        alt={`Image of ${gallery?.rooms[1]?.children}`}
                        href={`/${gallery?.rooms[1]?.productCategory.replace(
                          / /g,
                          "-"
                        )}/collection/all`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[1]?.children}
                      />
                    </div>
                  </>
                ))}
            </div>
          </div>
         
        </section>
      )}
    </section>
  );
};

export default RoomCard;