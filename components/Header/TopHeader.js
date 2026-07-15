import React from "react";
import Link from "next/link";
import Image from "next/image";
import { NavLink } from "./NavLink";

const TopHeader = () => {
  return (
    <div className="hidden md:block" suppressHydrationWarning>
      <div
        className={`bg-[#f5f5f5] top-0 fixed h-[35px] z-[9998] w-full flex items-center justify-between px-5`}
      >
        <div className="flex items-center">
          <NavLink
            suppressHydrationWarning
            className="pr-[20px] text-sm"
            href="/"
          >
            For you
          </NavLink>
          <NavLink className="text-sm" href="/business-to-business">
            For business
          </NavLink>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center text-[10.5px] lg:text-[12px] font-medium text-black whitespace-nowrap">
         <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
         </svg>
         <span>91+ 9007404292   <span className="hidden lg:inline"> Shop and get up to Rs.50k back on orders</span></span>
       </div>

        <div className="flex items-center">
          <div className="flex flex-row items-center gap-2  text-black  text-[12px]">
            <Link
              href="/virtualexperience"
              className="flex gap-[5px] items-center"
            >
              <Image
                loading="lazy"
                src={"/icons/liveshopping.svg"}
                width={22}
                height={22}
                className="w-[17px] mt-[2px] h-[17px]"
                alt="liveshopping"
              />
              <p>Live Shopping</p>
            </Link>
            <span className="">|</span>
            <div className="pr-[1px]">
              <Link href="/freedesign">Designer request</Link>
            </div>
            <span className="">|</span>
            <div className="pr-[1px]">
              <Link href="/login">Join Us</Link>
            </div>
            <span className="">|</span>
            <div>
              <Link href="/customerservice">Help</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
