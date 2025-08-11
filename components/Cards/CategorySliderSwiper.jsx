"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import fixImageUrl from '@/utils/modifyUrl.js'

const CategorySliderSwiper = ({ categories }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const params = {
      slidesPerView: 4.08,
      centeredSlides: false,
      spaceBetween: 5,
      navigation: {
        nextEl: ".right",
        prevEl: ".back",
      },
      draggable: true,
      breakpoints: {
        300: {
          slidesPerView: Math.min(categories?.length, 3.2),
          spaceBetween: 10,
        },
        768: {
          slidesPerView: Math.min(categories?.length, 3),
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: Math.min(categories?.length, 8),
          spaceBetween: 10,
        },
      },
      mousewheel: {
        forceToAxis: true,
        invert: false,
      },
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);
      swiperRef.current.initialize?.();
    }
  }, [swiperRef, swiperRef.current]);

  return (
    <div
      className="w-full category-slider"
      role="region"
      aria-label="Product categories carousel"
      data-component="category-carousel"
    >
      <swiper-container
        ref={swiperRef}
        init="false"
        className="swiper-test"
        style={{
          "--swiper-navigation-size": "24px",
          maxHeight: "180px",
          marginTop: "15px",
        }}
        aria-live="polite"
        data-component="swiper-container"
      >
        {categories && categories?.map((curElement, idx) => (
          <swiper-slide
            key={idx}
            role="group"
            aria-roledescription="slide"
            aria-label={`Category ${idx + 1} of ${categories.length}`}
            data-component="category-slide"
            data-category-id={curElement.name.replace(/ /g, "-").toLowerCase()}
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
                    className="w-[120px] h-[70px]"
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
