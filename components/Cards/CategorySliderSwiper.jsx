"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import fixImageUrl from "@/utils/modifyUrl.js";
import { register } from "swiper/element/bundle";

// Register Swiper modules
register();

const CategorySliderSwiper = ({ categories }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const params = {
      init: false,
      slidesPerView: 4.08,
      centeredSlides: false,
      spaceBetween: 5,
      navigation: {
        nextEl: ".right",
        prevEl: ".back",
      },
      mousewheel: {
        forceToAxis: true,
        invert: false,
      },
      breakpoints: {
        300: {
          slidesPerView: Math.min(categories.length, 3.2),
          spaceBetween: 10,
        },
        640: {
          slidesPerView: Math.min(categories.length, 4),
          spaceBetween: 10,
        },
        768: {
          slidesPerView: Math.min(categories.length, 5),
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: Math.min(categories.length, 6),
          spaceBetween: 10,
        },
        1440: {
          slidesPerView: Math.min(categories.length, 8),
          spaceBetween: 10,
        },
      },
    };

    if (swiperRef.current) {
      // Clear previous initialization
      Object.assign(swiperRef.current, params);

      // Force re-initialization
      if (swiperRef.current.swiper) {
        swiperRef.current.swiper.destroy(true, true);
      }

      // Initialize after a short delay to ensure DOM is ready
      setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.initialize?.();
        }
      }, 100);
    }
  }, [categories]);

  return (
    <div
      className="w-full category-slider flex justify-center"
      role="region"
      aria-label="Product categories carousel"
      data-component="category-carousel"
    >
      <swiper-container
        ref={swiperRef}
        init="false"
        class="swiper-test"
        style={{
          "--swiper-navigation-size": "24px",
          width: "100%",
          height: "auto",
          paddingTop: "15px",
        }}
        aria-live="polite"
        data-component="swiper-container"
      >
        {categories &&
          categories?.map((curElement, idx) => (
            <swiper-slide
              key={idx}
              role="group"
              aria-roledescription="slide"
              aria-label={`Category ${idx + 1} of ${categories.length}`}
              data-component="category-slide"
              data-category-id={curElement.name
                .replace(/ /g, "-")
                .toLowerCase()}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                href={`/${curElement.name.replace(/ /g, "-")}/collection/all`}
                aria-label={`Browse ${curElement.name} collection`}
                data-component="category-link"
              >
                <div className="flex flex-col items-center">
                  <figure className="mb-[12px]">
                    <Image
                      src={fixImageUrl(curElement.image) || "/images/temp.svg"}
                      width={120}
                      height={70}
                      quality={75}
                      priority
                      alt=""
                      className="w-[120px] h-[70px] object-contain"
                      aria-hidden="true"
                    />
                  </figure>
                  <h2 className="text-[#333333] lg:text-center line-clamp-1 font-semibold text-[14px] hover:underline">
                    {curElement.name}
                  </h2>
                </div>
              </Link>
            </swiper-slide>
          ))}
      </swiper-container>
    </div>
  );
};

export default CategorySliderSwiper;
