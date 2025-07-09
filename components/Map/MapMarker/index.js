import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Image from "next/image";
import LottieBackground from "@/components/LottieBackground";
import animationData from "@/components/Animation - 1718097462437.json";
import { useDispatch, useSelector } from "react-redux";
import { selectClickedItem, setClickedItem } from "../../Features/Slices/mapSlice";

const PopupPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const MapMarker = ({ place, idx }) => {
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

  useEffect(() => {
    if (clickedItem?._id === place?._id) {
      handleMarkerClick();
    }
  }, [clickedItem, place]);

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
          <div className="mt-6 custom-popup fixed rounded-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg border w-[270px] mx-auto z-50">
            <button
              className="absolute top-2 right-2 hover:text-gray-800"
              onClick={handleClose}
            >
              X
            </button>
            <div className="flex flex-col rounded-lg">
              <Image
                loading="lazy"
                src={place.images[0]}
                height={100}
                width={200}
                alt="store-image"
                className="w-full rounded-t-lg h-[125px] object-cover"
              />

              <div className="flex flex-col px-2 mt-1">
                <p className="text-[16px] sm:text-[14px] font-semibold">
                  {place.name}
                </p>
                <p className="text-[12px] text-gray-500">
                  {place.address}
                </p>
                <p className="text-gray-600 text-[14px] my-1 font-semibold w-full text-left">
                  {place.phone}
                </p>
              </div>
            </div>
          </div>
        </PopupPortal>
      )}
    </div>
  );
};

export default MapMarker;
