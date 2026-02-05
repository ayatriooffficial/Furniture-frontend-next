// Server Component - Renders static header structure in initial HTML
// Matches real header UI, no API calls, pure HTML

import Link from "next/link";
import Image from "next/image";

export default function StaticHeaderSkeleton() {
  const headerLinks = [
    { label: "Home decor" },
    { label: "Wall decor" },
    { label: "Floor" },
    { label: "Rooms" },
    { label: "Services" },
    { label: "Offers" },
  ];

  return (
    <>
      {/* Top Header - Static and simple */}
      <div className="hidden md:block" suppressHydrationWarning>
        <div className="bg-[#f5f5f5] top-0 fixed h-[35px] z-[9998] w-full flex items-center justify-between px-5">
          <div className="flex items-center">
            <Link
              className="pr-[20px] text-sm underline underline-offset-4"
              href="#"
            >
              For you
            </Link>
            <Link className="text-sm" href="/business-to-business">
              For business
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex flex-row items-center gap-2 text-black text-[12px]">
              <Link href="/virtualexperience" className="flex gap-[5px] items-center">
                <Image
                  src="/icons/liveshopping.svg"
                  width={22}
                  height={22}
                  className="w-[17px] mt-[2px] h-[17px]"
                  alt="liveshopping"
                  priority={false}
                />
                <p>Live Shopping</p>
              </Link>
              <span>|</span>
              <Link href="/freedesign">Designer request</Link>
              <span>|</span>
              <Link href="/login">Join Us</Link>
              <span>|</span>
              <Link href="/customerservice">Help</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Matches real header structure */}
      <div className="fixed w-full bg-white z-[9998] md:top-[35px] top-[0px]">
        <div className="flex flex-row justify-between items-center sm:px-[20px] px-[20px] h-[60px] border-b-[0.5px] border-[#f5f5f5]">
          
          {/* Logo */}
          <div className="flex mainlogo items-center mr-20 justify-start">
            <Link href="/">
              <div className="w-36 h-10 bg-gray-200 rounded animate-pulse" />
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="flex justify-center items-center gap-1 md:gap-5 flex-1">
            <nav className="hidden md:flex gap-0">
              {headerLinks.map((value, idx) => (
                <div key={idx} className="px-[12px]">
                  <p className="block py-[15px] px-[5px] border-b-2 border-transparent text-md font-semibold text-gray-800 cursor-pointer hover:border-black transition-colors">
                    {value.label}
                  </p>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex flex-row items-center justify-between lg:gap-2">
            
            {/* Search Bar - Hidden on mobile */}
            <div className="bg-[#f5f5f5] items-center justify-end rounded-full w-[13rem] h-10 p-[9px] hover:bg-[#e5e5e5] cursor-pointer lg:flex hidden">
              <div className="ml-7 self-center lg:text-[13px] text-[12px] mt-0.5 text-gray-600 animate-pulse">
                Search...
              </div>
            </div>

            {/* Wishlist Icon */}
            <div className="sm:block hidden w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer">
              <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
            </div>

            {/* Cart & Profile */}
            <div className="flex items-center flex-row-reverse lg:flex-row gap-2">
              
              {/* Cart Icon */}
              <div className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer">
                <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
              </div>

              {/* Profile Icon */}
              <div className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer">
                <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
              </div>

              {/* Mobile Menu Icon */}
              <div className="w-10 h-10 p-[9px] hover:bg-zinc-100 hover:rounded-full cursor-pointer md:hidden">
                <div className="w-5 h-5 bg-gray-300 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
