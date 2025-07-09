"use client";

function TabWrapperSkeleton() {
  return (
    <div className="mr-[12px] sm:mr-[22px] md:mr-[0px] ml-[12px] sm:ml-[20px] md:ml-[0px] md:px-[52px] pb-20 pt-10 h-full">
      <div className="grid sm:grid-cols-3 grid-cols-2 gap-x-3 gap-y-0">
        {/* First column: 871px height item */}
        <div className="w-full h-[871px] bg-gray-200 animate-pulse"></div>

        {/* Second column: 429px height item */}
        <div className="w-full h-[429px] bg-gray-200 animate-pulse"></div>

        {/* Third column: 871px height item */}
        <div className="w-full h-[871px] bg-gray-200 animate-pulse"></div>

        {/* First column: 429px height item */}
        <div className="w-full h-[429px] bg-gray-200 animate-pulse"></div>

        {/* Second column: 871px height item */}
        <div className="w-full h-[871px] bg-gray-200 animate-pulse"></div>

        {/* Third column: 429px height item */}
        <div className="w-full h-[429px] bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
}

export default TabWrapperSkeleton;
