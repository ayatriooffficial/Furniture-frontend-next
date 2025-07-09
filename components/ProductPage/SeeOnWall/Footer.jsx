import React from "react";
import Image from "next/image";

function Footer({ handleCompareClick }) {
  return (
    <div className="w-full flex justify-between overflow-hidden mb-0.5 ">
      {/* Left Arrow */}
      <div className="flex items-center ml-[30px] mb-[30px] ">
        <Image
          src="/icons/uparrow.svg"
          alt="Up Arrow"
          width={25}
          height={25}
        />
      </div>

      {/* Compare Button */}
      <div
        className="flex items-center gap-2 bg-black p-2 rounded-full cursor-pointer"
        onClick={handleCompareClick}
      >
        <Image
          src="/icons/half black half white.svg"
          alt="Compare Icon"
          width={25}
          height={25}
          className="text-white"
        />
        <p className="text-white p-2 py-1">Compare</p>
      </div>

      {/* Customer Service Icon */}
      <div className="h-12 flex items-center justify-center w-12 bg-white rounded-full">
        <Image
          src="/images/customer-service.png"
          alt="Customer Service"
          width={35}
          height={35}
        />
      </div>
    </div>
  );
}

export default Footer;
