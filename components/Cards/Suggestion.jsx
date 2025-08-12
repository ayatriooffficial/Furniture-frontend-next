"use client";

import { useEffect, useRef } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FreeMode, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectBlogCardData,
  selectBlogCardStatus,
} from "../Features/Slices/blogCardSlice";
import ShopByRoomSliderSkeleton from "../Skeleton/ShopByRoomSliderSkeleton";
import SuggestionCard from "./SuggestionCard";
import fixImageUrl from "@/utils/modifyUrl";

const Suggestion = () => {
  const blogCardData = useSelector(selectBlogCardData);
  const blogCardStatus = useSelector(selectBlogCardStatus);
  // console.log(blogCardData, "blogCardData");
  // console.log(blogCardStatus, "blogCardStatus");
  const dispatch = useDispatch();

  const backgroundColors = [
    "bg-[#FFF6EB]",
    "bg-[#DBF3E2]",
    "bg-[#F8F7FF]",
    "bg-[#C6ECEB]",
    "bg-[#FFFEA8]",
    "bg-[#EFEFEF]",
    "bg-[#FFF6EB]",
  ];

useEffect(() => {
  if (blogCardStatus === "idle" || blogCardStatus === "failed") {
    dispatch({ type: "FETCH_BLOG_CARD_DATA", payload: "blogCard" });
  }
}, [blogCardStatus, dispatch]);

  const swiperOptions2 = {
    slidesPerView: 4.08,
    centeredSlides: false,
    spaceBetween: 1,
    modules: [Pagination, Scrollbar, Mousewheel, FreeMode],
    navigation: {
      nextEl: ".custom-next-button",
      prevEl: ".custom-prev-button",
    },
    noSwiping: true,
    allowSlidePrev: true,
    allowSlideNext: true,
  };

  const swiper1Ref = useRef(null);

  if (!blogCardData) return <ShopByRoomSliderSkeleton />



  return (
    <section
      className="pt-12 mb-20 bg-white md:pl-[52px] ml-[12px] sm:ml-[12px] md:ml-[0px]"
      aria-label="Inspiration and Suggestions Carousel Section"
    >
      <div className="w-full flex justify-between items-center mb-2" aria-label="Carousel controls">
        <h2 className="font-semibold text-2xl py-[15px]" aria-label="Inspiration and Suggestion Title">
          Inspiration and suggestion
        </h2>
        <div className="Slidenav flex bg-white text-2xl cursor-pointer text-white rounded-full gap-2" role="group" aria-label="Slider navigation controls">
          <button
            onClick={() => swiper1Ref.current.swiper.slidePrev()}
            className="custom-prev-button bg-slate-500 rounded-full hover:bg-400 hover:scale-110 hover:text-slate-100"
            aria-label="Previous Slide"
          />
          <button
            onClick={() => swiper1Ref.current.swiper.slideNext()}
            className="custom-next-button bg-slate-500 rounded-full hover:bg-400 hover:scale-110 hover:text-slate-100"
            aria-label="Next Slide"
          />
        </div>
      </div>
  
      <Swiper
        ref={swiper1Ref}
        {...swiperOptions2}
        scrollbar={{ hide: false, draggable: true }}
        mousewheel={{ forceToAxis: true, invert: false }}
        freeMode={{ enabled: false, sticky: true }}
        breakpoints={{
          300: { slidesPerView: 1.1, spaceBetween: 5 },
          640: { slidesPerView: 2.3, spaceBetween: 10 },
          1024: { slidesPerView: 3.25, spaceBetween: 15 },
        }}
        allowSlideNext={true}
        allowSlidePrev={true}
        slideNextClass="custom-next-button"
        slidePrevClass="custom-prev-button"
        className="px-10"
        aria-label="Suggestion Cards Slider"
      >
        {!blogCardData ? (
          <SwiperSlide>
            <aside aria-label="Loading suggestion cards">
              <ShopByRoomSliderSkeleton />
            </aside>
          </SwiperSlide>
        ) : (
          blogCardData.map((suggestion, idx) => (
            <SwiperSlide key={idx} className="ml-0">
              <article aria-label={`Suggestion card ${idx + 1}`}>
                <SuggestionCard
                  title={suggestion.heading}
                  desc={suggestion.shortSummary}
                  mainImage={fixImageUrl(suggestion.mainImage?.imgSrc)}
                  key={idx}
                  bgColorClass={
                    backgroundColors[idx % backgroundColors.length]
                  }
                  id={suggestion._id}
                />
              </article>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </section>
  );  
};

export default Suggestion;
