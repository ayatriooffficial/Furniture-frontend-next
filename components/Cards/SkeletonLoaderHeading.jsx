// components/SkeletonLoaderHeading.js

const SkeletonLoaderHeading = () => {
    return (
      <div className="space-y-2">
      {/* First Line */}
      <div className="h-8 w-60 bg-gray-300 animate-pulse rounded-md"></div>
      {/* Second Line */}
      <div className="h-8 w-48 bg-gray-300 animate-pulse rounded-md"></div>
    </div>
    );
  };
  
  export default SkeletonLoaderHeading;
  