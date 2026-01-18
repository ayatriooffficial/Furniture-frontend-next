import Image from "next/image";
import { useRef, useState } from "react";


import { FreeMode, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import fixImageUrl from "@/utils/modifyUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { CORE_VALUES } from "@/constants/coreValues";
import { FEATURES } from "@/constants/features";
import {
  smartConvertCoreValues,
  smartConvertFeatures,
} from "@/utils/convertIdsToData";

const groupIntoThrees = (items) => {
  const groupedItems = [];
  for (let i = 0; i < items?.length; i += 3) {
    groupedItems.push(items.slice(i, i + 3));
  }
  return groupedItems;
};

const PlaceInfo = (data) => {
  const swiper2Ref = useRef(null);

  const coreValuesData = data?.data?.coreValueIds
    ? smartConvertCoreValues(data.data.coreValueIds, CORE_VALUES)
    : smartConvertCoreValues(data?.data?.coreValues, CORE_VALUES);

  
  const featuresData = data?.data?.featureIds
    ? smartConvertFeatures(data.data.featureIds, FEATURES)
    : smartConvertFeatures(data?.data?.features, FEATURES);

  const swiperOptions = {
    centeredSlides: false,
    spaceBetween: 1,
    modules: [Pagination, Scrollbar, Mousewheel, FreeMode],
    navigation: {
      nextEl: ".custom-next-button",
      prevEl: ".custom-prev-button",
    },
    noSwiping: true,
    allowSlidePrev: true,
    allowSlideNext: true,
  };

  const groupedCoreValues = groupIntoThrees(data?.data?.coreValues);
  //
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleFeaturesDropdown = () => {
    setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen);
  };

  return (
    <div className="place-info">
      <>
        {coreValuesData && coreValuesData.length > 0 ? (
          <section
            className="core-values-section"
            aria-labelledby="core-values-heading"
          >
            <div className="flex justify-between">
              <h2
                id="core-values-heading"
                className="text-[#222222] text-[20px] font-medium"
              >
                Core Values
              </h2>
              <button
                className="pr-5"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-controls="core-values-content"
                aria-label={
                  isDropdownOpen ? "Collapse core values" : "Expand core values"
                }
              >
                <Image
                  src="/icons/downarrow.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* desktop dropdown */}
            {isDropdownOpen && (
              <div
                id="core-values-content"
                className={`place-features mt-7 hidden md:grid ${
                  coreValuesData.length > 6 ? "grid-cols-2 gap-4" : ""
                }`}
                aria-live="polite"
              >
                {coreValuesData.length > 0 &&
                  coreValuesData.map((item, index) => (
                    <article
                      className="hosted-by flex flex-start items-center pb-4 font-lg"
                      key={index}
                    >
                      <figure className="mr-4 w-[30px] h-[30px]">
                        <img
                          className="w-full h-full"
                          src={fixImageUrl(item.image)}
                          alt=""
                          aria-hidden="true"
                        />
                      </figure>
                      <div>
                        <h4 className="font-medium text-[16px] mb-[4px]">
                          {item.heading}
                        </h4>
                        <p className="md:w-[100%] font-normal text-[14px text-[#6A6A6A] line-clamp-1">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            )}

            {/* mobile dropdown */}
            {isDropdownOpen && (
              <div
                className="md:hidden overflow-visible h-auto mt-7 max-h-[300px] w-full mb-4"
                aria-live="polite"
              >
                <Swiper
                  ref={swiper2Ref}
                  {...swiperOptions}
                  scrollbar={{
                    hide: false,
                    draggable: true,
                  }}
                  mousewheel={{
                    forceToAxis: true,
                    invert: false,
                  }}
                  freeMode={{
                    enabled: true,
                    sticky: true,
                  }}
                  breakpoints={{
                    300: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 1.1,
                      spaceBetween: 10,
                    },
                  }}
                  allowSlideNext={true}
                  allowSlidePrev={true}
                  slideNextClass="custom-next-button"
                  slidePrevClass="custom-prev-button"
                  className="px-10"
                  a11y={{
                    enabled: true,
                    prevSlideMessage: "Previous core values",
                    nextSlideMessage: "Next core values",
                  }}
                >
                  {groupedCoreValues.map((group, groupIndex) => (
                    <SwiperSlide key={groupIndex} className="min-h-[210px]">
                      {group.map((item, index) => (
                        <article
                          className="hosted-by gap-3 flex flex-start items-center pb-4 font-lg"
                          key={index}
                        >
                          <figure className="mr-4 w-[30px] h-[30px]">
                            <img
                              className="w-full min-w-[30px] min-h-[30px]"
                              src={fixImageUrl(item.image)}
                              alt=""
                              aria-hidden="true"
                            />
                          </figure>
                          <div>
                            <h4 className="font-medium text-[16px] mb-1">
                              {item.heading}
                            </h4>
                            <span className="text-[#6A6A6A] text-[14px]">
                              {item.text}
                            </span>
                          </div>
                        </article>
                      ))}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </section>
        ) : (
          <section
            className="place-features sm:w-auto"
            aria-label="Place features"
          >
            <div className="hosted-by flex flex-start py-4 border-b font-lg">
              <figure className="mr-4">
                <img
                  className="w-[40px] h-[40px]"
                  src="https://a0.muscache.com/im/pictures/user/User-507131869/original/ab3b1e39-25e1-4e68-ad8d-a881b097af35.jpeg?im_w=240"
                  alt="Host Nikita"
                />
              </figure>
              <div>
                <h4 className="font-semibold">Hosted by Nikita</h4>
                <span className="mt-1 text-gray-500">8 months hosting</span>
              </div>
            </div>
            <div className="workspace flex items-center py-4 font-lg">
              <figure className="mr-4">
                <svg
                  className="w-[24px] h-[24px] block text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <path d="M26 2a1 1 0 0 1 .92.61l.04.12 2 7a1 1 0 0 1-.85 1.26L28 11h-3v5h6v2h-2v13h-2v-2.54a3.98 3.98 0 0 1-1.73.53L25 29H7a3.98 3.98 0 0 1-2-.54V31H3V18H1v-2h5v-4a1 1 0 0 1 .88-1h.36L6.09 8.4l1.82-.8L9.43 11H12a1 1 0 0 1 1 .88V16h10v-5h-3a1 1 0 0 1-.99-1.16l.03-.11 2-7a1 1 0 0 1 .84-.72L22 2h4zm1 16H5v7a2 2 0 0 0 1.7 1.98l.15.01L7 27h18a2 2 0 0 0 2-1.85V18zm-16-5H8v3h3v-3zm14.24-9h-2.49l-1.43 5h5.35l-1.43-5z"></path>
                </svg>
              </figure>
              <div>
                <h4 className="font-semibold">Dedicated workspace</h4>
                <span className="mt-1 text-gray-500">
                  A room with wifi that's well suited for working.
                </span>
              </div>
            </div>
            <div className="dine-in flex items-center pt-2 pb-8 border-b font-lg">
              <figure className="mr-4">
                <svg
                  className="w-[24px] h-[24px] block text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                >
                  <path d="M24 26c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 28c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 28c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 26c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 26zm0-5c.99 0 1.95.35 2.67 1 .3.29.71.45 1.14.5H28v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 23c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 23c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.97 3.97 0 0 1 16 21c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5A3.98 3.98 0 0 1 24 21zM20 3a4 4 0 0 1 4 3.8V9h4v2h-4v5a4 4 0 0 1 2.5.86l.17.15c.3.27.71.44 1.14.48l.19.01v2h-.23a3.96 3.96 0 0 1-2.44-1A1.98 1.98 0 0 0 24 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 16 18c-.5 0-.98.17-1.33.5a3.98 3.98 0 0 1-2.67 1 3.98 3.98 0 0 1-2.67-1A1.98 1.98 0 0 0 8 18c-.5 0-.98.17-1.33.5a3.96 3.96 0 0 1-2.44 1H4v-2h.19a1.95 1.95 0 0 0 1.14-.5A3.98 3.98 0 0 1 8 16c.99 0 1.95.35 2.67 1 .35.33.83.5 1.33.5.5 0 .98-.17 1.33-.5a3.96 3.96 0 0 1 2.44-1H16v-5H4V9h12V7a2 2 0 0 0-4-.15V7h-2a4 4 0 0 1 7-2.65A3.98 3.98 0 0 1 20 3zm-2 13.52.46.31.21.18c.35.31.83.49 1.33.49a2 2 0 0 0 1.2-.38l.13-.11c.2-.19.43-.35.67-.49V11h-4zM20 5a2 2 0 0 0-2 1.85V9h4V7a2 2 0 0 0-2-2z"></path>
                </svg>
              </figure>
              <div>
                <h4 className="font-semibold">Dive right in</h4>
                <span className="mt-1 text-gray-500">
                  This is one of the few places in the area with a pool.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ✅ CORE FUNCTIONALITY SECTION */}
        {featuresData && featuresData.length > 0 && (
          <section
            className="core-functionality-section mt-8"
            aria-labelledby="core-functionality-heading"
          >
            <div className="flex justify-between">
              <h2
                id="core-functionality-heading"
                className="text-[#222222] text-[20px] font-medium"
              >
                Core Functionality
              </h2>
              <button
                className="pr-5"
                onClick={toggleFeaturesDropdown}
                aria-expanded={isFeaturesDropdownOpen}
                aria-controls="core-functionality-content"
                aria-label={
                  isFeaturesDropdownOpen
                    ? "Collapse core functionality"
                    : "Expand core functionality"
                }
              >
                <Image
                  src="/icons/downarrow.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* desktop dropdown */}
            {isFeaturesDropdownOpen && (
              <div
                id="core-functionality-content"
                className={`place-features mt-7 hidden md:grid ${
                  featuresData.length > 6 ? "grid-cols-2 gap-4" : ""
                }`}
                aria-live="polite"
              >
                {featuresData.map((item, index) => (
                  <article
                    className="hosted-by flex flex-start items-center pb-4 font-lg"
                    key={index}
                  >
                    <figure className="mr-4 w-[30px] h-[30px]">
                      <img
                        className="w-full h-full"
                        src={fixImageUrl(item.icon)}
                        alt=""
                        aria-hidden="true"
                      />
                    </figure>
                    <div>
                      <h4 className="font-medium text-[16px] mb-[4px]">
                        {item.title}
                      </h4>
                      <p className="md:w-[100%] font-normal text-[14px] text-[#6A6A6A] line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}

           
            {isFeaturesDropdownOpen && (
              <div
                className="md:hidden overflow-visible h-auto mt-7 max-h-[300px] w-full mb-4"
                aria-live="polite"
              >
                <Swiper
                  {...swiperOptions}
                  scrollbar={{
                    hide: false,
                    draggable: true,
                  }}
                  mousewheel={{
                    forceToAxis: true,
                    invert: false,
                  }}
                  freeMode={{
                    enabled: true,
                    sticky: true,
                  }}
                  breakpoints={{
                    300: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 1.1,
                      spaceBetween: 10,
                    },
                  }}
                  allowSlideNext={true}
                  allowSlidePrev={true}
                  className="px-10"
                  a11y={{
                    enabled: true,
                    prevSlideMessage: "Previous core functionality",
                    nextSlideMessage: "Next core functionality",
                  }}
                >
                  {groupIntoThrees(featuresData).map((group, groupIndex) => (
                    <SwiperSlide key={groupIndex} className="min-h-[210px]">
                      {group.map((item, index) => (
                        <article
                          className="hosted-by gap-3 flex flex-start items-center pb-4 font-lg"
                          key={index}
                        >
                          <figure className="mr-4 w-[30px] h-[30px]">
                            <img
                              className="w-full min-w-[30px] min-h-[30px]"
                              src={fixImageUrl(item.icon)}
                              alt=""
                              aria-hidden="true"
                            />
                          </figure>
                          <div>
                            <h4 className="font-medium text-[16px] mb-1">
                              {item.title}
                            </h4>
                            <span className="text-[#6A6A6A] text-[14px]">
                              {item.description}
                            </span>
                          </div>
                        </article>
                      ))}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </section>
        )}

        {isDropdownOpen && (
          <div className="flex flex-col gap-2">
            <p className="text-[#484848] text-xs font-normal">Pattern Number</p>
            <div className="flex">
              <p
                className="bg-black px-4 py-1 text-white text-xs font-bold min-w-min"
                aria-label="Pattern number"
              >
                {data?.data?.patternNumber}
              </p>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default PlaceInfo;
