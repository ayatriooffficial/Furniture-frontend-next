"use client";

const MainSliderSkeleton = () => {
  return (
    <div className="w-full h-full px-[12px] sm:px-0 relative">
      <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
};

export default MainSliderSkeleton;

// "use client";

// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper";

// import "swiper/css";
// import "swiper/css/navigation";

// const MainSlider = ({ sliderData }) => {
//   const [maxHeight, setMaxHeight] = useState("70vh");
//   const [isDesktop, setIsDesktop] = useState(true);

//   const handleResize = () => {
//     setMaxHeight(window.innerWidth <= 600 ? "470px" : "70vh");
//     setIsDesktop(window.innerWidth > 600);
//   };

//   useEffect(() => {
//     handleResize(); // Initialize on mount
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div
//       className="w-full h-[70vh] px-[12px] sm:px-0 mt-[96px] relative"
//       style={{ maxHeight }}
//     >
//       <Swiper
//         // modules={[Navigation, Autoplay]}
//         // navigation
//         loop
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//         }}
//         centeredSlides
//         spaceBetween={10}
//         className="w-full h-full bg-gray-100"
//       >
//         {sliderData?.map((data, index) => (
//           <SwiperSlide key={index} className="relative">
//             <img
//               src={isDesktop ? data.desktopImgSrc : data.mobileImgSrc}
//               alt="slider"
//               className="w-full h-full object-cover"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default MainSlider;
