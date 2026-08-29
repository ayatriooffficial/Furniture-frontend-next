"use client";
// import Image from "next/image";
// import { useState } from "react";

// const Slider = () => {
//   const [sliderPosition, setSliderPosition] = useState(50);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleMove = (event) => {
//     if (!isDragging) return;

//     const rect = event.currentTarget.getBoundingClientRect();
//     const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
//     const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

//     setSliderPosition(percent);
//   };

//   const handleMouseDown = () => {
//     setIsDragging(true);
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   return (
//     <div
//       className="w-full flex justify-between  relative"
//       onMouseUp={handleMouseUp}
//     >
//       <div
//         className="relative w-full max-w-[700px] aspect-[70/40] m-auto overflow-hidden select-none"
//         onMouseMove={handleMove}
//         onMouseDown={handleMouseDown}
//       >
//         <Image
//           alt=""
//           fill
//           draggable={false}
//           priority
//           src="/images/Dropitemsimg/featuredflooring.jpg"
//         />

//         <div
//           className="absolute top-0 w-full max-w-[700px] aspect-[70/40] m-auto overflow-hidden select-none"
//           style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
//         >
//           <Image
//             fill
//             priority
//             draggable={false}
//             alt=""
//             src="/images/Dropitemsimg/featuredflooring.jpg"
//           />
//         </div>
//         <div
//           className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
//           style={{
//             left: `calc(${sliderPosition}% - 1px)`,
//           }}
//         >
//           <div className="bg-white absolute rounded-full h-3 w-3 -left-1 top-[calc(50%-5px)]" />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Slider;

import Image from "next/image";
import { useEffect, useState } from "react";

const Slider = ({ variantA , variantB }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeVariant, setActiveVariant] = useState(null); // To track which variant is selected
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 451);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const getClientX = (event) => {
    if (event.touches && event.touches.length > 0) return event.touches[0].clientX;
    return event.clientX;
  };

  const handleMove = (event) => {
    if (!isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(getClientX(event) - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));

    setSliderPosition(percent);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleVariantClick = (variant) => {
    setActiveVariant(variant); // Set the active variant (A or B)
    setShowSidebar(true); // Show sidebar when either variant is clicked
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Main Slider Section */}
      <div
        className="w-full flex justify-between relative"
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="relative object-cover w-full sm:w-[72vw] max-h-[60vh] sm:max-h-[75vh] aspect-[70/40] m-auto overflow-hidden select-none touch-none"
          onMouseMove={handleMove}
          onMouseDown={handleMouseDown}
          onTouchMove={handleMove}
          onTouchStart={handleMouseDown}
        >
          <Image
            alt=""
            fill
            draggable={false}
            priority
            src={variantB || "/images/default.jpg"} // Fallback if no selectedImage
            className="w-full h-auto object-cover"

          />

          <div
            className="absolute top-0 object-cover w-full sm:w-[72vw] max-h-[60vh] sm:max-h-[75vh] aspect-[70/40] m-auto overflow-hidden select-none touch-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              fill
              priority
              draggable={false}
              alt=""
              src={variantA || "/images/default.jpg"} // Use the same selected image
            />
          </div>
          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{
              left: `calc(${sliderPosition}% - 1px)`,
            }}
          >
            <div className="bg-white absolute rounded-full h-3 w-3 -left-1 top-[calc(50%-5px)]" />
          </div>

          {/* Variant A Button */}
          <button
            className="absolute top-[50%] transform -translate-y-1/2 bg-black text-white px-2 py-1 text-xs sm:text-sm"
            style={{
              left: isMobile ? `calc(${sliderPosition}% - 28px)` : `calc(${sliderPosition}% - 100px)`,
            }}
            onClick={() => handleVariantClick("A")}
          >
            Variante A
          </button>

          {/* Variant B Button */}
          <button
            className="absolute top-[50%] transform -translate-y-1/2 bg-black text-white px-2 py-1 text-xs sm:text-sm"
            style={{
              left: isMobile ? `calc(${sliderPosition}% + 2px)` : `calc(${sliderPosition}% + 2px)`,
            }}
            onClick={() => handleVariantClick("B")}
          >
            Variante B
          </button>
        </div>
      </div>

      {/* Sidebar Section */}
      {showSidebar && (
        <>
          {/* Mobile-only backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 block sm:hidden"
            onClick={closeSidebar}
          />
          <div className="fixed inset-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:w-[400px] bg-white shadow-lg z-50 overflow-y-auto">
            <div className="p-3 sm:p-4">
              <div className="flex justify-between items-center sticky top-0 bg-white border-b border-gray-200 pb-2 z-10">
                <h2 className="text-base sm:text-xl font-bold">Choose Products</h2>
                <button
                  onClick={closeSidebar}
                  className="text-lg px-2 hover:bg-[#e5e5e5] rounded-full cursor-pointer"
                  aria-label="Close"
                >
                  <Image
                    loading="lazy"
                    src="/icons/cancel.svg"
                    alt="close"
                    width={20}
                    height={20}
                    className="py-2 font-bold"
                  />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="bg-black text-white px-4 sm:px-6 rounded-full py-2 text-sm">
                  Style
                </button>
                <button className="bg-[#f5f5f5] text-black px-4 sm:px-6 rounded-full py-2 text-sm">
                  Color
                </button>
                <button className="bg-[#f5f5f5] text-black px-4 sm:px-6 rounded-full py-2 text-sm">
                  Price
                </button>
              </div>

              {/* Content depending on the selected variant */}
              <div className="mt-4">
                {activeVariant === "A" ? (
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Products for Variante A</h3>
                    {/* Product details for Variante A */}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">Products for Variante B</h3>
                    {/* Product details for Variante B */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Slider;
