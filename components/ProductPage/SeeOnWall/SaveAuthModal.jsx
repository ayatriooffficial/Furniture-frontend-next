"use client";
import React, { useState } from "react";

function SaveAuthModal({
  isOpen,
  onClose,
  onSaveConfirmed,
  productTitle = "Selected Product",
  activeRoomName = "Living Room",
  activeRoomImage = "",
  rotation = 0,
}) {
  const [projectName, setProjectName] = useState(
    `My ${activeRoomName} Design`
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Save Project for logged-in user
  const handleSaveProject = (e) => {
    e.preventDefault();

    const savedProject = {
      id: `proj_${Date.now()}`,
      name: projectName,
      product: productTitle,
      room: activeRoomName,
      roomImage: activeRoomImage,
      rotation,
      savedAt: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    // Store in localStorage under 'ayatrio_saved_projects'
    try {
      const existing = JSON.parse(localStorage.getItem("ayatrio_saved_projects") || "[]");
      localStorage.setItem("ayatrio_saved_projects", JSON.stringify([savedProject, ...existing]));
    } catch (err) {
      console.error("Storage error:", err);
    }

    setSavedSuccess(true);
    if (onSaveConfirmed) {
      onSaveConfirmed(savedProject);
    }

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Save to Project</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {savedSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mb-2.5 animate-bounce">
                ✓
              </div>
              <h3 className="text-base font-bold text-gray-900">Saved to Your Project Folder!</h3>
              <p className="text-xs text-gray-500 mt-1">
                Your custom room design has been saved to your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="16" y2="12" />
                  <line x1="12" x2="12.01" y1="8" y2="8" />
                </svg>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Saving keeps your current surface finish (<strong>{productTitle}</strong>) in your project workspace for easy sharing and quotation.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Save Design
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SaveAuthModal;
