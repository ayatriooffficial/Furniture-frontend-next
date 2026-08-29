"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "Flooring",
    label: "Flooring",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 12l9 4 9-4" />
        <path d="M3 17l9 4 9-4" />
      </svg>
    ),
  },
  {
    id: "Wallpapers",
    label: "Wallpaper",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9M15 21V9M3 15h18" />
      </svg>
    ),
  },
  {
    id: "Curtains",
    label: "Curtains",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h18" />
        <path d="M4 4v16c0 1.1.9 2 2 2h2V4" />
        <path d="M20 4v16c0 1.1-.9 2-2 2h-2V4" />
        <path d="M8 12c1.5-1 3.5-1 5 0" />
      </svg>
    ),
  },
];

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
  searchTerm,
  onSearchChange,
  onOpenFilters,
  activeFilterCount = 0,
  viewMode = "list",
  onToggleViewMode,
  onOpenHistory,
  originalProduct,
  activeProduct,
  products = [],
  onSelectProduct,
}) {
  // Ensure original product is always the first item in the single list
  const unifiedProductList = React.useMemo(() => {
    if (!originalProduct) return products;
    const others = products.filter((p) => p._id !== originalProduct._id);
    return [originalProduct, ...others];
  }, [originalProduct, products]);

  return (
    <aside className="w-[380px] lg:w-[410px] h-screen flex flex-col bg-white border-r border-gray-200 z-20 select-none flex-shrink-0 shadow-lg">
      {/* 1. BRAND HEADER: AYATRIO LOGO + HISTORY CLOCK BUTTON (EXACT h-14 TO ALIGN WITH TOP ACTION BAR) */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-gray-200 bg-white shrink-0">
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

      {/* 2. CATEGORY SWITCHER TABS */}
      <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/50">
        {CATEGORIES.map((cat) => {
          const isActive =
            activeCategory?.toLowerCase() === cat.id.toLowerCase() ||
            (cat.id === "Flooring" && activeCategory?.toLowerCase() === "flooring") ||
            (cat.id === "Wallpapers" && (activeCategory?.toLowerCase() === "wallpaper" || activeCategory?.toLowerCase() === "wallpapers"));

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center py-3 px-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-white shadow-xs"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
              }`}
            >
              <div className="mb-1">{cat.icon}</div>
              <span className="truncate w-full text-center">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & FILTER TOOLBAR */}
      <div className="p-3.5 border-b border-gray-100 flex items-center gap-2 bg-white">
        {/* Search Box */}
        <div className="relative flex-1">
          <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search finishes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-100 hover:bg-gray-200/60 focus:bg-white text-xs font-medium text-gray-900 rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={onOpenFilters}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            activeFilterCount > 0
              ? "border-blue-600 bg-blue-50 text-blue-700"
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
            <line x1="1" x2="7" y1="14" y2="14" />
            <line x1="9" x2="15" y1="8" y2="8" />
            <line x1="17" x2="23" y1="16" y2="16" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View Switcher (Grid / List) */}
        <button
          onClick={onToggleViewMode}
          className="p-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors cursor-pointer"
          title={viewMode === "grid" ? "Switch to List" : "Switch to Grid"}
        >
          {viewMode === "grid" ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
          )}
        </button>
      </div>

      {/* 4. SCROLLABLE CATALOG: EXACT 1-LIST ARCHITECTURE MATCHING LOWE'S */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        <p className="text-xs font-semibold text-gray-600 mb-1">
          Similar to your original selection
        </p>

        {unifiedProductList.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs font-medium">
            No products match your current filters.
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-2 gap-3">
            {unifiedProductList.map((item) => {
              const isSelected = item._id === activeProduct?._id;
              const isOriginal = item._id === originalProduct?._id;

              return (
                <div
                  key={item._id}
                  onClick={() => onSelectProduct(item)}
                  className={`group relative rounded-xl border-2 p-2.5 cursor-pointer transition-all bg-white hover:shadow-md ${
                    isSelected
                      ? "border-blue-600 ring-1 ring-blue-600"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {isOriginal && (
                    <div className="mb-1.5">
                      <span className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Original Product
                      </span>
                    </div>
                  )}

                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={getProductImage(item)}
                      alt={item.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <p className="text-xs font-extrabold text-gray-900">
                    ₹{item.perUnitPrice || item.discountedprice?.price || item.price || "95"}
                    <span className="text-[10px] font-normal text-gray-500 ml-0.5">/sq.ft</span>
                  </p>
                  <p className="text-[11px] font-semibold text-gray-700 line-clamp-1 mt-0.5">
                    {item.productTitle}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* SINGLE UNIFIED LIST VIEW MATCHING LOWE'S EXACTLY */
          <div className="flex flex-col gap-3">
            {unifiedProductList.map((item) => {
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
                  {/* Top Row: Original Product Badge (if applicable) + Top-Right External Link */}
                  <div className="flex items-center justify-between mb-2">
                    {isOriginal ? (
                      <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        Original Product
                      </span>
                    ) : (
                      <div />
                    )}

                    {/* External Link Icon in Top Right (when not expanded or for direct link) */}
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

                  {/* Card Content */}
                  <div className="flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <img
                        src={getProductImage(item)}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-extrabold text-gray-900">
                        ₹{item.perUnitPrice || item.discountedprice?.price || item.price || "95"}
                        <span className="text-xs font-normal text-gray-500 ml-1">/sq.ft</span>
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex text-yellow-400">
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

                  {/* Selected Card Action: "View Details" Full Width Button (Only on the Active Selected Item!) */}
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
      </div>
    </aside>
  );
}

export default ProductSidebar;
