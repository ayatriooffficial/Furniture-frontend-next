"use client";
import { useEffect, useRef } from "react";
import CardSkeleton from "./CardSkeleton";

function CardsSkeleton() {
  const swiperRef = useRef(null);

  useEffect(() => {
    const params = {
      centeredSlides: false,
      spaceBetween: 12,
      navigation: {
        nextEl: ".custom-next-button",
        prevEl: ".custom-prev-button",
      },
      noSwiping: false,
      allowSlidePrev: true,
      allowSlideNext: true,
      scrollbar: {
        el: ".swiper-scrollbar-custom",
        draggable: true,
      },
      mousewheel: {
        forceToAxis: true,
        invert: false,
      },
      freeMode: {
        enabled: false,
        sticky: true,
        momentum: true,
        momentumRatio: 0.5,
        momentumBounceRatio: 0.5,
      },
      breakpoints: {
        300: {
          slidesPerView: 1.2,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
      },
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);

      swiperRef.current.initialize?.();
    }
  }, [swiperRef, swiperRef.current]);

  //   useEffect(() => {
  //     if (trendingData?.length) {
  //       viewItemList({
  //         items: trendingData.map((product) => ({
  //           item_id: product._id,
  //           item_name: product.productTitle,
  //           item_category: product.category,
  //           price: product.perUnitPrice,
  //           currency: "INR",
  //           quantity: 1,
  //         })),
  //         itemListId: "trending",
  //         itemListName: "Trending",
  //       });
  //     }
  //   }, [trendingData]);
  return (
    <div className="w-full">
      <swiper-container
        init="false"
        ref={swiperRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <swiper-slide
          style={{
            marginLeft: "0px",
          }}
        >
          <div className="grid grid-cols-1 w-full h-full fade-in">
            <CardSkeleton />
          </div>
        </swiper-slide>
        <swiper-slide
          style={{
            marginLeft: "0px",
          }}
        >
          <div className="grid grid-cols-1 w-full h-full fade-in">
            <CardSkeleton />
          </div>
        </swiper-slide>
        <swiper-slide
          style={{
            marginLeft: "0px",
          }}
        >
          <div className="grid grid-cols-1 w-full h-full fade-in">
            <CardSkeleton />
          </div>
        </swiper-slide>
        <swiper-slide
          style={{
            marginLeft: "0px",
          }}
        >
          <div className="grid grid-cols-1 w-full h-full fade-in">
            <CardSkeleton />
          </div>
        </swiper-slide>
      </swiper-container>
      <div className="swiper-scrollbar-custom h-[2px]"></div>
    </div>
  );
}

export default CardsSkeleton;
