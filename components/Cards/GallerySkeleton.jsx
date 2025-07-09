
const GallerySkeleton = () => (
    <div className="mb-[32px] px-[12px] sm:px-[20px] md:px-[52px]">
      {/* Header Skeleton */}
      <div className="space-y-2 mb-[8px]">
        <div className="h-8 w-60 bg-gray-300 animate-pulse rounded-md"></div>
        <div className="h-4 w-48 bg-gray-300 animate-pulse rounded-md"></div>
      </div>
  
      {/* Grid Skeleton */}
      <div className="w-full h-[1000px] md:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
        {/* 1 */}
        <div className="col-start-1 col-end-3 row-start-1 row-end-6 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
  
        {/* 2 */}
        <div className="col-start-1 col-end-2 row-start-6 row-span-2 lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
  
        {/* 3 */}
        <div className="col-start-2 col-end-3 row-start-6 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
  
        {/* 4 */}
        <div className="col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
  
        {/* 5 */}
        <div className="col-start-2 col-end-3 row-start-9 row-span-2 lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded-sm"></div>
        </div>
      </div>
    </div>
  );
  
  export default GallerySkeleton;
  