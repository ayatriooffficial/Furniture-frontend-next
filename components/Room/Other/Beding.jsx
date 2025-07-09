import React from "react";
const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="presentation"
    focusable="false"
    className="mr-3"
    style={{
      display: "block",
      height: "24px",
      width: "24px",
      fill: "currentcolor",
    }}
  >
    <path d="M24 4a2 2 0 0 1 2 1.85v7.99l1.85 5.54a3 3 0 0 1 .11.46l.03.24.01.24V30h-2v-2H6v2H4v-9.68a3 3 0 0 1 .09-.71l.06-.23L6 13.84V6a2 2 0 0 1 1.7-1.98l.15-.01L8 4zm2 18H6v4h20zm-1.39-6H7.4l-1.34 4h19.9zM24 6H8v8h3v-4a2 2 0 0 1 1.85-2H19a2 2 0 0 1 2 1.85V14h3zm-5 4h-6v4h6z"></path>
  </svg>
);
const SmallBedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="presentation"
    className="mr-3"
    focusable="false"
    style={{
      display: "block",
      height: "24px",
      width: "24px",
      fill: "currentcolor",
    }}
  >
    <path d="M20 8a2 2 0 0 1 2 1.85V12h3.34a2 2 0 0 1 1.77 1.07l.07.14 2.58 6.02a3 3 0 0 1 .23.94l.01.24V28a2 2 0 0 1-1.85 2H4a2 2 0 0 1-2-1.85v-7.74a3 3 0 0 1 .16-.95l.08-.23 2.58-6.02a2 2 0 0 1 1.68-1.2l.16-.01H10v-2a2 2 0 0 1 1.85-2H12zm8 14H4v6h24zm-6-8a2 2 0 0 1-1.85 2H12a2 2 0 0 1-2-1.85V14H6.66l-2.57 6H27.9l-2.57-6zm-2-4h-8v4h8z"></path>
  </svg>
);

const Beding = () => {
  return (
    <div className="bedroom-info py-8">
      <h2 className="my-8 text-xl font-semibold ml-1 flex justify-start">
        Where you'll sleep
      </h2>
      <div className="flex justify-start gap-4 py-3 sm:h-[162px]  sm:flex-row flex-col h-[490px]">
        {/* 1st box */}
        <div className="flex flex-col p-[24px] border rounded-xl sm:w-[204px] sm:h-[185px] h-auto w-[250px]">
          <div className="flex">
            <BedIcon />
            <BedIcon />
          </div>
          <h3 className="text-lg font-semibold pt-5 pb-2">Bedroom 1</h3>
          <span className="text-gray-500 flex-grow font-[0.865rem]">
            2 single beds
          </span>
        </div>
        {/* 2nd box */}
        <div className="flex flex-col p-[24px] border rounded-xl sm:w-[204px] sm:h-[185px] h-auto w-[250px]">
          <div className="flex">
            <BedIcon />
            <SmallBedIcon />
            <SmallBedIcon />
          </div>
          <h3 className="text-lg font-semibold pt-5 pb-2">Bedroom 2</h3>
          <span className="text-gray-500 flex-grow font-[0.865rem]">
            1 double bed, 2 floor mattresses
          </span>
        </div>
        {/* 3rd box */}
        <div className="flex flex-col p-[24px] border rounded-xl sm:w-[204px] sm:h-[185px] h-auto w-[250px]">
          <div className="flex">
            <BedIcon />
            <SmallBedIcon />
            <SmallBedIcon />
          </div>
          <h3 className="text-lg font-semibold pt-5 pb-2">Bedroom 3</h3>
          <span className="text-gray-500 flex-grow font-[0.865rem]">
            1 double bed, 2 floor mattresses
          </span>
        </div>
      </div>
    </div>
  );
};

export default Beding;
