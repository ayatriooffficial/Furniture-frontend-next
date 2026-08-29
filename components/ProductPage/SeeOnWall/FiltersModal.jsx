"use client";
import React, { useState } from "react";

const MATERIALS = [
  "All",
  "SPC Luxury Plank",
  "Solid Hardwood",
  "Waterproof Laminate",
  "Textured Wallpaper",
  "Wall Murals",
  "Sheer Curtains",
  "Blackout Curtains",
];

const STYLES = ["All", "Modern", "Contemporary", "Scandinavian", "Classic", "Minimalist", "Rustic"];
const ROOMS = ["All", "Living Room", "Bedroom", "Dining & Kitchen", "Bathroom", "Office"];
const PRICE_RANGES = ["All", "Under ₹80", "₹80 - ₹120", "₹120+"];

function FiltersModal({
  isOpen,
  onClose,
  activeFilters,
  onApplyFilters,
  totalResultsCount = 0,
}) {
  const [material, setMaterial] = useState(activeFilters?.material || "All");
  const [style, setStyle] = useState(activeFilters?.style || "All");
  const [room, setRoom] = useState(activeFilters?.room || "All");
  const [price, setPrice] = useState(activeFilters?.price || "All");

  if (!isOpen) return null;

  const handleReset = () => {
    setMaterial("All");
    setStyle("All");
    setRoom("All");
    setPrice("All");
    if (onApplyFilters) {
      onApplyFilters({ material: "All", style: "All", room: "All", price: "All" });
    }
  };

  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters({ material, style, room, price });
    }
    onClose();
  };

  const activeCount =
    (material !== "All" ? 1 : 0) +
    (style !== "All" ? 1 : 0) +
    (room !== "All" ? 1 : 0) +
    (price !== "All" ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {activeCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter Sections */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Material & Type */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Material & Collection
            </h3>
            <div className="flex flex-wrap gap-2">
              {MATERIALS.map((item) => (
                <button
                  key={item}
                  onClick={() => setMaterial(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    material === item
                      ? "bg-black text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Design Style
            </h3>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((item) => (
                <button
                  key={item}
                  onClick={() => setStyle(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    style === item
                      ? "bg-black text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Room */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Room Suitability
            </h3>
            <div className="flex flex-wrap gap-2">
              {ROOMS.map((item) => (
                <button
                  key={item}
                  onClick={() => setRoom(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    room === item
                      ? "bg-black text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((item) => (
                <button
                  key={item}
                  onClick={() => setPrice(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    price === item
                      ? "bg-black text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleReset}
            className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black underline cursor-pointer"
          >
            Reset All
          </button>

          <button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Apply Filters {totalResultsCount > 0 && `(${totalResultsCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FiltersModal;
