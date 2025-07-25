"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import MainSliderSkeleton from "./MainSliderSkeleton";
import fixImgUrl from 'utils/modifyUrl.js'

const MainSlider = dynamic(() => import("./MainSlider"), {
  ssr: false,
  loading: () => <MainSliderSkeleton />,
});

const MainSliderWrapper = () => {
  const [sliderData, setSliderData] = useState([]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [maxHeight, setMaxHeight] = useState("70vh");
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isDesk = window.innerWidth >= 600;
      setIsDesktop(isDesk);
      setMaxHeight(isDesk ? "70vh" : "470px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/slider-data");
        const data = await res.json();
        setSliderData(data?.result || []);
      } catch (err) {
        console.error("Slider data error:", err);
      }
    };
    fetchData();
  }, []);

  const fallbackImage = sliderData?.[0]
    ? isDesktop
      ? sliderData[0].desktopImgSrc
      : sliderData[0].mobileImgSrc
    : null;

  const handleFirstImageLoad = () => setFirstImageLoaded(true);
  const handleSwiperReady = () => setSwiperReady(true);

  const showFallback = !swiperReady || !firstImageLoaded;

  return (
    <div className="w-full px-[12px] sm:px-0 mt-0 sm:mt-[96px]">
      <div className="relative w-full overflow-hidden" style={{ height: maxHeight, maxHeight }}>
        {/* Fallback image layer */}
        {fallbackImage && (
          <div
            className={`absolute top-0 left-0 w-full h-full z-0 transition-opacity duration-500 ${swiperReady ? "opacity-0" : "opacity-100"
              }`}
          >
            <div className="relative w-[94%] h-full mx-auto overflow-hidden">
              <Image
                src={fixImgUrl(fallbackImage)}
                alt="slider fallback"
                fill
                priority
                onLoad={handleFirstImageLoad}
                className="object-cover"
                style={{ maxHeight }}
              />
            </div>
          </div>
        )}

        {/* Swiper slider layer */}
        {firstImageLoaded && (
          <div
            className={`absolute top-0 left-0 w-full h-full z-10 transition-opacity duration-500 ${swiperReady ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <MainSlider sliderData={sliderData} onSwiperReady={handleSwiperReady} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSliderWrapper;
