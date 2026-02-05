"use client";

import fixImageUrl from "@/utils/modifyUrl";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Banner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getPosterSection`,
        );

        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => fetchBanner(), { timeout: 2500 });
    } else {
      setTimeout(() => fetchBanner(), 2000);
    }
  }, []);

  return (
    <aside className="w-full h-auto md:px-[52px] px-[20px]">
      {banners.length > 0 && (
        <Link href={banners[0]?.link} aria-label="Ayatrio Offer Banner">
          <figure>
            {/* Desktop Image */}
            <Image
              src={fixImageUrl(banners[0]?.desktopImgSrc)}
              alt="Ayatrio Offer - Desktop Version"
              width={1920}
              height={1080}
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 100vw"
              className="md:block hidden py-6"
              quality={70}
              placeholder="empty"
            />
            {/* Mobile Image */}
            <Image
              src={fixImageUrl(banners[0]?.mobileImgSrc)}
              alt="Ayatrio Offer - Mobile Version"
              width={1920}
              height={1080}
              priority
              fetchPriority="high"
              sizes="(max-width: 767px) 100vw"
              className="md:hidden py-6"
              quality={70}
              placeholder="empty"
            />
            <figcaption className="sr-only">
              Special Ayatrio Bank Offer Banner
            </figcaption>
          </figure>
        </Link>
      )}
    </aside>
  );
}

export default Banner;
