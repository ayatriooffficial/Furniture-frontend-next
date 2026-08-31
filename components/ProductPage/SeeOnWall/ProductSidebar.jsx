"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export const ALL_8_CATEGORIES = [
  {
    id: "Flooring",
    label: "Flooring",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 12l9 4 9-4" />
        <path d="M3 17l9 4 9-4" />
      </svg>
    ),
  },
  {
    id: "Wallpaper",
    label: "Wallpaper",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9M15 21V9M3 15h18" />
      </svg>
    ),
  },
  {
    id: "Window Blinds",
    label: "Window Blinds",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="7" x2="21" y2="7" />
        <line x1="3" y1="11" x2="21" y2="11" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="12" y1="15" x2="12" y2="19" />
      </svg>
    ),
  },
  {
    id: "Curtains",
    label: "Curtains",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h18" />
        <path d="M4 4v16c0 1.1.9 2 2 2h2V4" />
        <path d="M20 4v16c0 1.1-.9 2-2 2h-2V4" />
        <path d="M8 12c1.5-1 3.5-1 5 0" />
      </svg>
    ),
  },
  {
    id: "Carpet & Rugs",
    label: "Carpet & Rugs",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M6 4v16M18 4v16M6 12h12" />
      </svg>
    ),
  },
  {
    id: "Home furnishing",
    label: "Home Furnishing",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "Artificial Green",
    label: "Artificial Green",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22v-9" />
        <path d="M12 13a5 5 0 0 0 5-5c0-4-5-6-5-6s-5 2-5 6a5 5 0 0 0 5 5z" />
        <path d="M12 17a3 3 0 0 1 3-3" />
      </svg>
    ),
  },
  {
    id: "Upholstery",
    label: "Upholstery",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 19v2M18 19v2M4 11a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-5z" />
        <path d="M4 14h16" />
      </svg>
    ),
  },
];

export const ALL_7_CATEGORIES = ALL_8_CATEGORIES;

/**
 * Intelligent Close-Group Category Map
 * Defines the active category + 2 closest related sibling categories (3 tabs total)
 */
export const CLOSE_CATEGORY_MAP = {
  "Flooring": ["Flooring", "Carpet & Rugs", "Artificial Green"],
  "Wallpaper": ["Wallpaper", "Curtains", "Home furnishing"],
  "Window Blinds": ["Window Blinds", "Curtains", "Wallpaper"],
  "Curtains": ["Curtains", "Window Blinds", "Home furnishing"],
  "Carpet & Rugs": ["Carpet & Rugs", "Flooring", "Home furnishing"],
  "Home furnishing": ["Home furnishing", "Upholstery", "Curtains"],
  "Artificial Green": ["Artificial Green", "Flooring", "Carpet & Rugs"],
  "Upholstery": ["Upholstery", "Home furnishing", "Curtains"],
};

// Helper to get valid image
const getProductImage = (prod) => {
  if (!prod) return "/images/default.jpg";
  if (Array.isArray(prod.images) && prod.images.length > 0 && typeof prod.images[0] === "string") {
    return prod.images[0];
  }
  if (typeof prod.image === "string") return prod.image;
  if (Array.isArray(prod.productImages) && prod.productImages.length > 0) {
    const item = prod.productImages[0];
    if (Array.isArray(item?.images) && item.images.length > 0) return item.images[0];
  }
  return "/images/default.jpg";
};

