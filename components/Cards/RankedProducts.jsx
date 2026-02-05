"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRankedProductsData } from "../Features/Slices/rankedProductsSlice";
import {
  selectRecommendationCategoryWiseLoader,
  selectRecommendationCategoryWiseStatus,
  selectRecommendedCategoryWiseProduct,
} from "../Features/Slices/recommendationCategoryWiseSlice";
import RankedProductsSlider from "./RankedProductsSlider";

const RankedProducts = () => {
  const [data, setData] = useState([]);
  const colors = useMemo(
    () => [
       { header: "#848c71", rank: "#f5c518" },
    { header: "#7c6e65", rank: "#f5c518" },
    { header: "#a18594", rank: "#f5c518" },
    { header: "#64748b", rank: "#f5c518" },
    { header: "#78350f", rank: "#f5c518" },
    { header: "#365314", rank: "#f5c518" },
    ],
    []
  );

  const rankedData = useSelector(selectRankedProductsData);
  const recommended = useSelector(selectRecommendedCategoryWiseProduct);
  const isRecommendedLoading = useSelector(selectRecommendationCategoryWiseLoader);
  const recommendedStatus = useSelector(selectRecommendationCategoryWiseStatus);
  const dispatch = useDispatch();


  // ⚡ DEFERRED: Fetch recommended categories after interactive
  useEffect(() => {
    if (Object.keys(recommended).length === 0 && recommendedStatus === "idle" && !isRecommendedLoading) {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            dispatch({
              type: "RECOMMENDATION_CATEGORYWISE_REQUEST",
              payload: { categoryLimit: 3, productLimit: 12 },
            });
          },
          { timeout: 3000 }
        );
      } else {
        setTimeout(() => {
          dispatch({
            type: "RECOMMENDATION_CATEGORYWISE_REQUEST",
            payload: { categoryLimit: 3, productLimit: 12 },
          });
        }, 2500);
      }
    }
  }, [dispatch, isRecommendedLoading, recommendedStatus]);

  // ⚡ DEFERRED: Fetch ranked data after recommended loaded
  useEffect(() => {
    if (Object.keys(recommended).length > 0 && rankedData.length === 0) {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            dispatch({ type: "FETCH_RANKED_DATA", payload: "rankedProducts" });
          },
          { timeout: 3000 }
        );
      } else {
        setTimeout(() => {
          dispatch({ type: "FETCH_RANKED_DATA", payload: "rankedProducts" });
        }, 2500);
      }
    }
  }, [dispatch, recommended, rankedData]);

  // Memoize filtered data computation
  const filteredData = useMemo(() => {
    if (rankedData.length > 0 && Object.keys(recommended).length > 0) {
      const categories = Object.keys(recommended);
      const uniqueCategories = [...new Set(categories)];
      return rankedData.filter(
        (item) => !uniqueCategories.includes(item.category)
      );
    }
    return [];
  }, [rankedData, recommended]);

  useEffect(() => {
    setData(filteredData);
  }, [filteredData]);

  return (
    <>
      {data && data.length > 0 && (
        <section className="lg:px-[52px] md:px-[20px] px-[12px] ">
          <div className="mb-2 w-full flex justify-between items-center pt-[60px]">
            <h2 className="font-semibold text-2xl pb-[20px]">
            Enjoy Upto 50% off* | Across all home products
            </h2>
          </div>
          <RankedProductsSlider data={data} colors={colors} />
        </section>
      )}
    </>
  );
};

export default RankedProducts;
