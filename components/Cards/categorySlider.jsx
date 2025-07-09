"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import CategorySliderSkeleton from "../Skeleton/CategorySliderSkeleton";
import CategorySliderSwiper from "./CategorySliderSwiper";

const CategoriesSlider = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trendingCategories`);
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section
      className="category-navigation"
      aria-label="Category navigation"
      data-component="category-slider-nav"
    >
      <div className="flex items-center justify-start">
        <div className="sm:pt-[1rem] lg:pt-[20px] lg:pl-[52px] md:pl-[20px] pl-[12px] overflow-x-auto relative w-full">
          {error ? (
            <div className="text-red-500 p-4">Unable to load categories</div>
          ) : categories.length > 0 ? (
            <div
              className="categories-slider"
              aria-live="polite"
              aria-label="Trending categories"
              data-component="categories-slider"
            >
              <div className="flex flex-row group items-center justify-end gap-4 lg:mb-4">
                <CategorySliderSwiper
                  categories={categories}
                  aria-describedby="category-slider-description"
                  data-component="category-slider-swiper"
                />
              </div>
            </div>
          ) : (
            <CategorySliderSkeleton
              aria-hidden="true"
              data-component="category-slider-skeleton"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSlider;
