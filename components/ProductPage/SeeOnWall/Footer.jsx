import React from "react";
import Image from "next/image";

function Footer({ handleCompareClick }) {
  return (
    <div className="w-full flex justify-center sm:justify-between items-center px-4 sm:px-6 py-3 sm:py-0 gap-2 sm:gap-4 pb-[env(safe-area-inset-bottom)]">
      {/* Left Arrow — desktop only */}
      <div className="hidden sm:flex items-center ml-0 sm:ml-[30px] mb-0 sm:mb-[30px] flex-shrink-0">
        <Image
          src="/icons/uparrow.svg"
          alt="Up Arrow"
          width={25}
          height={25}
        />
      </div>

      {/* Compare Button — desktop only */}
      <div
        className="hidden sm:flex items-center gap-2 bg-black p-2.5 sm:p-2 rounded-full cursor-pointer flex-shrink-0"
        onClick={handleCompareClick}
      >
        <Image
          src="/icons/half black half white.svg"
          alt="Compare Icon"
          width={25}
          height={25}
          className="text-white"
        />
        <span className="text-white p-2 py-1">Compare</span>
      </div>

      {/* Customer Service / Live Help pill — visible on all sizes */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.open("https://wa.me/916291531025", "_blank", "noreferrer");
          }
        }}
        className="flex items-center gap-2 bg-black text-white rounded-full pl-2 pr-3 sm:pr-4 py-1.5 sm:py-2 shadow-lg flex-shrink-0"
        aria-label="Chat with customer support on WhatsApp"
      >
        <span className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-[#FFD209] rounded-full overflow-hidden">
          <Image
            src="/images/charters-customer-care.avif"
            alt="Customer Service"
            width={40}
            height={40}
            className="rounded-full"
          />
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[13px] sm:text-sm font-semibold">Live Help</span>
          <span className="text-[10px] sm:text-xs text-gray-300">Chat now</span>
        </span>
      </button>
    </div>
  );
}

export default Footer;
