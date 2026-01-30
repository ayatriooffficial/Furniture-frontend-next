"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import CategorySliderSkeleton from "../Skeleton/CategorySliderSkeleton";
import CategorySliderSwiper from "./CategorySliderSwiper";

const CategoriesSlider = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/homeTrendingCategoriesImgAndType`,
        );
        setCategories(res.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCategories([]);
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
      <div className="flex items-center justify-center w-full">
        <div className="sm:pt-[1rem] lg:pt-[20px] overflow-x-auto relative">
          {categories.length > 0 ? (
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
