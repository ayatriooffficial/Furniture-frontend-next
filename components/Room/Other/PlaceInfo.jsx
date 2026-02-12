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

  const groupedCoreValues = groupIntoThrees(coreValuesData);
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
        {
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
        }

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
