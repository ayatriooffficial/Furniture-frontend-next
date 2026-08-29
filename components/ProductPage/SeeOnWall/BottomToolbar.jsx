"use client";
import React from "react";

function BottomToolbar({
  onReset,
  onRotate,
  onToggleCompare,
  isCompareActive,
  zoomLevel = 100,
  onZoomIn,
  onZoomOut,
  onSetZoom,
  rotation = 0,
}) {
  return (
    <div className="w-full lg:w-auto flex items-center justify-center select-none relative">
      {/* On mobile: full-width crisp white bar with 3 evenly-spaced actions matching Lowe's.
          On desktop: floating centered rounded pill with zoom. */}
      <div className="w-full lg:w-auto flex items-center justify-around lg:justify-center bg-white lg:bg-white/95 lg:backdrop-blur-md text-gray-900 border-t border-b lg:border border-gray-200 lg:border-gray-300 lg:shadow-xl rounded-none lg:rounded-full px-4 lg:px-5 py-2 lg:py-2 gap-2 lg:gap-3">
        {/* 1. RESET BUTTON */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-black hover:bg-gray-100 rounded-full transition-all cursor-pointer active:scale-95"
          title="Reset room, rotation, and surfaces"
        >
          <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>

        <div className="h-4 w-px bg-gray-200 shrink-0" />

        {/* 2. ROTATE BUTTON */}
        <button
          onClick={onRotate}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer active:scale-95 ${
            rotation === 90
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "text-gray-800 hover:text-black hover:bg-gray-100"
          }`}
          title={`Current angle: ${rotation}°. Click to rotate pattern 90°`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              rotation === 90 ? "rotate-90 text-blue-600" : "text-gray-700"
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <span>Rotate {rotation > 0 ? `${rotation}°` : ""}</span>
        </button>

        <div className="h-4 w-px bg-gray-200 shrink-0" />

        {/* 3. COMPARE BUTTON */}
        <button
          onClick={onToggleCompare}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer active:scale-95 ${
            isCompareActive
              ? "bg-blue-600 text-white shadow-xs"
              : "text-gray-800 hover:text-black hover:bg-gray-100"
          }`}
          title="Split before/after compare slider"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3 4 7l4 4" />
            <path d="M4 7h16" />
            <path d="m16 21 4-4-4-4" />
            <path d="M20 17H4" />
          </svg>
          <span>Compare</span>
        </button>

        {/* 4. ZOOM CONTROLS (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-full p-0.5 border border-gray-200 shrink-0">
          <div className="h-4 w-px bg-gray-300 mr-1" />
          {/* Zoom Out (-) */}
          <button
            onClick={onZoomOut}
            disabled={zoomLevel <= 100}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-90"
            title="Zoom out (-25%)"
          >
            <span className="text-sm font-bold leading-none">−</span>
          </button>

          {/* Zoom Level Label */}
          <button
            onClick={() => onSetZoom(zoomLevel === 100 ? 150 : 100)}
            className="px-2 py-0.5 text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            title="Click to toggle 100% / 150%"
          >
            {zoomLevel}%
          </button>

          {/* Zoom In (+) */}
          <button
            onClick={onZoomIn}
            disabled={zoomLevel >= 200}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer active:scale-90"
            title="Zoom in (+25%)"
          >
            <span className="text-sm font-bold leading-none">＋</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomToolbar;
