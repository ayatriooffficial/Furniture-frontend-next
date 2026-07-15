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
      <div className="absolute inset-0 z-10">
        <MainSlider sliderData={sliderData} />
      </div>
    );
  } catch (err) {
    console.error("Slider data error:", err);

    return (
      <div className="absolute inset-0 z-0">
        <MainSliderSkeleton />
      </div>
    );
  }
};

const MainSliderWrapper = () => {
  return (
    <div className="w-full px-[20px] sm:px-[52px]">
      {/* aspect-[1080/1463] reserves exact space on mobile before JS runs.
          sm:aspect-auto + sm:h-[70vh] takes over on desktop. */}
      <div className="relative w-full overflow-hidden bg-[#f1f1f1] aspect-[1080/1463] sm:aspect-auto sm:h-[70vh]">
        <Suspense
          fallback={
            <div className="absolute inset-0 z-0">
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