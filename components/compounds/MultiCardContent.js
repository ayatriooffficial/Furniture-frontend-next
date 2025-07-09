import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./../Imagechanger/styles.css";

const MultiCardContent = (props) => {
  const { iconPath, iconSize, title, text } = props;
  return (
    <div className="bg-white flex flex-col justify-between h-full p-3">
      {/* <div className="mt-8 ml-6">
        <Image loading="lazy" src={iconPath} width={iconSize} height={iconSize} alt="image" />
    
      <h2 className="text-[28px] text-[#333333] font-bold ml-6 mr-12">{title}</h2>
      <div className="mt-2 ml-6 mr-12 text-[17px] font-normal mb-12">{text}</div>

      <div className="absolute bottom-1 right-4 mb-8">
        <Image loading="lazy"
          className="w-10 h-10"
          src="/icons/add-circle.svg"
          width={0}
          height={0}
          alt="add"
        />
      </div> */}
      <div className="flex-grow flex flex-col xl:pt-[32px] pt-[24px] pl-[18px] lg:pl-[24px] xl:pl-[32px] pr-[18px] lg:pr-[24px] xl:pr-[77px]">
        <div className="h-[56px]">
          <Image loading="lazy" src={iconPath} width={iconSize} height={iconSize} alt={title} />
        </div>
        <h3 className="sm:text-[14px] md:text-[18px] lg:text-[22px] text-[#333333] font-semibold mb-[10px]">{title}</h3>
        <div className="text-[14px] lg:text-[15px] font-normal">{text}</div>
      </div>
      <div className="ml-[24px] mb-[24px] max-w-fit bg-[#333336] rounded-full mt-10">
        <Image loading="lazy" className="min-w-[25px] min-h-[25px] p-1 m-2" src="/icons/top_arrow-white.svg" width={0} height={0} alt="Add icon" />
      </div>
    </div>
  );
};

MultiCardContent.propTypes = {
  iconPath: PropTypes.string,
  iconSize: PropTypes.number,
  title: PropTypes.string,
  text: PropTypes.string,
  addIconSize: PropTypes.number,
};

MultiCardContent.defaultProps = {
  iconPath: PropTypes.string,
  iconSize: 52,
  title: "title",
  text: "text",
  addIconSize: 34,
};

export default MultiCardContent;
