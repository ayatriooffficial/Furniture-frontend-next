"use client";
import { useDispatch, useSelector } from "react-redux";
import { createRef, useEffect, useRef, useState } from "react";
import {
  selectRecommendationCategoryWiseStatus,
  selectRecommendedCategoryWiseProduct,
} from "../Features/Slices/recommendationCategoryWiseSlice";
import Dataslider from "./Dataslider";
import CategorySlidesSkeleton from "../Skeleton/CategorySlidesSkeleton";

const DataSliderWrapper = ({
  sliderIndexOffset = 0,
  sliderIndexStart = 0,
  sliderIndexEnd = 2,
}) => {
  const dispatch = useDispatch();
  const recommended = useSelector(selectRecommendedCategoryWiseProduct);
  const recommendedStatus = useSelector(selectRecommendationCategoryWiseStatus);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const datasliderRefs = useRef([]);

 useEffect(() => {
  console.log("recommendedStatus:", recommendedStatus);
  if (recommendedStatus === "idle") {
    dispatch({
      type: "RECOMMENDATION_CATEGORYWISE_REQUEST",
      payload: { categoryLimit: 3, productLimit: 10 },
    });
  }
}, [dispatch, recommendedStatus]);

  useEffect(() => {
    if (recommended) {
      console.log("Recommended categories:", recommended);
      setFilteredData(recommended);
      setUniqueCategories(Object.keys(recommended));
    }
  }, [recommended]);

  useEffect(() => {
    datasliderRefs.current = uniqueCategories.map(() => createRef());
  }, [uniqueCategories]);

  return (
    <section
      aria-label="recommended product categories"
      data-component="recommended-products-carousel-section"
    >
      {uniqueCategories.length > 0 ? (
        uniqueCategories.map((item, index) => (
          <div
            key={item}
            aria-label={`${item} recommendations`}
            data-component="category-slider"
            data-category={item.toLowerCase().replace(" ", "-")}
          >
            <Dataslider
              category={item}
              sliderIndex={index + sliderIndexOffset}
              data={filteredData[item] || []}
              ref={datasliderRefs.current[index + sliderIndexStart]}
              aria-live="polite"
            />
          </div>
        ))
      ) : (
        <div
          aria-label="Loading recommendations"
          data-component="loading-skeletons"
        >
          <CategorySlidesSkeleton aria-hidden="true" />
          <CategorySlidesSkeleton aria-hidden="true" />
          <CategorySlidesSkeleton aria-hidden="true" />
        </div>
      )}
    </section>
  );
};

export default DataSliderWrapper;
