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
