"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const SubCategorySlider = ({ subCategory }) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperParams = {
      slidesPerView: 2.2,
      spaceBetween: 8,
      freeMode: true,
      grabCursor: true,
      mousewheel: false,
      breakpoints: {
        320: { slidesPerView: 2.2, spaceBetween: 10 },
        480: { slidesPerView: 3, spaceBetween: 12 },
        768: { slidesPerView: 4, spaceBetween: 14 },
        1024: { slidesPerView: 6, spaceBetween: 16 },
      },
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, swiperParams);
      swiperRef.current.initialize?.();
    }
  }, [subCategory]);

  return (
    <swiper-container
      init="false"
      ref={swiperRef}
      class="subcategory-slider w-full"
    >
      {subCategory.map((category) => (
        <swiper-slide key={category.id} class="!w-auto">
          <Link
            href={`/products/${category.slug}`}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-[138px] h-[72px] relative  overflow-hidden mb-2">
              <Image
                src={category.img}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs w-[138px] truncate text-left">{category.name}</p>
          </Link>
        </swiper-slide>
      ))}
    </swiper-container>
  );
};

export default SubCategorySlider;
