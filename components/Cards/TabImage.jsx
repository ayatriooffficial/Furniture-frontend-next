"use client";

import React, { useEffect, useState } from "react";
import "./tabs.css";
import Image from "next/image";
import Label from "../Label/Label";
import Link from "next/link";
import fixImageUrl from "@/utils/modifyUrl";

const TabImage = ({
  src,
  alt,
  width,
  height,
  handleTab,
  labelData,
  href,
  firstData,
  hovered,
  showTitleOverlay = true,
}) => {
  const circledData = Array.isArray(labelData) ? labelData : [labelData];

  // console.log("labelData", labelData);
  // console.log({ circledData });

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }

    if (windowWidth > 600 && firstData) {
      setOpenData((prev) => {
        const next = [...prev];
        next[0] = true;
        return next;
      });
    } else {
      setOpenData((prev) => {
        const next = [...prev];
        next[0] = false;
        return next;
      });
    }

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const [openData, setOpenData] = useState(new Array(circledData.length).fill(false));

  return (
    <div className="child w-full h-full relative overflow-hidden">
      {src && (
        // Check if src is a valid value before rendering the image
        href ? (
          <Link href={href} className="h-full w-full ">
            <Image
              loading="lazy"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              src={fixImageUrl(src)}
              alt={alt}
              width={width}
              height={height}
            />
          </Link>
        ) : (
          <Image
            loading="lazy"
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            src={fixImageUrl(src)}
            alt={alt}
            width={width}
            height={height}
          />
        )
      )}

      {/* Only render this section if the image exists */}
      <div className="cursor-pointer">
        {circledData.map((data, idx) => {
          // console.log(data?.status);
          if (data?.status === "Active") {
            return (
              <div
                key={idx}
                onClick={() => {
                  setOpenData((prev) => {
                    const next = [...prev];
                    next[idx] = !next[idx];
                    return next;
                  });
                }}
                style={{
                  boxShadow: `0 1px 4px rgba(var(--colour-static-black, 17, 17, 17), 0.55)`,
                  top: `${data?.topPosition}%`,
                  left: `${data?.leftPosition}%`,
                }}
                className={`border-2 border-neutral-300 bg-black/40 hover:border-white absolute hover:bg-black/70 rounded-full size-[30px] flex items-center justify-center transition-all duration-200 before:content-[''] before:size-3 before:bg-white before:rounded-full before:hover:size-2 before:transition-all before:duration-200`}
              >
                {openData[idx] ? <Label data={data} /> : null}
              </div>
            );
          }

          if (data?.status === "ActiveWithData") {
            return (
              <div
                key={idx}
                onClick={() => {
                  setOpenData((prev) => {
                    const next = [...prev];
                    next[idx] = !next[idx];
                    return next;
                  });
                }}
                style={{
                  boxShadow: `0 1px 4px rgba(var(--colour-static-black, 17, 17, 17), 0.55)`,
                  top: `${data?.topPosition}%`,
                  left: `${data?.leftPosition}%`,
                }}
                className={`border-2 border-neutral-300 bg-black/40 hover:border-white absolute hover:bg-black/70 rounded-full size-[30px] flex items-center justify-center transition-all duration-200 before:content-[''] before:size-3 before:bg-white before:rounded-full before:hover:size-2 before:transition-all before:duration-200`}
              >
                <Label data={data} />
              </div>
            );
          }

          if (data?.status === "Inactive" && hovered) {
            return (
              <div
                key={idx}
                onClick={() => {
                  setOpenData((prev) => {
                    const next = [...prev];
                    next[idx] = !next[idx];
                    return next;
                  });
                }}
                style={{
                  boxShadow: `0 1px 4px rgba(var(--colour-static-black, 17, 17, 17), 0.55)`,
                  top: `${data?.topPosition}%`,
                  left: `${data?.leftPosition}%`,
                }}
                className={`border-2 border-neutral-300 bg-black/40 hover:border-white absolute hover:bg-black/70 rounded-full size-[30px] flex items-center justify-center transition-all duration-200 before:content-[''] before:size-3 before:bg-white before:rounded-full before:hover:size-2 before:transition-all before:duration-200`}
              >
                {openData[idx] ? <Label data={data} /> : null}
              </div>
            );
          }

          if (data?.status === undefined) {
            return (
              <div
                key={idx}
                onClick={() => {
                  setOpenData((prev) => {
                    const next = [...prev];
                    next[idx] = !next[idx];
                    return next;
                  });
                }}
                style={{
                  boxShadow: `0 1px 4px rgba(var(--colour-static-black, 17, 17, 17), 0.55)`,
                  top: `${data?.topPosition}%`,
                  left: `${data?.leftPosition}%`,
                }}
                className={`border-2 border-neutral-300 bg-black/40 hover:border-white absolute hover:bg-black/70 rounded-full size-[30px] flex items-center justify-center transition-all duration-200 before:content-[''] before:size-3 before:bg-white before:rounded-full before:hover:size-2 before:transition-all before:duration-200`}
              >
                {openData[idx] ? <Label data={data} /> : null}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Product Title Overlay with Smooth Scrim Gradient */}
      {showTitleOverlay && (labelData?.productTitle || circledData[0]?.productTitle) && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end z-30">
          {/* Smooth ease-out bottom scrim gradient */}
          <div className="absolute inset-x-0 bottom-0 h-44 sm:h-48 md:h-56 max-h-[80%] bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

          {/* Text and Icon Container */}
          <div className="relative z-10 p-3.5 sm:p-4 md:p-5 pointer-events-auto">
            {href ? (
              <Link href={href} className="flex items-center justify-between group cursor-pointer gap-2">
                <h3 className="text-white font-bold group-hover:underline text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2">
                  {labelData?.productTitle || circledData[0]?.productTitle}
                </h3>
                <svg 
                  viewBox="0 0 25 25" 
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0 text-white fill-current transition-transform duration-300 group-hover:translate-x-1 md:group-hover:translate-x-1.5"
                >
                  <path fill="white" d="M11.1,17.9l-1-1l4.4-4.4L9.9,8.1l1.1-1.1l5.5,5.6L11.1,17.9z"/>
                </svg>
              </Link>
            ) : (
              <div className="flex items-center justify-between group cursor-pointer gap-2">
                <h3 className="text-white font-bold group-hover:underline text-sm sm:text-base md:text-lg lg:text-xl line-clamp-2">
                  {labelData?.productTitle || circledData[0]?.productTitle}
                </h3>
                <svg 
                  viewBox="0 0 25 25" 
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 shrink-0 text-white fill-current transition-transform duration-300 group-hover:translate-x-1 md:group-hover:translate-x-1.5"
                >
                  <path fill="white" d="M11.1,17.9l-1-1l4.4-4.4L9.9,8.1l1.1-1.1l5.5,5.6L11.1,17.9z"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabImage;
