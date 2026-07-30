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
    <aside className="w-full h-auto px-[12px] sm:px-[20px] md:px-[52px]">
      {banners.length > 0 && (
        <Link href={banners[0]?.link} aria-label="Ayatrio Offer Banner">
          <figure>
            {/* Desktop Image */}
            <img
              src={fixImageUrl(banners[0]?.desktopImgSrc)}
              alt="Ayatrio Offer - Desktop Version"
              className="md:block hidden py-6 w-full h-auto"
            />
            {/* Mobile Image */}
            <img
              src={banners[0]?.mobileImgSrc ? fixImageUrl(banners[0].mobileImgSrc) : 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1768843151/extra-offer_gqjbss.avif'}
              onError={(e) => {
                e.currentTarget.src = 'https://res.cloudinary.com/dcvabpy6e/image/upload/v1768843151/extra-offer_gqjbss.avif';
              }}
              alt="Ayatrio Offer - Mobile Version"
              className="md:hidden py-6 w-full h-auto"
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
