"use client";
import React, { useRef } from "react";
import Image from "next/image";

const DEFAULT_SHOWROOMS = [
  {
    id: "washroom",
    title: "Luxury Bathroom",
    category: "Bathroom",
    image: "/3d/washroom.webp",
    thumbnail: "/3d/washroom.webp",
  },
  {
    id: "kitchen",
    title: "Contemporary Kitchen",
    category: "Dining / Kitchen",
    image: "/3d/kitchen.webp",
    thumbnail: "/3d/kitchen.webp",
  },
  {
    id: "bedroom1",
    title: "Serene Master Bedroom",
    category: "Bedroom",
    image: "/3d/bedroom1.webp",
    thumbnail: "/3d/bedroom1.webp",
  },
  {
    id: "livingroom2",
    title: "Modern Living Room",
    category: "Living Room",
    image: "/3d/livingroom2.webp",
    thumbnail: "/3d/livingroom2.webp",
  },
  {
    id: "livingroom",
    title: "Classic Living Room",
    category: "Living Room",
    image: "/3d/livingroom.webp",
    thumbnail: "/3d/livingroom.webp",
  },
];

function ShowroomGallery({
  isOpen,
  onClose,
  activeRoomImage,
  onSelectRoom,
  userUploadedRooms = [],
  onUploadRoom,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl && onUploadRoom) {
          onUploadRoom({
            id: `upload-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            image: dataUrl,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-white overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-end pb-3 border-b border-gray-200">
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Image src="/icons/cancel.svg" alt="Close" width={16} height={16} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-5 space-y-6">
        {/* SECTION 1: Upload Your Room Card */}
        <div className="border border-gray-200 bg-gray-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {/* Blue Camera Icon from public */}
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <Image
              src="/icons/camera.svg"
              alt="Camera"
              width={26}
              height={26}
              className="text-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#0058a3] hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full shadow-xs transition-all cursor-pointer"
          >
            Upload Your Room
          </button>
          <p className="text-[11px] text-gray-500 mt-2">
            JPG or PNG up to 10MB
          </p>
        </div>

        {/* SECTION 2: Your Uploaded Images */}
        {userUploadedRooms.length > 0 && (
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
              Your Uploaded Images ({userUploadedRooms.length}/10)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
              {userUploadedRooms.map((room) => {
                const isSelected = activeRoomImage === room.image;
                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      onSelectRoom(room.image, room.title);
                      onClose();
                    }}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-600/30"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative">
                      <img
                        src={room.image}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center">
                          <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xs font-bold leading-none">✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Curated Showrooms (2-Column Grid on Mobile matching Lowe's) */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
            Showrooms
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 pb-12">
            {DEFAULT_SHOWROOMS.map((showroom) => {
              const isSelected = activeRoomImage === showroom.image;
              return (
                <div
                  key={showroom.id}
                  onClick={() => {
                    onSelectRoom(showroom.image, showroom.title);
                    onClose();
                  }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-600/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative">
                    <img
                      src={showroom.image}
                      alt={showroom.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Selected Checkmark Badge matching Lowe's */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/95 text-gray-900 rounded-full flex items-center justify-center shadow-md border border-gray-200">
                          <span className="text-xs font-extrabold leading-none">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowroomGallery;
