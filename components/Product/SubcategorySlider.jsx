"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SubCategorySlider = ({ subCategory, isSubcategoryPage }) => {
  const pathname = usePathname();
  const currentCategorySlug = pathname.slice(1).split('/')[0].replace('-', ' ')
  console.log(currentCategorySlug)
  console.log(isSubcategoryPage)
  const swiperRef = useRef(null);
  console.log(subCategory)

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
      {!isSubcategoryPage && subCategory.map((category) => (
        <swiper-slide key={category.id} class="!w-auto">
          <div
            // href={`/products/${category.slug}`}
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
          </div>
        </swiper-slide>
      ))}
      {isSubcategoryPage &&
        subCategory.map((category) =>
          category.name === currentCategorySlug ? (
            <swiper-slide key={category.id} class="!w-auto">
              <div
                // href={`/products/${category.slug}`}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-[138px] h-[72px] relative overflow-hidden mb-2">
                  <Image
                    src={category.img}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs w-[138px] truncate text-left">{category.name}</p>
              </div>
            </swiper-slide>
          ) : null
        )}

    </swiper-container>
  );
};

export default SubCategorySlider;
