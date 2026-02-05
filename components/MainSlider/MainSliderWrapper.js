"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import MainSliderSkeleton from "./MainSliderSkeleton";
import fixImgUrl from "utils/modifyUrl.js";

const MainSlider = dynamic(() => import("./MainSlider"), {
  ssr: false,
  loading: () => <MainSliderSkeleton />,
});

const MainSliderWrapper = () => {
  const [sliderData, setSliderData] = useState([]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [maxHeight, setMaxHeight] = useState("70vh");
  const [isLoading, setIsLoading] = useState(true);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fallbackImage = null;

  const handleSwiperReady = () => setSwiperReady(true);

  return (
    <div className="w-full px-[6px] sm:px-0 mt-0 sm:mt-[96px]">
      <div
        className="relative w-full overflow-hidden bg-white"
        style={{ height: maxHeight, maxHeight }}
      >
        {isLoading ? (
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <MainSliderSkeleton />
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full z-10">
            <MainSlider
              sliderData={sliderData}
              onSwiperReady={handleSwiperReady}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSliderWrapper;
