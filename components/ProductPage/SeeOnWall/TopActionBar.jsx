"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function TopActionBar({
  activeRoomTitle = "Modern Living Room",
  onOpenRoomOptions,
  onOpenUpload,
  onOpenSave,
  onOpenShare,
  onClose,
  savedCount = 0,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-14 shrink-0 relative w-full z-30 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between transition-all select-none">
      {/* LEFT SECTION: ROOM DESIGN TITLE (DESKTOP ONLY) */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[320px]">
            {activeRoomTitle || "Ayatrio 3D Visualizer"}
          </h1>
        </div>
      </div>

      {/* MOBILE / TABLET LEFT: Room Options button (Matching Lowe's) */}
      <div className="flex lg:hidden items-center gap-2">
        <button
          onClick={onOpenRoomOptions}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50/50 border border-gray-300 rounded-full transition-all active:scale-95 shadow-2xs"
        >
          <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Room Options</span>
        </button>
      </div>

      {/* CENTER ACTIONS (DESKTOP ONLY): Upload & Change Room */}
      <div className="hidden lg:flex items-center gap-2.5">
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>Upload</span>
        </button>

        <button
          onClick={onOpenRoomOptions}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Change Room</span>
        </button>
      </div>

      {/* DESKTOP RIGHT: Save to Project, Share, Close */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={onOpenSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:text-black transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>Save to Project</span>
          {savedCount > 0 && (
            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:text-black transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
          <span>Share</span>
        </button>

        <div className="h-4 w-px bg-gray-300 mx-1" />

        <button
          onClick={onClose}
          aria-label="Close Visualizer"
          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Image src="/icons/cancel.svg" alt="Close" width={16} height={16} />
        </button>
      </div>

      {/* MOBILE / TABLET RIGHT: Menu Button & Close */}
      <div className="flex lg:hidden items-center gap-2 relative">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full transition-all active:scale-95"
        >
          <span className="tracking-widest font-bold">···</span>
          <span className="ml-0.5">Menu</span>
        </button>

        <button
          onClick={onClose}
          aria-label="Close Visualizer"
          className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Image src="/icons/cancel.svg" alt="Close" width={16} height={16} />
        </button>

        {/* Mobile Dropdown Popover */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSave();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-800 hover:bg-gray-50 text-left font-semibold"
              >
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>Save to Project</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenShare();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-gray-800 hover:bg-gray-50 text-left font-semibold"
              >
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
                <span>Share Design</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default TopActionBar;
