"use client";

import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FreeMode, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import axios from "axios";
import ShopByRoomCard from "./shopbyroomCard";

import ShopByRoomSliderSkeleton from "./../Skeleton/ShopByRoomSliderSkeleton";
import fixImgUrl from 'utils/modifyUrl.js'

const ShopByRoomSlider = () => {
  const backgroundColors = [
    "bg-[#F0713C]",
    "bg-[#FFE565]",
    "bg-[#87AD40]",
    "bg-[#69AFB8]",
    "bg-[#D8B4FE]",
    "bg-[#000000]",
    "bg-[#91D8FB]",
  ];

  const [RoomDataSlider, setRoomDataSlider] = useState([]);
  const swiper1Ref = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllRoommain`
        );
        if (response.data.length > 0) {
          setRoomDataSlider(response.data);
        }
      } catch (error) {
        console.log("Error fetching room main data:", error);
      }
    };
    fetchData();
  }, []);

  const swiperOptions2 = {
    slidesPerView: 4,
    centeredSlides: false,
    spaceBetween: 10,
    modules: [Pagination, Scrollbar, Mousewheel, FreeMode],
    navigation: {
      nextEl: ".custom-next-button",
      prevEl: ".custom-prev-button",
    },
    scrollbar: {
      hide: false,
      draggable: true,
    },
    mousewheel: {
      forceToAxis: true,
    },
    freeMode: {
      enabled: false,
      sticky: true,
    },
    breakpoints: {
      300: {
        slidesPerView: 1.1,
        spaceBetween: 5,
      },
      640: {
        slidesPerView: 2.3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3.25,
        spaceBetween: 15,
      },
    },
  };

  if (!RoomDataSlider || RoomDataSlider.length === 0) {
    return <ShopByRoomSliderSkeleton />;
  }

  return (
      <article className="sm:px-[52px]  px-[12px] sm:px-[15px] lg:px-[52px] pt-12 mb-20 bg-white">
        <div className="mb-2 w-full flex justify-between items-center">
          <h2 className="font-semibold text-2xl pb-[15px] pt-[35px]">
            Inspiration for every room
          </h2>
          <div className="Slidenav flex bg-white text-2xl cursor-pointer text-white rounded-full gap-2">
            <div
              onClick={() => swiper1Ref.current.swiper.slidePrev()}
              className="custom-prev-button bg-slate-500 rounded-full hover:bg-400 hover:scale-110 hover:text-slate-100"
            ></div>
            <div
              onClick={() => swiper1Ref.current.swiper.slideNext()}
              className="custom-next-button bg-slate-500 rounded-full hover:bg-400 hover:scale-110 hover:text-slate-100"
            ></div>
          </div>
        </div>
        <Swiper
          ref={swiper1Ref}
          {...swiperOptions2}
          className="px-10"
        >
          {RoomDataSlider?.map((roomData, idx) => (
            <SwiperSlide
              key={idx}
              className="ml-0 min-w-[322px] sm:min-w-0"
            >
              <ShopByRoomCard
                title={roomData?.roomType}
                desc={roomData?.shortSummary}
                imgSrc={
                  roomData?.mainImage?.imgSrc}
                summary={roomData?.summary}
                bgColorClass={
                  backgroundColors[idx % backgroundColors.length]
                }
                id={roomData?.roomType.replace(/\s+/g, "-")}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </article>
  );
};

export default ShopByRoomSlider;
