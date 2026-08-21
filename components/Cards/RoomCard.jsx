"use client";

import { fetchGalleryData } from "@/actions/fetchGalleryData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import TabImage from "../Cards/TabImage";
import RoomCardSkeleton from "../Skeleton/RoomCardSkeleton";
import fixImageUrl from "@/utils/modifyUrl";


const RoomCard = () => {
  const [gallery, setGallery] = useState(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch gallery data
      const galleryData = await fetchGalleryData();
      // console.log(galleryData)
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
              href={`offers/new/${encodeURIComponent(gallery.items[0]?.offer || "")
                .replace(/%25/g, "percent")
                .replace(/%20/g, "-")}`}
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
                  quality={75}
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
            <div className="w-full max-w-[1536px] mx-auto aspect-[0.42] md:aspect-[0.6] lg:h-auto lg:aspect-[1.66] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
              {/* 1 */}
              <div
                className="parent col-start-1 col-end-3 row-start-1 lg:mb-0 row-end-6
      lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12"
              >
                <Link
                  href={`offers/new/${encodeURIComponent(gallery.items[0]?.offer || "")
                    .replace(/%25/g, "percent")
                    .replace(/%20/g, "-")}`}
                >
                  <div className="parent relative w-full h-full overflow-hidden group">
                    <Image
                      loading="lazy"
                      className="child object-cover hover-zoom h-full w-full"
                      src={fixImageUrl(gallery.items[0].img)}
                      fill
                      alt={gallery.items[0].heading}
                    />

                    {/* Smooth ease-out bottom scrim gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-44 sm:h-48 md:h-56 max-h-[80%] bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none z-10" />

                    {/* Text and Icon Container */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 md:p-5 z-20">
                      <div className="flex items-center justify-between group cursor-pointer gap-2">
                        <h3 className="text-white font-bold group-hover:underline text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2">
                          {gallery.items[0].heading}
                        </h3>
                        <svg 
                          viewBox="0 0 25 25" 
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0 text-white fill-current transition-transform duration-300 group-hover:translate-x-1 md:group-hover:translate-x-1.5"
                        >
                          <path fill="white" d="M11.1,17.9l-1-1l4.4-4.4L9.9,8.1l1.1-1.1l5.5,5.6L11.1,17.9z"/>
                        </svg>
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
                        src={fixImageUrl(gallery?.rooms[0]?.room?.imgSrc)}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[0]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[0]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[0].category.name)}` : ""}`}
                        alt={`Image of ${gallery?.rooms[0]?.room?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[0]?.room?.children}
                        firstData
                      />
                    </div>
                    <div
                      className="parent col-start-2 col-end-3 row-start-6 row-span-3
    lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7"
                    >
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[1]?.room?.imgSrc)}
                        alt={`Image of ${gallery?.rooms[1]?.room?.children}`}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[1]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[1]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[1].category.name)}` : ""}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[1]?.room?.children}
                      />
                    </div>
                    <div
                      className="parent col-start-1 col-end-2 row-start-8 row-span-3
      lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12"
                    >
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[2]?.room?.imgSrc)}
                        alt={`Image of ${gallery?.rooms[2]?.room?.children}`}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[2]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[2]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[2].category.name)}` : ""}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[2]?.room?.children}
                      />
                    </div>
                    <div
                      className="parent col-start-2 col-end-3 row-start-9 row-span-2
      lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12"
                    >
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[3]?.room?.imgSrc)}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[3]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[3]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[3].category.name)}` : ""}`}
                        alt={`Image of ${gallery?.rooms[3]?.room?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[3]?.room?.children}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="parent col-start-1 col-end-3 row-start-6 row-span-2 lg:col-start-7 lg:col-end-13 lg:row-start-1 lg:row-end-6">
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[0]?.room?.imgSrc)}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[0]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[0]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[0].category.name)}` : ""}`}
                        alt={`Image of ${gallery?.rooms[0]?.room?.children}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[0]?.room?.children}
                        firstData
                      />
                    </div>
                    <div className="parent col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12">
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[2]?.room?.imgSrc)}
                        alt={`Image of ${gallery?.rooms[2]?.room?.children}`}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[2]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[2]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[2].category.name)}` : ""}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[2]?.room?.children}
                      />
                    </div>
                    <div className="parent col-start-2 col-end-3 row-start-8 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-6 lg:row-end-12">
                      <TabImage
                        src={fixImageUrl(gallery?.rooms[1]?.room?.imgSrc)}
                        alt={`Image of ${gallery?.rooms[1]?.room?.children}`}
                        href={`offers/new/${encodeURIComponent(gallery?.rooms[1]?.offer || "").replace(/%25/g, "percent").replace(/%20/g, "-")}${gallery?.rooms[1]?.category?.name ? `?category=${encodeURIComponent(gallery.rooms[1].category.name)}` : ""}`}
                        width={1000}
                        height={338}
                        labelData={gallery?.rooms[1]?.room?.children}
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