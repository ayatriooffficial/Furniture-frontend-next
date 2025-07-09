"use client";
import React, { useRef } from "react";
import { data } from "@/Model/FaqSwiperData/FAQSwiperData";
import "./FAQSwiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";

const FAQSwiper = () => {
  const swiperRef = useRef(null);
  const handleWheel = (event) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (event.deltaX > 0) {
        swiperRef.current.swiper.slideNext();
      } else {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };
  const goNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const swiperParams = {
    spaceBetween: 30,
    slidesPerView: 4,
    navigation: {
      nextEl: ".my-swiper-button-next",
      prevEl: ".my-swiper-button-prev",
    },
  };
  const swiperParams1 = {
    spaceBetween: 30,
    slidesPerView: 1,
    navigation: {
      nextEl: ".my-swiper-button-next",
      prevEl: ".my-swiper-button-prev",
    },
  };

  return (
    <>
      {/* only for desktop */}
      <div
        className="border-2 overflow-hidden border-black relative w-full rounded-xl p-5 h-auto sm:flex hidden"
        onWheel={handleWheel}
      >
        <Swiper {...swiperParams} ref={swiperRef}>
          {data.map((curElement, index) => (
            <SwiperSlide className="my-swiper-slide flex flex-row" key={index}>
              <div className="flex flex-col items-start justify-between hover:underline cursor-pointer h-72">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">{curElement.heading}</h3>
                  <p>{curElement.text}</p>
                </div>
                <div className="flex">
                  <button className="bg-black text-white rounded-3xl p-3 px-4 text-sm font-semibold">
                    Read more
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="my-swiper-button-prev" onClick={goPrev}></div>
        <div className="my-swiper-button-next" onClick={goNext}></div>
      </div>
      {/* only for mobile */}
      <div
        className="border-2 overflow-hidden border-black relative w-full rounded-xl p-5 h-auto sm:hidden flex "
        onWheel={handleWheel}
      >
        <Swiper {...swiperParams1} ref={swiperRef}>
          {data.map((curElement, index) => (
            <SwiperSlide className="my-swiper-slide flex flex-row" key={index}>
              <div className="flex flex-col items-start justify-between hover:underline cursor-pointer h-72">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">{curElement.heading}</h3>
                  <p>{curElement.text}</p>
                </div>
                <div className="flex">
                  <button className="bg-black text-white rounded-3xl p-3 px-4 text-sm font-semibold">
                    Read more
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default FAQSwiper;
