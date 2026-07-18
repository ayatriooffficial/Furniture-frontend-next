import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClickedItem,
  setClickedItem,
} from "../../Features/Slices/mapSlice";
import axios from "axios";


// ─── Decode Google's encoded polyline format ─────────────────────────────────
// Implements the standard polyline decoding algorithm
function decodePolyline(encoded) {
  if (!encoded) return [];
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return points;
}

// ─── Haversine distance (km) ─────────────────────────────────────────────────
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

// ─── MapMarker Component ─────────────────────────────────────────────────────
const MapMarker = ({ place, idx, userLocation, onRouteDisplay, onClearRoute, isClosest }) => {
  const clickedItem = useSelector(selectClickedItem);
  const dispatch = useDispatch();


  const handleMarkerClick = () => {
    // Clicking just triggers the route change by updating global state
    dispatch(setClickedItem(place));
  };

  const handleClose = () => {
    dispatch(setClickedItem(null));
    if (onClearRoute) onClearRoute();
  };

  const openGoogleMaps = () => {
    if (!userLocation) {
      alert("Enable location services to get directions.");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.geo_location.latitude},${place.geo_location.longitude}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const profileImg =
    place.profileImg ||
    (place.images && place.images.length > 0 ? place.images[0] : null) ||
    null;

  // Route fetching is now fully owned by Map/index.js (central controller).
  // This marker only needs to dispatch setClickedItem to trigger it.

  // For the closest store, auto-select it on mount so the parent fetches its route
  const hasAutoFetchedRef = React.useRef(false);
  useEffect(() => {
    if (isClosest && userLocation && !hasAutoFetchedRef.current) {
      hasAutoFetchedRef.current = true;
      dispatch(setClickedItem(place)); // triggers central route controller in Map/index.js
    }
  }, [isClosest, userLocation]);

  // No clickedItem useEffect here — removed to prevent multiple concurrent route fetches

  return (
    <div 
      className="marker-container gmap-marker"
      style={{ position: 'relative', zIndex: 1 }}
    >
      {/* ─── Circle photo marker on map ──────────────────────────────── */}
      <div 
        className="marker-info" 
        onClick={handleMarkerClick}
        role="button" 
        aria-label={`View ${place.name}`}
      >
        <div className="info-wrapper wrapper" style={{ position: "relative" }}>
          <div
            className="info-image"
            style={{
              backgroundImage: profileImg ? `url(${profileImg})` : "none",
              backgroundColor: profileImg ? "transparent" : "#e5e7eb",
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              position: "relative",
            }}
          >
            {!profileImg && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                🏪
              </span>
            )}
            <div
              className="marker-tail"
              style={{
                position: "absolute",
                bottom: "-18px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "16px solid #000000",
              }}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default MapMarker;
