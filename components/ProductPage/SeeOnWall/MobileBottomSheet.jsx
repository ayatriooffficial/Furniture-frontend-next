"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_8_CATEGORIES, CLOSE_CATEGORY_MAP } from "./ProductSidebar";

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

function MobileBottomSheet({
  activeCategory,
  onSelectCategory,
  subcategories = [],
  activeSubcategory,
  onSelectSubcategory,
  activeProduct,
  originalProduct,
  products = [],
  onSelectProduct,
  sheetHeight = 310,
  setSheetHeight,
  isDragging = false,
  setIsDragging,
}) {
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(310);
  const minHeightRef = useRef(260);
  const maxHeightRef = useRef(620);

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

  // Initialize responsive min and max bounds based on window height
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateBounds = () => {
        const vh = window.innerHeight;
        minHeightRef.current = Math.min(320, Math.max(260, Math.round(vh * 0.41)));
        maxHeightRef.current = vh - 60; // Leave 60px header at top
        if (setSheetHeight) {
          setSheetHeight((prev) => Math.max(minHeightRef.current, Math.min(prev, maxHeightRef.current)));
        }
      };
      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, [setSheetHeight]);

  // 1. DIRECT REAL-TIME FINGERPRINT DRAGGING (0ms lag, 1:1 finger tracking)
  const handleTouchStart = (e) => {
    if (setIsDragging) setIsDragging(true);
    touchStartY.current = e.touches[0].clientY;
    touchStartHeight.current = sheetHeight;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientY = e.touches[0].clientY;
    const deltaY = touchStartY.current - clientY; // Dragging UP increases height
    const rawHeight = touchStartHeight.current + deltaY;
    const boundedHeight = Math.min(Math.max(rawHeight, minHeightRef.current), maxHeightRef.current);
    if (setSheetHeight) setSheetHeight(boundedHeight);
  };

  const handleTouchEnd = () => {
    if (setIsDragging) setIsDragging(false);
  };

  // Tap handle to toggle between min & max
  const handleHandleClick = () => {
    const isNearTop = sheetHeight > (minHeightRef.current + maxHeightRef.current) / 2;
    if (setSheetHeight) {
      setSheetHeight(isNearTop ? minHeightRef.current : maxHeightRef.current);
    }
  };

  // Unified single list with original product at top when matching category
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

  // CONTINUOUS INFINITE SCROLL STATE (+20 items per batch)
  const [visibleCount, setVisibleCount] = useState(20);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(20);
  }, [activeCategory, activeSubcategory]);

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
  const currentDisplayProduct = activeProduct || originalProduct || products[0];

  return (
    <div
      style={{
        height: `${sheetHeight}px`,
        transition: isDragging ? "none" : "height 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 flex flex-col select-none will-change-[height]"
    >
      {/* 1. DRAG HANDLE BAR (TOUCHPAD) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleHandleClick}
        className="w-full pt-2.5 pb-1.5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0 touch-none"
      >
        <div className="w-12 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full transition-colors" />
      </div>

      {/* 2. CLOSE-GROUP CATEGORIES TRACK WITH ONE-WAY "VIEW MORE" EXPANSION */}
      <div className="border-b border-gray-100 px-1 shrink-0 bg-white">
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
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center py-2 px-2.5 min-w-[85px] sm:min-w-[95px] border-b-2 transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 font-medium"
                }`}
              >
                <div className={`mb-1 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] tracking-tight whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}

          {/* ONE-WAY "VIEW MORE" BUTTON (100% Symmetrical with Category Tabs) */}
          {!isCategoriesExpanded && (
            <button
              onClick={() => setIsCategoriesExpanded(true)}
              className="flex flex-col items-center justify-center py-2 px-2.5 min-w-[85px] sm:min-w-[95px] border-b-2 border-transparent text-gray-500 hover:text-gray-900 font-medium transition-all cursor-pointer shrink-0"
              title="View all categories"
            >
              <div className="mb-1 text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span className="text-[11px] tracking-tight whitespace-nowrap">View more</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. DYNAMIC HORIZONTAL SUBCATEGORIES TRACK (AUTO-SELECTED) */}
      {subcategories && subcategories.length > 0 && (
        <div className="border-b border-gray-100 bg-gray-50/70 px-2.5 py-2 shrink-0 touch-none">
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
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-black text-white shadow-sm"
                      : "bg-white text-gray-600 hover:text-black border border-gray-200"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SCROLLABLE PRODUCT LIST */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-2.5 overscroll-contain">
        {/* NOW VIEWING HERO CARD */}
        {currentDisplayProduct && (
          <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
              Now Viewing
            </span>

            <div className="flex gap-2.5 items-center">
              <div
                style={{ width: "56px", height: "56px", minWidth: "56px", minHeight: "56px", maxWidth: "56px", maxHeight: "56px" }}
                className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200"
              >
                <img
                  src={getProductImage(currentDisplayProduct)}
                  alt={currentDisplayProduct.productTitle}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">
                  {currentDisplayProduct.productTitle}
                </p>

                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs font-extrabold text-gray-900">
                    ₹{currentDisplayProduct.perUnitPrice || currentDisplayProduct.discountedprice?.price || currentDisplayProduct.price || "95"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">/sq.ft</span>
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-blue-600">
                    {currentDisplayProduct.ratings?.length || 968}
                  </span>
                </div>
              </div>
            </div>

            {/* View Details full-width button */}
            <div className="mt-2 pt-1.5 border-t border-gray-100">
              <a
                href={currentDisplayProduct._id ? `/product/${currentDisplayProduct._id}` : "#"}
                target="_blank"
                rel="noreferrer"
                className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-600 flex items-center justify-center gap-1 py-1 rounded-full transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                <span>View Details</span>
              </a>
            </div>
          </div>
        )}

        {/* 5. 2-COLUMN SIMILAR PRODUCTS GRID WITH INFINITE SCROLL */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2">
            Similar to your original selection
          </h3>

          {displayedProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs font-medium">
              No products match your current search.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-4">
              {displayedProducts.map((item) => {
                const isSelected = item._id === activeProduct?._id;
                const isOriginal = item._id === originalProduct?._id;

                return (
                  <div
                    key={item._id}
                    onClick={() => onSelectProduct(item)}
                    className={`rounded-xl p-2 cursor-pointer transition-all bg-white flex flex-col ${
                      isSelected
                        ? "border-2 border-blue-600 shadow-sm ring-1 ring-blue-600/30"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Thumbnail Frame */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 relative mb-1">
                      <img
                        src={getProductImage(item)}
                        alt={item.productTitle}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />

                      {/* Original Badge */}
                      {isOriginal && (
                        <span className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                          Original
                        </span>
                      )}

                      {/* Bookmark Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-700 shadow-xs hover:bg-white"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs font-extrabold text-gray-900">
                        ₹{item.perUnitPrice || item.discountedprice?.price || item.price || "95"}
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">/sq.ft</span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-[9px] font-semibold text-gray-600">
                        {item.ratings?.length || 968}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* INFINITE SCROLL SENTINEL */}
          <div ref={sentinelRef} className="h-6 w-full shrink-0 flex items-center justify-center pb-6">
            {visibleCount < unifiedProductList.length && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <div className="w-3 h-3 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileBottomSheet;
