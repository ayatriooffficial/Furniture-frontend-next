import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";

import { FreeMode, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Amenities = ({ data }) => {
  const amenities = data.features || [];
  const faqs = data.faqs || [];
  const [categoryDetails, setCategoryDetails] = useState();

  const [showMore, setShowMore] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const [isFaqsOpen, setIsFaqsOpen] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const toggleAmenities = () => {
    setIsAmenitiesOpen(!isAmenitiesOpen);
  };

  const toggleFaqs = () => {
    setIsFaqsOpen(!isFaqsOpen);
  };

  const fetchCategoryDetails = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getCategoryByName/${data?.category}`
    );
    setCategoryDetails(response.data);
  };

  useEffect(() => {
    if (data?.category) {
      fetchCategoryDetails();
    }
  }, [data?.category]);

  const swiper1Ref = useRef(null);

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

  const groupedAmenities = [];
  for (let i = 0; i < amenities?.length; i += 5) {
    groupedAmenities.push(amenities.slice(i, i + 5));
  }

  return (
    <>
      {/* Core Functionality Dropdown */}
      {amenities.length > 0 && (
        <div className="place-offerings border-t-[0.5px] border-b-[0.5px] border-[#f5f5f5] py-[24px]">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleAmenities}
          >
            <div>
              <h3 className="text-[#222222] text-[20px] font-medium">
                Core Functionality
              </h3>
            </div>
            <div className="pr-5">
              <Image
                src="/icons/downarrow.svg"
                alt="Toggle Core Functionality"
                width={20}
                height={20}
                className={`cursor-pointer transform transition-transform duration-300 ${
                  isAmenitiesOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isAmenitiesOpen && (
            <div
              className={`hidden amenities mt-4 md:grid ${
                amenities.length > 5 ? "grid-cols-2" : "grid-cols-1"
              } sm:w-auto`}
            >
              <div className="col-span-1">
                {amenities.slice(0, 5).map((amenity) => (
                  <div
                    key={amenity._id}
                    className="flex items-center pt-[16px]"
                  >
                    <div className="mr-4 w-[30px] h-[30px]">
                      <Image
                        loading="lazy"
                        width={30}
                        height={30}
                        src={amenity.image}
                        alt={amenity.name}
                        className="h-full w-full"
                      />
                    </div>
                    <span className="font-normal text-[16px] text-[#222222]">
                      {amenity.text}
                    </span>
                  </div>
                ))}
              </div>
              {amenities.length > 5 && (
                <div className="col-span-1">
                  {amenities.slice(5).map((amenity) => (
                    <div
                      key={amenity._id}
                      className="flex items-center pt-[16px]"
                    >
                      <div className="mr-4 w-[30px] h-[30px]">
                        <Image
                          loading="lazy"
                          width={30}
                          height={30}
                          src={amenity.image}
                          alt={amenity.name}
                          className="h-full w-full"
                        />
                      </div>
                      <span className="font-normal text-[16px] text-[#222222]">
                        {amenity.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isAmenitiesOpen && (
            <div className="md:hidden overflow-visible h-auto max-h-[300px] w-full mt-2">
              <Swiper
                {...swiperOptions}
                ref={swiper1Ref}
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
                    slidesPerView: 1.1,
                    spaceBetween: 0,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  1024: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                }}
                allowSlideNext={true}
                allowSlidePrev={true}
                slideNextClass="custom-next-button"
                slidePrevClass="custom-prev-button"
                className=""
              >
                {groupedAmenities.map((group, index) => (
                  <SwiperSlide key={index} className="mb-[30px]">
                    {group.map((amenity) => (
                      <div
                        key={amenity._id}
                        className="flex my-4 items-center w-auto"
                      >
                        <div className="w-[30px] h-[30px] mr-4">
                          <Image
                            loading="lazy"
                            width={30}
                            height={30}
                            src={amenity.image}
                            alt={amenity.name}
                            className="h-full w-full"
                          />
                        </div>
                        <span className="font-normal max-w-[200px] text-[16px]">
                          {amenity.text}
                        </span>
                      </div>
                    ))}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      )}

      {/* FAQs Dropdown */}
      {faqs.length > 0 && (
        <div className="place-offerings border-t-[0.5px] border-b-[0.5px] border-[#f5f5f5] py-[24px]">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleFaqs}
          >
            <div>
              <h3 className="text-[#222222] text-[20px] font-medium">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="pr-5">
              <Image
                src="/icons/downarrow.svg"
                alt="Toggle FAQs"
                width={20}
                height={20}
                className={`cursor-pointer transform transition-transform duration-300 ${
                  isFaqsOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isFaqsOpen && (
            <div className="mt-4">
              {faqs.map((faq) => (
                <div key={faq._id} className="mb-4">
                  <h4 className="font-semibold text-[16px] text-[#222222]">
                    {faq.title}
                  </h4>
                  <p className="font-normal text-[14px] text-[#484848] mt-1">
                    {faq.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Amenities;