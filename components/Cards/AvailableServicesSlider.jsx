"use client";

import { useEffect, useRef } from "react";

const AvailableServicesSlider = ({
  availableServices,
  handleServiceChange,
  selectedServices,
}) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const params = {
      centeredSlides: false,
      spaceBetween: 1,
      navigation: {
        nextEl: ".custom-next-button",
        prevEl: ".custom-prev-button",
      },
      noSwiping: true,
      allowSlidePrev: true,
      allowSlideNext: true,
      mousewheel: {
        forceToAxis: true,
        invert: false,
      },
      freeMode: {
        enabled: false,
        sticky: true,
        momentum: true,
        momentumRatio: 0.5,
        momentumBounceRatio: 0.5,
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);

      swiperRef.current.initialize?.();
    }
  }, [swiperRef, swiperRef.current]);

  return (
    <swiper-container
      init="false"
      ref={swiperRef}
      style={{
        // width: "100%",
        // maxWidth: "768px",
        // marginRight: "auto",
        marginLeft: "0",
      }}
    >
      {availableServices &&
        availableServices.length > 0 &&
        availableServices.map((service, idx) => (
          <swiper-slide key={idx}>
            {/* <div className="w-full">
              <h4 className="font-semibold">{service.name}</h4>
              <p className="text-sm mt-2">{service.cost}</p>

            </div> */}
            {/* checkbox to select */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-sm mt-2">{service.cost}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedServices.includes(service.name)}
                onChange={() => handleServiceChange(service.name)}
              />
            </div>
          </swiper-slide>
        ))}
    </swiper-container>
  );
};

export default AvailableServicesSlider;
