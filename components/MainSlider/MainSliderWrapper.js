"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MainSliderSkeleton from "./MainSliderSkeleton";

const MainSlider = dynamic(() => import("./MainSlider"), {
  ssr: false,
  loading: () => <MainSliderSkeleton />,
});

const MainSliderWrapper = () => {
  const [sliderData, setSliderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="w-full px-[2px] sm:px-0 mt-28 sm:mt-[96px]">
      {/* aspect-[1080/1463] reserves exact space on mobile before JS runs.
          sm:aspect-auto + sm:h-[70vh] takes over on desktop. */}
      <div className="relative w-full overflow-hidden bg-[#f1f1f1] aspect-[1080/1463] sm:aspect-auto sm:h-[70vh]">
        {isLoading ? (
          <div className="absolute inset-0 z-0">
            <MainSliderSkeleton />
          </div>
        ) : (
          <div className="absolute inset-0 z-10">
            <MainSlider sliderData={sliderData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSliderWrapper;
