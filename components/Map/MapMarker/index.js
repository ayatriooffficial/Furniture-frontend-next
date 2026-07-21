import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Image from "next/image";
import LottieBackground from "@/components/LottieBackground";
import animationData from "@/components/Animation - 1718097462437.json";
import { useDispatch, useSelector } from "react-redux";
import { selectClickedItem, setClickedItem } from "../../Features/Slices/mapSlice";
import { formatDistance } from "@/utils/calculateDistance";
import { openGoogleMapsDirections } from "@/services/googlePlacesService";

const PopupPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const MapMarker = ({ place, idx, userLocation }) => {
  const clickedItem = useSelector(selectClickedItem);
  const dispatch = useDispatch();

  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleMarkerClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  const handleClose = () => {
    setPopupOpen(false);
    dispatch(setClickedItem(null));
  };

  const handleDirections = () => {
    if (place.geometry && place.geometry.location) {
      openGoogleMapsDirections(
        place.geometry.location.lat,
        place.geometry.location.lng,
        place.name
      );
    }
  };

  useEffect(() => {
    if (clickedItem?._id === place?._id) {
      handleMarkerClick();
    }
  }, [clickedItem, place]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="marker-container gmap-marker">
      <div className="marker-info" onClick={handleMarkerClick}>
        <div className="info-wrapper wrapper" style={{ position: 'relative' }}>
          {idx === 5 && <LottieBackground animationData={animationData} />}
          
          <div
            className="info-image"
            style={{
              backgroundImage: `url(${place.profileImg || place.images[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              position: 'relative',
              boxShadow: idx === 5 && "0 0 0 6px #000000",
            }}
          >
            <div
              className="marker-tail"
              style={{
                position: 'absolute',
                bottom: '-18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '20px solid #000000',
              }}
            />
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <PopupPortal>
          <div className="mt-6 custom-popup fixed rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg border w-[300px] mx-auto z-50">
            <button
              className="absolute top-2 right-2 hover:text-gray-800 text-gray-500 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={handleClose}
            >
              ×
            </button>
            <div className="flex flex-col rounded-lg">
              <Image
                loading="lazy"
                src={place.images[0]}
                height={100}
                width={200}
                alt="store-image"
                className="w-full rounded-t-lg h-[140px] object-cover"
              />

              <div className="flex flex-col px-3 mt-3 pb-3">
                <p className="text-[16px] sm:text-[14px] font-semibold text-gray-800">
                  {place.name}
                </p>
                
                {/* Rating */}
                {place.rating > 0 && (
                  <div className="flex items-center mt-1">
                    <div className="flex text-sm">
                      {renderStars(place.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {place.rating.toFixed(1)} ({place.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Distance */}
                {place.distance !== undefined && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{formatDistance(place.distance)} away</span>
                  </div>
                )}

                <p className="text-[12px] text-gray-500 mt-2 line-clamp-2">
                  {place.address}
                </p>
                
                <p className="text-gray-600 text-[14px] my-2 font-semibold w-full text-left">
                  {place.phone}
                </p>

                {/* Directions Button */}
                <button
                  onClick={handleDirections}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
                  </svg>
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </PopupPortal>
      )}
    </div>
  );
};

export default MapMarker;
