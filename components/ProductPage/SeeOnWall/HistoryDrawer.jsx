"use client";
import React from "react";

function HistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onSelectProduct,
  onClearHistory,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="text-base font-bold text-gray-900">
              Recent History ({history.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400">
              <svg className="w-10 h-10 text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-sm font-medium">No recent products viewed yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Products you test in the room will appear here.
              </p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={`${item._id || item.productTitle}-${idx}`}
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(item);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 border border-gray-200 hover:border-blue-500 rounded-xl cursor-pointer hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img
                    src={item.images?.[0] || item.image || "/images/default.jpg"}
                    alt={item.productTitle || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">
                    {item.productTitle}
                  </p>
                  <p className="text-xs font-extrabold text-gray-800 mt-0.5">
                    ₹{item.perUnitPrice || item.discountedprice?.price || item.price || "95"}
                    <span className="text-[10px] font-normal text-gray-500 ml-0.5">/sq.ft</span>
                  </p>
                  <span className="text-[10px] text-blue-600 font-semibold mt-1 inline-block">
                    Tap to apply →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onClearHistory}
              className="w-full py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryDrawer;
