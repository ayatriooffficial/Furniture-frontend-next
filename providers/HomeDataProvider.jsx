// ✅ CENTRALIZED API CACHE CONTEXT
// Single source of truth for all home page APIs
// Prevents duplicate calls, enables server-side caching

"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HomeDataContext = createContext();

// ✅ Export for use in components
export const useHomeData = () => {
  const context = useContext(HomeDataContext);
  if (!context) {
    throw new Error("useHomeData must be used within HomeDataProvider");
  }
  return context;
};

export const HomeDataProvider = ({ children }) => {
  const [data, setData] = useState({
    categories: [],
    rankedProducts: [],
    trendingProducts: [],
    bannerSection: [],
    tabsRoom: [],
    loaded: false,
  });

  useEffect(() => {
    // ✅ LOAD CATEGORIES IMMEDIATELY (above-the-fold)
    // Only defer other below-fold data
    fetchCategories();

    // ✅ DEFER: Load other data AFTER LCP
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          fetchBelowFoldData();
        },
        { timeout: 5000 },
      );
    } else {
      // Fallback: Wait 2 seconds after page interactive
      setTimeout(() => {
        fetchBelowFoldData();
      }, 2000);
    }
  }, []);

  const fetchCategories = async () => {
    // ✅ Categories fetch - IMMEDIATE (not deferred)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/homeTrendingCategoriesImgAndType`,
        {
          cache: "force-cache",
          next: { revalidate: 3600 },
        },
      );
      const categories = await res.json();
      setData((prev) => ({ ...prev, categories: categories || [] }));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchBelowFoldData = async () => {
    // ✅ Below-fold data fetch - DEFERRED with requestIdleCallback
    try {
      const [rankedRes, trendingRes, bannerRes, tabsRes] = await Promise.all([
        // 2. Ranked Products
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/rankedProductsFoEachCategory`,
          {
            cache: "force-cache",
            next: { revalidate: 3600 },
          },
        ),
        // 3. Trending Products
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/trending-products`, {
          cache: "force-cache",
          next: { revalidate: 3600 },
        }),
        // 4. Banner Section
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBannerSection`, {
          cache: "force-cache",
          next: { revalidate: 3600 },
        }),
        // 5. Tabs Room
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getTabsRoom`, {
          cache: "force-cache",
          next: { revalidate: 3600 },
        }),
      ]);

      const [ranked, trending, banner, tabs] = await Promise.all([
        rankedRes.json(),
        trendingRes.json(),
        bannerRes.json(),
        tabsRes.json(),
      ]);

      setData((prev) => ({
        ...prev,
        rankedProducts: ranked || [],
        trendingProducts: trending || [],
        bannerSection: banner || [],
        tabsRoom: tabs || [],
        loaded: true,
      }));
    } catch (err) {
      console.error("Failed to fetch below-fold data:", err);
      setData((prev) => ({ ...prev, loaded: true }));
    }
  };

  return (
    <HomeDataContext.Provider value={data}>{children}</HomeDataContext.Provider>
  );
};
