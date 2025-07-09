function AsideboxSkeleton({innerData}) {
    return (
        <div className="absolute top-[2.7rem] lg:p-4 bg-white flex flex-col mt-[15px] md:flex-row noto-sans-200 transition-all duration-300 ease-linear w-full md:left-0 min-h-[90%] lg:min-h-[20rem] md:h-auto md:px-10 border-t border-solid border-[#f5f5f5]">
          <aside className="w-full md:w-[20%] md:sticky md:top-0 h-full overflow-y-auto py-4 px-2 pr-2">
            <div className="lg:flex flex-col flex items-start w-full lg:text-[14px] text-[18px] font-semibold p-2 pt-0 mb-2 gap-4">
              <div className="h-[20px] w-48 bg-gray-100 "></div>
              <div className="h-[20px] w-48 bg-gray-100 "></div>
              <div className="h-[20px] w-48 bg-gray-100 "></div>
            </div>
          </aside>
          <div className="inline-block h-full w-[0.5px] self-stretch bg-[#454647]"></div>
          <div
            className={`${
              innerData ? "block" : "hidden"
            } md:block absolute   md:h-auto md:w-[80%] md:static w-full  z-[99]`}
          >
            <main className="w-full noto-sans-200 h-full border-l px-4 border-solid border-[#f5f5f5]">
              <div className="lg:text-[14px] text-[18px] py-2 px-4 mb-2 font-semibold w-32 bg-gray-100 "></div>
              <div className="grid grid-cols-2 gap-3 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
                <div className="flex flex-row gap-1 lg:gap-4 p-2 items-center cursor-pointer hover:bg-[#f5f5f5]  min-w-[200px]">
                  <div className="w-[50px] h-[50px] bg-gray-100"></div>
                  <div className="h-[20px] w-40  bg-gray-100 text-[14px] font-normal text-[#111111] lg:justify-start "></div>
                </div>
              </div>
            </main>
          </div>
        </div>
    )
}

export default AsideboxSkeleton
