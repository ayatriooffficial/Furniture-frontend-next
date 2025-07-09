"use client"; 
import React from 'react';

const CardSkeleton = () => {
  return (
    <div
      className="card pb-12 h-[700px]"
    >
      {/* Top Labels */}
      <div className="relative">

        {/* Image Placeholder */}
        <div className="relative flex h-full w-full items-center justify-center aspect-square bg-[#f1f1f1] animate-pulse">
        </div>
      </div>
      {/* Card Content */}
      <div className="mt-4 h-full">
        <div className="h-4 w-3/4 bg-[#f1f1f1] animate-pulse my-2 "></div>
        <div className="h-4 w-2/4 bg-[#f1f1f1] animate-pulse my-2 "></div>
       <div className="h-4 w-2/5 bg-[#f1f1f1] animate-pulse my-2 "></div>
      </div>
    </div>
  );
};

export default CardSkeleton;

// import React from 'react';

// const CardSkeleton = () => {
//   return (
//     <div
//       className="card pb-12 h-[700px]"
//       style={{ width: '100%', height: '100%' }}
//     >
//       {/* Top Labels */}
//       <div className="relative">
//         <div className="absolute top-2 left-2 z-10 flex gap-2">
//           <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
//           <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         {/* Image Placeholder */}
//         <div className="relative flex h-full w-full items-center justify-center aspect-square bg-gray-200 animate-pulse">
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="mt-4">
//         {/* Title and Urgency */}
//         <div className="flex flex-col">
//           <div className="h-4 w-24 bg-gray-200 animate-pulse mb-2 rounded"></div>
//           <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         {/* Short Description */}
//         <div className="h-4 w-64 bg-gray-200 animate-pulse my-2 rounded"></div>

//         {/* Price Section */}
//         <div className="flex items-center gap-2 mt-4">
//           <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
//           <div className="h-4 w-10 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         {/* Regular Price */}
//         <div className="h-4 w-40 bg-gray-200 animate-pulse mt-2 rounded"></div>

//         {/* Ratings Section */}
//         <div className="flex items-center mt-2 gap-2">
//           <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
//           <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         {/* Actions Section */}
//         <div className="flex gap-4 items-center mt-4">
//           <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
//           <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
//         </div>

//         {/* Delivery Info */}
//         <div className="mt-4">
//           <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
//           <div className="h-4 w-32 bg-gray-200 animate-pulse mt-1 rounded"></div>
//         </div>

//         {/* Color Options */}
//         <div className="flex gap-2 mt-4">
//           <div className="h-10 w-10 animate-pulse rounded"></div>
//           <div className="h-10 w-10 animate-pulse rounded"></div>
//           <div className="h-10 w-10 animate-pulse rounded"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardSkeleton;