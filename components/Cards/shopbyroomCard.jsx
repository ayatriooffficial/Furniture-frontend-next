import React from "react";
import "./styles.css";

import PopUp from "../Reviews/PopUp";
import Image from "next/image";
import Link from "next/link";
import fixImageUrl from "@/utils/modifyUrl";

function ShopByRoomCard(props) {
  // Extract hex code and calculate luminance to determine if the background is dark
  const isDark = () => {
    if (!props.bgColorClass) return false;
    const match = props.bgColorClass.match(/bg-\[#(.*?)\]/);
    if (!match) return false;
    
    let hex = match[1];
    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
      return luminance < 128;
    }
    return false;
  };

  const darkTheme = isDark();

  return (
    <>
      <div key={props.cardkey} className="pb-8 cursor-pointer h-full w-full flex flex-col">
        <Link href={`/${props.id}/rooms`} className="flex flex-col flex-grow h-full w-full">
          <div className="flex w-full aspect-square items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 bg-gray-100">
            {props.imgSrc && (
              <Image
                src={fixImageUrl(props.imgSrc)}
                alt={props.title}
                height={600}
                width={600}
                quality={75}
                className={"aspect-square w-full object-cover hover-zoom"}
              />
            )}
          </div>

          <div className={`${props.bgColorClass} p-8 overflow-hidden ${darkTheme ? "text-white" : "text-black"} flex flex-col flex-grow`}>
            <h2 className="sm:text-[14px] md:text-[16px] lg:text-[20px] font-semibold hover:underline text-ellipsis mb-1">
              {props.title}
            </h2>
            <p
              className={`line-clamp-4 text-sm overflow-hidden text-ellipsis`}
            >
              {props.summary}
            </p>
            <div className="mt-auto pt-[60px] lg:pt-[90px]">
              <div className={`${darkTheme ? "bg-white" : "bg-[#000000]"} rounded-full max-w-fit p-2`}>
                <Image
                  src={darkTheme ? "/icons/top_arrow-black.svg" : "/icons/top_arrow-white.svg"}
                  height={25}
                  width={25}
                  quality={75}
                  className="p-1"
                  alt="arrow icon"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
      {props.isPopupVisible && (
        <PopUp
          isPopupVisible={props.isPopupVisible}
          closePopup={props.closePopup}
        />
      )}
    </>
  );
}

export default ShopByRoomCard;
