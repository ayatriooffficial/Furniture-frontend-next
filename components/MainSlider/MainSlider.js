"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from 'swiper/modules'

import "swiper/css";
import "swiper/css/navigation";
import "./slider.css";

//  Register Swiper modules globally


const MainSlider = ({ sliderData, onSwiperReady }) => {
  const [maxHeight, setMaxHeight] = useState("70vh");
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 600;
      setIsDesktop(desktop);
      setMaxHeight(desktop ? "70vh" : "470px");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="w-full h-full relative"
      style={{ maxHeight }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Navigation Buttons */}
      {["prev", "next"].map((dir) => (
        <div
          key={dir}
          role="button"
          tabIndex={0}
          aria-label={`${dir === "prev" ? "Previous" : "Next"} slide`}
          className={`nav-${dir} absolute top-1/2 z-30 -translate-y-1/2 ${
            dir === "prev" ? "left-2 sm:left-4" : "right-2 sm:right-4"
          } transition-all pointer-events-none opacity-0 sm:flex items-center justify-center p-1 rounded-full ${
            isHovering ? "opacity-100 pointer-events-auto" : ""
          }`}
        >
          <Image
            src="/icons/rightarro-white.svg"
            width={37}
            height={37}
            alt={`${dir} arrow`}
            className={`transition-transform hover:scale-105 ${
              dir === "prev" ? "rotate-180" : ""
            }`}
          />
        </div>
      ))}

      <Swiper
        navigation={{
          nextEl: ".nav-next",
          prevEl: ".nav-prev",
        }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: true,
        }}
        loop
        centeredSlides
        spaceBetween={10}
        breakpoints={{
          350: { slidesPerView: 1 },
          640: { slidesPerView: 1.25 },
          1024: { slidesPerView: 1.08 },
        }}
        onSwiper={() => onSwiperReady?.()}
        className="w-full h-full"
      >
        {sliderData?.map((data, index) => (
          <SwiperSlide key={index} className="relative swiper-slide-custom">
          <Link href={data.link || "#"}>
         <div className="relative w-full h-full px-[12px] sm:px-0">
        <Image
      src={isDesktop ? data.desktopImgSrc : data.mobileImgSrc}
      alt="slider"
      fill
      priority={index === 0}
      loading={index === 0 ? "eager" : "lazy"}
      sizes="(max-width: 768px) 100vw, 100vw"
      className="object-cover"
    />
  </div>
</Link>
            {data.circles?.[0]?.productTitle && (
              <div
                className="absolute flex items-center justify-center w-full h-full"
                style={{
                  top: `${data.circles[0].topPosition}%`,
                  left: `${data.circles[0].leftPosition}%`,
                }}
              >
                <Link
                  className="p-2 bg-white shadow-lg drop-shadow-2xl"
                  href={data.circles[0].productLink}
                >
                  <h2 className="font-semibold">{data.circles[0].productTitle}</h2>
                  <p>{data.circles[0].productCategory}</p>
                  <p className="flex items-center gap-1 text-2xl mt-1">
                    <sub className="text-sm font-bold">₹</sub>
                    {data.circles[0].productPrice}
                  </p>
                </Link>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default MainSlider;
