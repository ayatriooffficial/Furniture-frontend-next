import React from "react";

const HeaderInfo = () => {
  return (
    <div className="hidden">
      {" "}
      <div className="flex py-4  ">
        <div className="room-info-wrapper mr-4">
          <div className="priceInfo">
            <span className="font-bold mr-1 text-black">₹11,897 </span>
            <span className="font-normal text-sm text-gray-500">night</span>
          </div>
          <div className="ratingInfo text-sm">
            <span className="font-semibold mr-1 text-black"> 4.78</span>
            <span className="ml-1 font-normal text-sm text-gray-500">
              9 reviews
            </span>
          </div>
        </div>
        <button
          type="button"
          className="change-dates mr-5 inline-flex items-center gap-x-4 font-semibold rounded-lg border border-transparent "
        >
          Change dates
        </button>
      </div>
    </div>
  );
};

export default HeaderInfo;
