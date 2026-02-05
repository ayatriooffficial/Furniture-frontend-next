"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selecteddbItems } from "../Features/Slices/cartSlice";
import { selectTrendingData } from "../Features/Slices/trendingSlice";
import CardsSkeleton from "./CardsSkeleton";
import "./styles.css";
import TrendingSlider from "./TrendingSlider";


const Trending = () => {
  const [newTrendingData, setNewTrendingData] = useState([]);
  const trendingData = useSelector(selectTrendingData);
  const dispatch = useDispatch();
  const cartData = useSelector(selecteddbItems);
  const [selectedType, setSelectedType] = useState("AYATRIO Family Choices");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // ⚡ DEFERRED: Load trending data AFTER first paint using requestIdleCallback
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          dispatch({ type: "FETCH_TRENDING_DATA", payload: "trending" });
        },
        { timeout: 2000 }
      );
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        dispatch({ type: "FETCH_TRENDING_DATA", payload: "trending" });
      }, 1500);
    }
  }, [dispatch]);

  useEffect(() => {
    if (trendingData) {
      setNewTrendingData(trendingData);
      setFilteredData(trendingData); // s
    }
  }, [trendingData]);
  
const handleUrgencyClick = (urgency) => {
  setSelectedType(urgency);

  if (urgency === "AYATRIO Family Choices") {
    setFilteredData(newTrendingData);
  } else {
    const filtered = newTrendingData.filter((item) => {
      // console.log(item.title, item.urgency, item.imgSrc, item.productImages);
      return item.urgency === urgency;
    });
    setFilteredData(filtered);
  }
};

  const isProductInCart = (productId) => {
    return cartData?.items?.some(
      (cartItem) => cartItem?.productId?._id === productId
    );
  };

  //  Extract unique demandtype tags from trending data
  const urgencyTypes = Array.from(
  new Set(
    newTrendingData
      .map((item) => item.urgency)
      .filter((urgency) => urgency && urgency.trim() !== "")
  )
);
  return (
    <section
      aria-label="Trending products"
      data-component="trending-section"
      data-citation="trending-products-showcase"
      className="mb-20 bg-white ml-[12px] sm:ml-[20px] md:ml-[0px] md:px-[52px]"
    >
      

      <div
        className="mb-2 w-full flex justify-between items-center"
        aria-label="Trending section header"
        data-component="trending-header"
      >
        <h2 id="products-showcase-heading" className="font-semibold text-2xl pb-[15px] lg:pt-[50px]">
          Most Family Choice
        </h2>
      </div>

      {/* Demandtype Filter Buttons */}
    {urgencyTypes.length > 0 && (
  <div
    className="pt-2.5 sm:pt-1 sm:pb-2 pb-4 flex flex-row gap-2 sm:mb-1  mb-3 overflow-x-auto scrollbar-hide"
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    {["AYATRIO Family Choices", ...urgencyTypes].map((urgency, index) => (
      <button
        key={index}
        onClick={() => handleUrgencyClick(urgency)}
        className={`cursor-pointer text-xs font-bold rounded-full flex items-center justify-center whitespace-nowrap
          ${selectedType === urgency 
            ? 'bg-[#f5f5f5] text-black border-[1.5px] border-black' 
            : 'bg-[#f5f5f5] text-black border-[1.5px] border-transparent'
          } 
          px-5 py-2 mr-2.5`}
      >
        {urgency}
      </button>
    ))}
  </div>
)}

      {/* Product Slider */}
 {filteredData?.length > 0 ? (
  <TrendingSlider
    trendingData={filteredData}
    isProductInCart={isProductInCart}
    aria-label="Trending products slider"
    data-component="trending-slider"
  />
) : (
  <div className="flex" aria-label="Trending loading skeleton">
    <CardsSkeleton />
  </div>
)}

      <div
        className="swiper-scrollbar-custom h-[2px]"
        aria-hidden="true"
        data-component="trending-scrollbar"
      />
    </section>
  );
};

export default Trending;
