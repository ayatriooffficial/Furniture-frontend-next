"use client";

import React from "react";
import "./styles.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Label = ({ data }) => {
  const router = useRouter();
  
  const handleTab = () => {
    router.push(`${data?.productLink}`);
  };

  const leftPos = Number(data?.leftPosition) || 50;
  const topPos = Number(data?.topPosition) || 50;

  const showOnRight = leftPos <= 50;
  const showOnBottom = topPos <= 50;

  const horizontalClasses = showOnRight
    ? "lg:left-[34px] lg:right-auto -left-4 right-auto"
    : "lg:right-[34px] lg:left-auto -right-4 left-auto";

  const verticalClasses = showOnBottom
    ? "lg:top-0 lg:bottom-auto top-[40px] bottom-auto"
    : "lg:bottom-0 lg:top-auto bottom-[40px] top-auto";

  return (
    <div className={`absolute z-50 ${horizontalClasses} ${verticalClasses}`} onClick={handleTab}>
      <div
        className={`flex-row z-10 box-container-product w-fit h-auto flex items-center bg-white cursor-pointer`}
      >
        <div className="flex bg-white" style={{ boxShadow: '0 1px 4px rgba(var(--colour-static-black, 17, 17, 17), 0.55)' }}>
          <div className="flex flex-row relative min-w-[148px] w-[148px]">
            <div
              className="flex flex-col basis-3/4 lg:w-28 flex-grow relative m-[12px] "
            >
              <p className="text-[12px] line-clamp-1 mb-[4px]  text-[#0152be] font-semibold">
                Ayatrio Family price
              </p>
              <h2 className="text-[12px] line-clamp-1  font-bold">
                {data?.productTitle}
              </h2>
              <p className="lg:text-[12px] line-clamp-1 text-[#484848]  text-[10px]">
                {data?.productCategory}
              </p>
              <div className="flex items-center gap-1 mt-[8px]">
                <sub className="text-[12px] font-semibold">Rs</sub>
                <p className="text-[24px] font-semibold">{data?.productPrice}</p>
              </div>
            </div>
            <div className="flex  top-16 border-l border-zinc-200">
              <Image loading="lazy"
                className="flex self-center mx-[4px]"
                style={{
                  rotate: "270deg"
                }}
                src="/icons/downarrow.svg"
                height={24}
                width={24}
                alt="arrow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Label;
