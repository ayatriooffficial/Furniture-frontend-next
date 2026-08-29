"use client";
import React, { useState } from "react";
import Image from "next/image";

function ShareModal({
  isOpen,
  onClose,
  activeRoomName = "Living Room",
  roomImageUrl,
  productTitle = "Selected Product",
  shareUrl,
  onDownloadSnapshot,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    shareUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareText = encodeURIComponent(
    `Check out this room design with ${productTitle} on Ayatrio 3D Visualizer!`
  );
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Share this design</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Image src="/icons/cancel.svg" alt="Close" width={16} height={16} />
          </button>
        </div>

        {/* Room Snapshot Preview */}
        <div className="p-6">
          <div className="flex items-center gap-3.5 p-3 bg-gray-50 rounded-2xl border border-gray-200/80 mb-5">
            <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 relative border border-gray-200">
              {roomImageUrl ? (
                <img
                  src={roomImageUrl}
                  alt={activeRoomName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Room
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 capitalize truncate">
                {activeRoomName}
              </p>
              <p className="text-xs text-gray-500 truncate">{productTitle}</p>
            </div>
          </div>

          {/* Share Action Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-2xl text-sm font-semibold transition-all active:scale-[0.98] cursor-pointer ${
                copied
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-800"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </button>

            {/* Download Image */}
            <button
              onClick={() => onDownloadSnapshot && onDownloadSnapshot()}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-semibold text-gray-800 transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Download</span>
            </button>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-semibold text-gray-800 transition-all active:scale-[0.98]"
            >
              <svg className="w-4 h-4 text-green-600 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:?subject=${encodeURIComponent("Ayatrio 3D Room Design")}&body=${shareText}%0A%0A${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-semibold text-gray-800 transition-all active:scale-[0.98]"
            >
              <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
