"use client";

import { useRef, useEffect, useState } from "react";
import MultiCardContent from "../compounds/MultiCardContent";
import { equalizeCardHeights } from "@/utils/cardUtils";

const MulticardSlider = ({ multicardData }) => {
  const swiperRef = useRef(null);
  const cardsRef = useRef([]);

  cardsRef.current = cardsRef.current.slice(0, multicardData.length);

  useEffect(() => {
    const params = {
      centeredSlides: false,
      spaceBetween: 10,
      navigation: {
        nextEl: ".right",
        prevEl: ".back",
      },
      noSwiping: false,
      allowSlidePrev: true,
      allowSlideNext: true,
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
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 10,
        },
      },
      allowSlideNext: true,
      allowSlidePrev: true,
      noSwiping: true,
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);
      swiperRef.current.initialize?.();
    }

    equalizeCardHeights(cardsRef.current);

    const handleResize = () => equalizeCardHeights(cardsRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [multicardData]);

  return (
    <swiper-container
      init="false"
      style={{ "--swiper-navigation-size": "24px" }}
      ref={swiperRef}
      onSwiper={(swiper) => {
        swiper.on('slideChange', () => equalizeCardHeights(cardsRef.current));
        swiper.on('breakpoint', () => equalizeCardHeights(cardsRef.current));
      }}
    >
      {multicardData.map((curElement, idx) => (
        <swiper-slide key={idx}>
          <div 
            ref={el => cardsRef.current[idx] = el} 
            className="h-full"
          >
            <MultiCardContent
              title={curElement.title}
              text={curElement.description}
              iconPath={curElement.icon}
              iconSize={40}
            />
          </div>
        </swiper-slide>
      ))}
    </swiper-container>
  );
};

export default MulticardSlider;