function ProductSidebar({
  activeCategory,
  onSelectCategory,
  subcategories = [],
  activeSubcategory,
  onSelectSubcategory,
  onOpenHistory,
  originalProduct,
  activeProduct,
  products = [],
  onSelectProduct,
}) {
  // One-way expansion state: false = close group (3 categories + View More), true = full 8 categories
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  // Determine current category key for close group matching
  const currentKey = useMemo(() => {
    const lower = (activeCategory || "").toLowerCase();
    if (lower.includes("floor")) return "Flooring";
    if (lower.includes("wall")) return "Wallpaper";
    if (lower.includes("blind")) return "Window Blinds";
    if (lower.includes("curtain")) return "Curtains";
    if (lower.includes("carpet") || lower.includes("rug")) return "Carpet & Rugs";
    if (lower.includes("furnish") || lower.includes("home")) return "Home furnishing";
    if (lower.includes("green") || lower.includes("grass")) return "Artificial Green";
    if (lower.includes("upholster")) return "Upholstery";
    return "Flooring";
  }, [activeCategory]);

  // Compute visible categories
  const visibleCategories = useMemo(() => {
    if (isCategoriesExpanded) return ALL_8_CATEGORIES;
    const allowedIds = CLOSE_CATEGORY_MAP[currentKey] || ["Flooring", "Carpet & Rugs", "Artificial Green"];
    return ALL_8_CATEGORIES.filter((c) => allowedIds.includes(c.id));
  }, [isCategoriesExpanded, currentKey]);

  // Ensure original product is only pinned when browsing its corresponding category
  const unifiedProductList = useMemo(() => {
    if (!originalProduct) return products;

    const origCat = (originalProduct.category || "").toLowerCase();
    const currentCat = (activeCategory || "").toLowerCase();
    const isMatching =
      origCat === currentCat ||
      (origCat.includes("floor") && currentCat.includes("floor")) ||
      (origCat.includes("wall") && currentCat.includes("wall")) ||
      (origCat.includes("curtain") && currentCat.includes("curtain")) ||
      (origCat.includes("blind") && currentCat.includes("blind")) ||
      (origCat.includes("carpet") && currentCat.includes("carpet")) ||
      (origCat.includes("rug") && currentCat.includes("rug")) ||
      (origCat.includes("furnish") && currentCat.includes("furnish")) ||
      (origCat.includes("home") && currentCat.includes("home")) ||
      (origCat.includes("green") && currentCat.includes("green")) ||
      (origCat.includes("grass") && currentCat.includes("grass")) ||
      (origCat.includes("upholster") && currentCat.includes("upholster"));

    if (!isMatching) return products;
    const others = products.filter((p) => p._id !== originalProduct._id);
    return [originalProduct, ...others];
  }, [originalProduct, products, activeCategory]);

  // CONTINUOUS INFINITE SCROLL BATCH STATE (NO 1,2,3 PAGE NUMBERS)
  const [visibleCount, setVisibleCount] = useState(20);
  const sentinelRef = useRef(null);

  // Reset visibleCount when category or subcategory changes
  useEffect(() => {
    setVisibleCount(20);
  }, [activeCategory, activeSubcategory]);

  // IntersectionObserver for seamless infinite scrolling
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < unifiedProductList.length) {
          setVisibleCount((prev) => Math.min(prev + 20, unifiedProductList.length));
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, unifiedProductList.length]);

  const displayedProducts = unifiedProductList.slice(0, visibleCount);

  return (
    <aside className="w-full h-full bg-white flex flex-col border-r border-gray-200 select-none">
      {/* 1. TOP BRAND ROW */}
      <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/ayatriologo.webp"
            alt="Ayatrio Logo"
            width={128}
            height={32}
            priority
            className="w-28 sm:w-32 object-contain"
          />
        </Link>

        {/* History Button with clock icon */}
        <button
          onClick={onOpenHistory}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer active:scale-95"
          title="View Recent History"
          aria-label="Recent History"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>

      {/* 2. CLOSE-GROUP CATEGORIES TRACK WITH ONE-WAY "VIEW MORE" EXPANSION */}
      <div className="border-b border-gray-200 bg-white px-1 shrink-0">
        <div
          className="overflow-x-auto flex items-center scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {visibleCategories.map((cat) => {
            const lowerActive = (activeCategory || "").toLowerCase();
            const isActive =
              lowerActive === cat.id.toLowerCase() ||
              (cat.id === "Flooring" && lowerActive.includes("floor")) ||
              (cat.id === "Wallpaper" && lowerActive.includes("wall")) ||
              (cat.id === "Window Blinds" && lowerActive.includes("blind")) ||
              (cat.id === "Curtains" && lowerActive.includes("curtain")) ||
              (cat.id === "Carpet & Rugs" && (lowerActive.includes("carpet") || lowerActive.includes("rug"))) ||
              (cat.id === "Home furnishing" && (lowerActive.includes("furnish") || lowerActive.includes("home"))) ||
              (cat.id === "Artificial Green" && lowerActive.includes("green")) ||
              (cat.id === "Upholstery" && lowerActive.includes("upholster"));

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-3 min-w-[96px] sm:min-w-[105px] border-b-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 font-medium"
                }`}
              >
                <div className={`mb-1 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                  {cat.icon}
                </div>
                <span className="text-xs tracking-tight whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}

          {/* ONE-WAY "VIEW MORE" BUTTON (100% Symmetrical with Category Tabs) */}
          {!isCategoriesExpanded && (
            <button
              onClick={() => setIsCategoriesExpanded(true)}
              className="flex flex-col items-center justify-center py-2.5 px-3 min-w-[96px] sm:min-w-[105px] border-b-2 border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 font-medium transition-all cursor-pointer shrink-0"
              title="View all categories"
            >
              <div className="mb-1 text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="text-xs tracking-tight whitespace-nowrap">View more</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. DYNAMIC HORIZONTAL SUBCATEGORIES TRACK (AUTO-SELECTED) */}
      {subcategories && subcategories.length > 0 && (
        <div className="border-b border-gray-100 bg-gray-50/60 px-3 py-2 shrink-0">
          <div
            className="overflow-x-auto flex items-center gap-1.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((sub) => {
              const isSelected = (activeSubcategory || "").toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => onSelectSubcategory && onSelectSubcategory(sub)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SCROLLABLE CATALOG WITH INFINITE SCROLL */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Similar to your original selection
        </p>

        {displayedProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs font-medium">
            No products available in this subcategory.
          </div>
        ) : (
          /* LIST VIEW */
          <div className="flex flex-col gap-3">
            {displayedProducts.map((item) => {
              const isSelected = item._id === activeProduct?._id;
              const isOriginal = item._id === originalProduct?._id;

              return (
                <div
                  key={item._id}
                  onClick={() => onSelectProduct(item)}
                  className={`relative rounded-2xl bg-white p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-blue-600 shadow-sm"
                      : "border border-gray-200 hover:border-gray-300 hover:bg-gray-50/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {isOriginal ? (
                      <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Original Product
                      </span>
                    ) : (
                      <div />
                    )}

                    <a
                      href={item._id ? `/product/${item._id}` : "#"}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="Open product page in new tab"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" x2="21" y1="14" y2="3" />
                      </svg>
                    </a>
                  </div>

                  <div className="flex gap-3.5">
                    <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img
                        src={getProductImage(item)}
                        alt={item.productTitle}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-extrabold text-gray-900">
                        ₹{item.perUnitPrice || item.discountedprice?.price || item.price || "95"}
                        <span className="text-xs font-normal text-gray-500 ml-1">/sq.ft</span>
                      </p>

                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600">
                          {item.ratings?.length || 968}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-gray-800 line-clamp-2 mt-0.5">
                        {item.productTitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2">
                      <a
                        href={item._id ? `/product/${item._id}` : "#"}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-600 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all shadow-2xs"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" x2="21" y1="14" y2="3" />
                        </svg>
                        <span>View Details</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* INFINITE SCROLL SENTINEL */}
        <div ref={sentinelRef} className="h-6 w-full shrink-0 flex items-center justify-center">
          {visibleCount < unifiedProductList.length && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium py-2">
              <div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default ProductSidebar;
