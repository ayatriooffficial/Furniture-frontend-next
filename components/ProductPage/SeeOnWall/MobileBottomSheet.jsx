"use client";
import React, { useRef, useEffect, useMemo } from "react";
import Link from "next/link";

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
  activeProduct,
  originalProduct,
  products = [],
  onSelectProduct,
  searchTerm,
  onSearchChange,
  onOpenFilters,
  activeFilterCount = 0,
  onOpenHistory,
  sheetHeight = 280,
  setSheetHeight,
  isDragging = false,
  setIsDragging,
}) {
  const touchStartY = useRef(0);
  const touchStartHeight = useRef(280);
  const minHeightRef = useRef(240);
  const maxHeightRef = useRef(620);

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

  // Unified single list with original product at top
  const unifiedProductList = useMemo(() => {
    if (!originalProduct) return products;
    const others = products.filter((p) => p._id !== originalProduct._id);
    return [originalProduct, ...others];
  }, [originalProduct, products]);

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

      {/* 2. SEARCH, FILTERS, HISTORY CONTROLS */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="px-3 sm:px-4 pb-2 flex items-center gap-2 border-b border-gray-100 shrink-0 touch-none"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <svg
            className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search finishes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => {
              if (setSheetHeight) setSheetHeight(maxHeightRef.current);
            }}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200/60 focus:bg-white text-xs font-medium text-gray-900 rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters Button */}
        <button
          onClick={onOpenFilters}
          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer shadow-2xs shrink-0 ${
            activeFilterCount > 0
              ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
              : "border-gray-300 hover:bg-gray-50 text-gray-700"
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="4" y1="21" y2="14" />
            <line x1="4" x2="4" y1="10" y2="3" />
            <line x1="12" x2="12" y1="21" y2="12" />
            <line x1="12" x2="12" y1="8" y2="3" />
            <line x1="20" x2="20" y1="21" y2="16" />
            <line x1="20" x2="20" y1="12" y2="3" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* History Button */}
        <button
          onClick={onOpenHistory}
          className="p-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors cursor-pointer shrink-0"
          title="Recent History"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>

      {/* 3. SCROLLABLE PRODUCT LIST */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-2.5 overscroll-contain">
        {/* NOW VIEWING HERO CARD */}
        {currentDisplayProduct && (
          <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
            <span className="inline-block bg-[#002d62] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
              Now Viewing
            </span>

            <div className="flex gap-2.5 items-center">
              {/* Strictly sized thumbnail container */}
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

        {/* 4. 2-COLUMN SIMILAR PRODUCTS GRID */}
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2">
            Similar to your original selection
          </h3>

          {unifiedProductList.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs font-medium">
              No products match your current search.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-8">
              {unifiedProductList.map((item) => {
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
                        className="w-full h-full object-cover"
                      />

                      {/* Original Badge */}
                      {isOriginal && (
                        <span className="absolute top-1.5 left-1.5 bg-[#002d62] text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
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
        </div>
      </div>
    </div>
  );
}

export default MobileBottomSheet;
