// components/SkeletonLoader.js

const SkeletonLoader = () => {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      {[1, 2, 3, 4].map((_, index) => (
        <div
          key={index}
          className="skeleton-loader w-[23%] bg-gray-200 animate-pulse rounded-lg"
        >
          {/* Placeholder for image with increased height */}
          <div className="bg-gray-300 h-60 rounded-lg mb-6"></div>

          {/* Additional content for height */}
          <div className="bg-gray-300 h-6 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-300 h-5 w-1/2 rounded mb-3"></div>
          <div className="bg-gray-300 h-6 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-300 h-5 w-1/2 rounded mb-3"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
