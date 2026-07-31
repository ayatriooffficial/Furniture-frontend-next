import React, { useState, useEffect } from "react";
import Image from "next/image";

const StoreCard = ({ place, userLocation, isSelected, onClick }) => {
  const [actualDistance, setActualDistance] = useState(
    place.distance?.exactRoute ? place.distance.kilometers : null
  );

  useEffect(() => {
    if (place.distance?.exactRoute) {
      setActualDistance(place.distance.kilometers);
      return;
    }

    const fetchDistance = async () => {
      if (!userLocation || !place.geo_location) return;
      try {
        const params = new URLSearchParams({
          originLat: userLocation.lat,
          originLng: userLocation.lng,
          destinationLat: place.geo_location.latitude,
          destinationLng: place.geo_location.longitude,
          mode: "DRIVE",
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?${params}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.route?.distance?.value) {
            const distanceVal = data.route.distance.value / 1000;
            setActualDistance(distanceVal.toFixed(1));
          }
        }
      } catch (err) {
        // Silently fail if route cannot be fetched
      }
    };

    fetchDistance();

    // No cleanup needed since we use a single async fetch now
  }, [userLocation, place]);

  const distanceFromUser = actualDistance || place.distance?.kilometers;

  const primaryImage =
    (place.images && place.images.length > 0 ? place.images[0] : null) ||
    place.profileImg ||
    null;

  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all w-[60vw] sm:w-[260px] ${
        isSelected
          ? "border-2 border-black shadow-xl"
          : "border border-gray-200 shadow-md opacity-90 hover:opacity-100 hover:shadow-lg"
      }`}
      role="button"
      aria-label={`${place.name} store details`}
    >
      {/* Store image */}
      <div className="relative w-full h-[40px] sm:h-[80px] bg-gray-100 flex-shrink-0">
        {primaryImage ? (
          <Image
            loading="lazy"
            src={primaryImage}
            fill
            alt={`${place.name} store`}
            className="object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🏪
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-2.5 pt-1.5 pb-1.5 flex flex-col gap-1 flex-grow">
        {/* Name + distance badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-bold text-gray-900 leading-tight line-clamp-1">
            {place.name}
          </h3>
          {distanceFromUser && (
            <span className="flex-shrink-0 text-[8px] sm:text-[9px] md:text-[11px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-100">
              {distanceFromUser} km
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-[10px] sm:text-[11px] md:text-[12px] text-gray-500 leading-relaxed truncate">
          📍 {place.address}
        </p>

        {/* Phone */}
        <p className="text-[11px] sm:text-[12px] md:text-[13px] text-gray-700 font-medium">
          📞{" "}
          <a
            href={`tel:${place.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-blue-600 transition-colors"
          >
            {place.phone}
          </a>
        </p>
      </div>
    </div>
  );
};

export default StoreCard;
