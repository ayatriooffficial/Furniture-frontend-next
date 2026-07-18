// components/mainmap/MapPage.jsx
"use client";
import Map from "@/components/Map/index";
import SaveUserCoordinates from "@/utils/SaveUserCoordinates";
import axios from "axios";
import { LocalBusinessJsonLd } from "next-seo";
import { useCallback, useEffect, useState } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────
const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const NEARBY_LIMIT = 3;
const MAX_DISTANCE_METERS = 50000; // 50 km
const GEO_TIMEOUT_MS = 15000;

const MapPage = () => {
  const [places, setPlaces] = useState([]);
  const [coords, setCoords] = useState(INDIA_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [boundaries, setBoundaries] = useState(null);
  const [storeMapData, setStoreMapData] = useState([]);

  // State machine: "loading" | "soft_prompt" | "permission_denied" | "unavailable" | "timeout"
  //                | "api_error" | "no_stores" | "success"
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [locationErrorType, setLocationErrorType] = useState(null); // "PERMISSION_DENIED" | "UNAVAILABLE" | "TIMEOUT"

  // ─── Fetch nearby stores by coordinates ──────────────────────────────────
  const fetchNearbyStores = useCallback(async (lat, lng) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nearbyStores`,
      {
        params: {
          latitude: lat,
          longitude: lng,
          maxDistance: MAX_DISTANCE_METERS,
          limit: NEARBY_LIMIT,
        },
      }
    );
    return res.data;
  }, []);

  // ─── Fetch all stores (fallback when location unavailable) ────────────────
  const fetchAllStores = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mapPlaces`
    );
    return res.data;
  }, []);

  // ─── Fetch Location and Stores ──────────────────────────────────────────
  const fetchLocationAndStores = useCallback(() => {
    let geoTimeoutId = null;
    setStatus("loading");

    const onGeoSuccess = async (position) => {
      clearTimeout(geoTimeoutId);
      const { latitude, longitude } = position.coords;
      const userLoc = { lat: latitude, lng: longitude };

      try {
        const stores = await fetchNearbyStores(latitude, longitude);
        if (!stores || stores.length === 0) {
          setStatus("no_stores");
          return;
        }
        setStoreMapData(stores);
        setPlaces(stores);
        setUserLocation(userLoc);
        setCoords(userLoc);
        setStatus("success");
      } catch (err) {
        console.error("Error fetching nearby stores:", err);
        if (err.response?.status === 404) {
          try {
            const allStores = await fetchAllStores();
            if (!allStores || allStores.length === 0) {
              setStatus("no_stores");
              return;
            }
            setStoreMapData(allStores);
            setPlaces(allStores);
            setUserLocation(userLoc);
            setCoords(userLoc);
            setStatus("success");
          } catch (fallbackErr) {
            setStatus("api_error");
            setErrorMessage(fallbackErr.response?.data?.message || "Failed to load store data.");
          }
        } else {
          setStatus("api_error");
          setErrorMessage(err.response?.data?.message || "Failed to load nearby stores.");
        }
      }
    };

    const onGeoError = async (geoError) => {
      clearTimeout(geoTimeoutId);
      console.error("Geolocation error:", geoError);
      let errType = "PERMISSION_DENIED";
      if (geoError.code === geoError.PERMISSION_DENIED) errType = "PERMISSION_DENIED";
      else if (geoError.code === geoError.POSITION_UNAVAILABLE) errType = "UNAVAILABLE";
      else if (geoError.code === geoError.TIMEOUT) errType = "TIMEOUT";

      setLocationErrorType(errType);
      setStatus("permission_denied");

      try {
        const allStores = await fetchAllStores();
        if (allStores && allStores.length > 0) {
          setStoreMapData(allStores);
          setPlaces(allStores);
        }
      } catch (err) {
        console.error("Fallback store fetch failed:", err);
      }
    };

    if (!navigator.geolocation) {
      setLocationErrorType("UNAVAILABLE");
      setStatus("permission_denied");
      fetchAllStores()
        .then((stores) => {
          setStoreMapData(stores || []);
          setPlaces(stores || []);
        })
        .catch(() => setStatus("api_error"));
      return;
    }

    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
      enableHighAccuracy: true,
      timeout: GEO_TIMEOUT_MS,
      maximumAge: 60000,
    });

    geoTimeoutId = setTimeout(() => {
      setLocationErrorType("TIMEOUT");
      setStatus("permission_denied");
      fetchAllStores()
        .then((stores) => {
          setStoreMapData(stores || []);
          setPlaces(stores || []);
        })
        .catch(() => {});
    }, GEO_TIMEOUT_MS + 2000);
  }, [fetchNearbyStores, fetchAllStores]);

  // ─── Initial mount ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchLocationAndStores();
  }, [fetchLocationAndStores]);

  const handleAllowLocation = () => fetchLocationAndStores();

  const handleNotNow = async () => {
    setStatus("loading");
    try {
      const allStores = await fetchAllStores();
      if (!allStores || allStores.length === 0) {
        setStatus("no_stores");
        return;
      }
      setStoreMapData(allStores);
      setPlaces(allStores);
      setStatus("success");
    } catch (err) {
      setStatus("api_error");
      setErrorMessage("Failed to load stores.");
    }
  };

  // ─── Retry handler ────────────────────────────────────────────────────────
  const handleRetry = () => {
    setStatus("loading");
    setErrorMessage("");
    setStoreMapData([]);
    setPlaces([]);
    setUserLocation(null);
    setLocationErrorType(null);
  };



  // ─── Render: Full-screen loading ──────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-black rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 text-sm font-medium tracking-wide">
          Finding nearby Ayatrio stores…
        </p>
      </div>
    );
  }

  // ─── Render: API error ────────────────────────────────────────────────────
  if (status === "api_error") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white gap-6 px-6 text-center">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800">
          Unable to Load Stores
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">{errorMessage}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── Render: No stores in DB ──────────────────────────────────────────────
  if (status === "no_stores") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white gap-6 px-6 text-center">
        <div className="text-5xl">🏪</div>
        <h2 className="text-xl font-semibold text-gray-800">
          No Stores Found Nearby
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          We couldn't find any Ayatrio stores within 50 km of your location.
          Check back soon as we're expanding!
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── Render: Location permission denied / unavailable ────────────────────
  const locationBannerMessages = {
    PERMISSION_DENIED: {
      icon: "📍",
      title: "Location Access Denied",
      desc: "Enable location permissions in your browser settings for the best experience. Showing all stores below.",
    },
    UNAVAILABLE: {
      icon: "📡",
      title: "Location Unavailable",
      desc: "We couldn't determine your location. Showing all stores below.",
    },
    TIMEOUT: {
      icon: "⏱️",
      title: "Location Timed Out",
      desc: "Getting your location took too long. Showing all stores below.",
    },
  };

  const locationBanner =
    status === "permission_denied" && locationErrorType
      ? locationBannerMessages[locationErrorType]
      : null;

  // ─── Render: Map (success or permission_denied with fallback stores) ───────
  return (
    <>
      <SaveUserCoordinates />

      {/* Location permission banner */}
      {locationBanner && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{locationBanner.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {locationBanner.title}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">{locationBanner.desc}</p>
          </div>
          <button
            onClick={() => setLocationErrorType(null)}
            className="text-amber-500 hover:text-amber-700 flex-shrink-0 text-lg leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* JSON-LD Schema for each store */}
      {storeMapData.map((store) => {
        const addressParts = (store.address || "").split(", ");
        return (
          <LocalBusinessJsonLd
            key={store._id}
            type="HomeGoodsStore"
            id={`${process.env.NEXT_PUBLIC_WEB_BASE_URL || "https://www.ayatrio.com"}/store/${store._id}`}
            name={store.name}
            description={`Ayatrio ${store.name} offering ${
              store.category?.join(", ") || "home furnishings"
            }`}
            url={`${process.env.NEXT_PUBLIC_WEB_BASE_URL || "https://www.ayatrio.com"}/store/${store._id}`}
            telephone={store.phone}
            address={{
              "@type": "PostalAddress",
              streetAddress: addressParts.slice(0, 2).join(", "),
              addressLocality: addressParts[2] || "Kolkata",
              addressRegion: addressParts[3] || "West Bengal",
              postalCode: store.pincode || "700020",
              addressCountry: "India",
            }}
            geo={{
              latitude: store.geo_location?.latitude,
              longitude: store.geo_location?.longitude,
            }}
            images={store.images || []}
            priceRange="$$$"
            sameAs={[
              `${process.env.NEXT_PUBLIC_WEB_BASE_URL || "https://www.ayatrio.com"}/store/${store._id}`,
            ]}
          />
        );
      })}

      <Map
        setBoundaries={setBoundaries}
        coords={coords}
        places={places}
        PlacesData={storeMapData}
        userLocation={userLocation}
        hasLocationBanner={!!locationBanner}
      />
    </>
  );
};

export default MapPage;