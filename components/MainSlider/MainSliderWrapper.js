import { Suspense } from "react";
import dynamic from "next/dynamic";
import MainSliderSkeleton from "./MainSliderSkeleton";
import { fetchSliderData } from "@/actions/fetchSliderData";

const MainSlider = dynamic(() => import("./MainSlider"), {
  ssr: false,
  loading: () => <MainSliderSkeleton />,
});

const SliderContent = async () => {
  try {
    const data = await fetchSliderData();
    const sliderData = data?.result ?? [];

    return (
      <div className="relative z-10 w-full h-auto">
        <MainSlider sliderData={sliderData} />
      </div>
    );
  } catch (err) {
    console.error("Slider data error:", err);

    return (
      <div className="relative z-0 w-full h-auto">
        <MainSliderSkeleton />
      </div>
    );
  }
};

const MainSliderWrapper = () => {
  return (
    <div className="w-full px-[12px] md:px-[52px] lg:px-[52px] max-w-[1920px] mx-auto">
      {/* Mobile uses an aspect ratio reserve. Desktop naturally sizes based on image. */}
      <div className="relative w-full overflow-hidden bg-[#f1f1f1] aspect-[1080/1463] sm:aspect-auto sm:h-auto">
        <Suspense
          fallback={
            <div className="relative z-0 w-full h-auto">
              <MainSliderSkeleton />
            </div>
          }
        >
          <SliderContent />
        </Suspense>
      </div>
    </div>
  );
};

export default MainSliderWrapper;