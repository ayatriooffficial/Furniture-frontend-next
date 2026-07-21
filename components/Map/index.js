"use client";
import {
  selectMapDataCoords,
  selectMapDataZoom,
  selectClickedItem,
  setClickedItem,
} from "@/components/Features/Slices/mapSlice";
import {
  Circle,
  GoogleMap,
  Marker,
  OverlayView,
  useLoadScript,
} from "@react-google-maps/api";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { REACT_APP_GMAP_API_KEY } from "./config.js";
import { mapStyles } from "./mapStyles";
import MapMarker from "./MapMarker";
import StoreCard from "./StoreCard";
import Search from "./Search";
import "./styles.css";

// Libraries to load once (must be stable array reference)
const LIBRARIES = ["geometry"];

// Custom overlay wrapper for store circle-photo markers
const CustomMarker = ({ lat, lng, content }) => (
  <OverlayView
    position={{ lat, lng }}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div style={{ position: "absolute", transform: "translate(-50%, -100%)" }}>
      {content}
    </div>
  </OverlayView>
);

const Map = ({
  setBoundaries,
  coords,
  places,
  PlacesData,
  userLocation,
  hasLocationBanner,
}) => {
  const polylineRef = useRef(null); // imperative handle to the single route polyline
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: REACT_APP_GMAP_API_KEY,
    libraries: LIBRARIES,
  });

  const newZoom = useSelector(selectMapDataZoom);
  const newCoords = useSelector(selectMapDataCoords);
  const india_zoom = 5;
  const hotels_zoom = 13;
  const [zoom, setZoom] = useState(india_zoom);
  const [selectedCoords, setSelectedCoords] = useState(coords); // ← FIX: was missing

  const dispatch = useDispatch();

  const handleResultClick = ({ lat, lng }) => {
    if (lat && lng && lat !== null && lng !== null) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      setSelectedCoords({ lat: latitude, lng: longitude });
      if (
        selectedCoords.lat === 20.593 &&
        selectedCoords.lng === 78.96
      ) {
        setZoom(india_zoom);
      } else {
        setZoom(hotels_zoom);
      }
    }
  };

  const onLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);

      // Auto-fit bounds to show ONLY the closest store + user location
      if (PlacesData && PlacesData.length > 0 && window.google?.maps) {
        const bounds = new window.google.maps.LatLngBounds();

        // Add closest store (index 0)
        const closestStore = PlacesData[0];
        if (
          closestStore.geo_location?.latitude != null &&
          closestStore.geo_location?.longitude != null
        ) {
          bounds.extend({
            lat: parseFloat(closestStore.geo_location.latitude),
            lng: parseFloat(closestStore.geo_location.longitude),
          });
        }

        if (userLocation) {
          bounds.extend(userLocation);
        }

        if (!bounds.isEmpty()) {
          // Cinematic fly-in animation
          const targetCenter = bounds.getCenter();
          
          // Start slightly zoomed out, centered on the target
          mapInstance.setZoom(8);
          mapInstance.setCenter(targetCenter);
          
          setTimeout(() => {
            let currentZoom = 8;
            const maxZoom = 13; // Stop animating zoom if it gets too close
            
            const zoomInterval = setInterval(() => {
              if (currentZoom >= maxZoom) {
                clearInterval(zoomInterval);
                // Final snap to exact bounds with padding
                mapInstance.fitBounds(bounds, { top: 100, right: 80, bottom: 120, left: 80 });
              } else {
                currentZoom += 1;
                mapInstance.setZoom(currentZoom);
              }
            }, 150);
          }, 600);
        }
      }
    },
    [PlacesData, userLocation]
  );

  const clickedItem = useSelector(selectClickedItem);

  // ─── CENTRAL ROUTE CONTROLLER ──────────────────────────────────────────────
  // Imperatively manages ONE native google.maps.Polyline via polylineRef.
  // Calling .setMap(null) on the previous ref guarantees the old blue line is
  // DESTROYED before drawing a new one. No React <Polyline> re-mount races.
  useEffect(() => {
    if (!clickedItem || !userLocation || !map) {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      return;
    }
    const lat = clickedItem.geo_location?.latitude;
    const lng = clickedItem.geo_location?.longitude;
    if (!lat || !lng) return;

    // Destroy the old line immediately
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const controller = new AbortController();

    const fetchRoute = async () => {
      try {
        const params = new URLSearchParams({
          originLat: userLocation.lat,
          originLng: userLocation.lng,
          destinationLat: lat,
          destinationLng: lng,
          mode: "DRIVE",
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/directions?${params}`,
          { signal: controller.signal }
        );
        if (!res.ok) return;
        const data = await res.json();
        const encoded = data.route?.polyline;
        if (!encoded) return;

        // Decode polyline
        let path = [];
        if (window.google?.maps?.geometry?.encoding?.decodePath) {
          path = window.google.maps.geometry.encoding.decodePath(encoded);
        } else {
          let idx = 0, dlat = 0, dlng = 0;
          while (idx < encoded.length) {
            let shift = 0, result = 0, b;
            do { b = encoded.charCodeAt(idx++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            dlat += result & 1 ? ~(result >> 1) : result >> 1;
            shift = 0; result = 0;
            do { b = encoded.charCodeAt(idx++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            dlng += result & 1 ? ~(result >> 1) : result >> 1;
            path.push({ lat: dlat / 1e5, lng: dlng / 1e5 });
          }
        }

        if (path.length > 0) {
          const oLat = parseFloat(userLocation.lat);
          const oLng = parseFloat(userLocation.lng);
          const dLat = parseFloat(lat);
          const dLng = parseFloat(lng);
          if (window.google?.maps?.LatLng) {
            path.unshift(new window.google.maps.LatLng(oLat, oLng));
            path.push(new window.google.maps.LatLng(dLat, dLng));
          } else {
            path.unshift({ lat: oLat, lng: oLng });
            path.push({ lat: dLat, lng: dLng });
          }

          // Destroy any previous polyline that arrived after an old request
          if (polylineRef.current) {
            polylineRef.current.setMap(null);
          }
          // Draw the new polyline directly on the map instance
          polylineRef.current = new window.google.maps.Polyline({
            path,
            strokeColor: "#4285F4",
            strokeOpacity: 0.9,
            strokeWeight: 5,
            geodesic: true,
            zIndex: 100,
            map,
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error("Route fetch error:", err);
      }
    };

    fetchRoute();
    return () => {
      controller.abort();
    };
  }, [clickedItem, userLocation, map]);

  // ─── Camera re-framing ────────────────────────────────────────────────────
  useEffect(() => {
    if (!map || !userLocation || !clickedItem || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(userLocation);
    if (clickedItem.geo_location?.latitude && clickedItem.geo_location?.longitude) {
      bounds.extend({
        lat: parseFloat(clickedItem.geo_location.latitude),
        lng: parseFloat(clickedItem.geo_location.longitude),
      });
    }
    if (!bounds.isEmpty()) {
      const currentZoom = map.getZoom() || 13;
      if (currentZoom > 10) map.setZoom(currentZoom - 2);
      map.panTo(bounds.getCenter());
      setTimeout(() => map.fitBounds(bounds, { top: 100, right: 80, bottom: 120, left: 80 }), 500);
    }
  }, [clickedItem, userLocation, map]);

  // Kept for backward-compat (no-ops — routing is now fully imperative)
  const handleRouteDisplay = () => {};
  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  };

  // Build JSON-LD schema per store (guard against missing address)
  const generateStoreSchema = (store) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_WEB_BASE_URL || "https://www.ayatrio.com";
    const addressStr =
      typeof store.address === "string" ? store.address : "";
    const parts = addressStr.split(",");

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/stores/${store._id}/#localbusiness`,
      name: store.name,
      image: store.profileImg || store.images?.[0] || "",
      url: `${baseUrl}/stores/${store._id}`,
      telephone: store.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: parts[0]?.trim() || "",
        addressLocality: parts[1]?.trim() || "Kolkata",
        addressRegion: parts[2]?.trim() || "West Bengal",
        postalCode: store.pincode || "",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: store.geo_location?.latitude,
        longitude: store.geo_location?.longitude,
      },
      parentOrganization: {
        "@type": "Organization",
        name: "Ayatrio",
        "@id": `${baseUrl}/#organization`,
      },
      photos: store.images || [],
    };
  };

  // ─── Error state: Google Maps script failed to load ─────────────────────
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white gap-4 px-6 text-center">
        <div className="text-5xl">🗺️</div>
        <h2 className="text-xl font-semibold text-gray-800">
          Map Failed to Load
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Google Maps couldn't be loaded. Please check your internet connection
          or API key configuration.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <>
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center h-screen bg-white gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-black rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Loading map…</p>
        </div>
      ) : (
        <>
          {/* JSON-LD schema scripts */}
          {PlacesData.map((store) => (
            <script
              key={store._id}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(generateStoreSchema(store)),
              }}
            />
          ))}

          <Search
            places={PlacesData}
            onResultClick={handleResultClick}
          />

          <GoogleMap
            mapContainerClassName={
              hasLocationBanner ? "map-container map-with-banner" : "map-container"
            }
            onLoad={onLoad}
            center={newCoords || coords}
            zoom={newZoom}
            options={{
              styles: mapStyles,
              disableDefaultUI: true,
              zoomControl: false,
              gestureHandling: "greedy",
            }}
          >
            {/* User location marker (blue dot) + search radius circle */}
            {userLocation && (
              <>
                <Marker
                  position={userLocation}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                  }}
                  title="Your location"
                  zIndex={1000}
                />
                <Circle
                  center={userLocation}
                  radius={50000} // 50 km in meters
                  options={{
                    strokeColor: "#4285F4",
                    strokeOpacity: 0.35,
                    strokeWeight: 2,
                    fillColor: "#4285F4",
                    fillOpacity: 0.06,
                    clickable: false,
                  }}
                />
              </>
            )}

            {/* Route is now drawn imperatively via polylineRef — no React <Polyline> needed */}

            {/* Store markers */}
            {PlacesData.map((store, i) => {
              if (
                !store.geo_location?.latitude ||
                !store.geo_location?.longitude
              ) {
                return null;
              }
              return (
                <CustomMarker
                  key={store._id}
                  lat={parseFloat(store.geo_location.latitude)}
                  lng={parseFloat(store.geo_location.longitude)}
                  content={
                    <MapMarker
                      place={store}
                      idx={i}
                      userLocation={userLocation}
                      onRouteDisplay={handleRouteDisplay}
                      onClearRoute={clearRoute}
                      isClosest={i === 0}
                    />
                  }
                />
              );
            })}
          </GoogleMap>

          {/* Horizontal scrollable bottom list of store cards */}
          {PlacesData && PlacesData.length > 0 && (
            <div className="fixed bottom-0 left-0 w-full z-[1000] overflow-x-auto pb-1 pt-10 px-4 custom-scrollbar pointer-events-none">
              <div className="flex gap-4 pointer-events-auto items-stretch">
                {PlacesData.map((store, i) => {
                  const isSelected = clickedItem 
                    ? clickedItem._id === store._id 
                    : i === 0;

                  return (
                    <StoreCard 
                      key={store._id}
                      place={store}
                      userLocation={userLocation}
                      isSelected={isSelected}
                      onClick={() => dispatch(setClickedItem(store))}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Map;
