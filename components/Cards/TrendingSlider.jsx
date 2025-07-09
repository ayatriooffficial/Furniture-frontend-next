"use client";

import { viewItemList } from "@/tag-manager/events/view_item_list";
import { useEffect, useRef } from "react";
import Card from "./card";
import LazyCard from "./LazyCard";


const TrendingSlider = ({ trendingData, isProductInCart }) => {
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

  useEffect(() => {
    if (trendingData?.length) {
      viewItemList({
        items: trendingData.map((product) => ({
          item_id: product._id,
          item_name: product.productTitle,
          item_category: product.category,
          price: product.perUnitPrice,
          currency: "INR",
          quantity: 1,
        })),
        itemListId: "trending",
        itemListName: "Trending",
      });
    }
  }, [trendingData]);

  return (
    <div
      aria-label="Trending products carousel"
      data-component="trending-slider"
      className="trending-slider-container"
    >
      <swiper-container
        init="false"
        ref={swiperRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        aria-live="polite"
        role="region"
        aria-roledescription="carousel"
      >
        {!trendingData?.length ? (
          <swiper-slide>
            <div
              className="flex"
              aria-label="No trending products available"
            ></div>
          </swiper-slide>
        ) : (
          trendingData.map((product, idx) => {
            const inCart = isProductInCart(product?._id);

            return (
              <swiper-slide
                key={`${product._id}_${idx}`}
                style={{
                  marginLeft: "0px",
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${trendingData.length}`}
                data-component="trending-slide"
                data-product-id={product._id}
              >
                 <LazyCard product={product} isProductInCart={isProductInCart} />
              </swiper-slide>
            );
          })
        )}
      </swiper-container>
      <div
        className="swiper-scrollbar-custom h-[2px]"
        aria-label="Trending products scrollbar"
        data-component="trending-scrollbar"
      ></div>
    </div>
  );
};

export default TrendingSlider;
