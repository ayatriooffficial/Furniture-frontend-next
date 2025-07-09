"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  getProfileSuccess,
  selectProfileData,
} from "../Features/Slices/profileSlice";

const ProfileContent = ({ initialData }) => {
  const profileData = useSelector(selectProfileData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData?.length > 0) {
      dispatch(getProfileSuccess(initialData));
    } else {
      dispatch({ type: "FETCH_PROFILE_REQUEST", payload: "Profile" });
    }
  }, [dispatch, initialData]);

  // Helper function to determine if award needs "awards" text appended
  const formatAward = (award) => {
    if (!award) return null;
    
    // If award is a number between 1-1000, append "awards" text
    const awardNum = Number(award);
    if (!isNaN(awardNum) && awardNum >= 1 && awardNum <= 1000) {
      return `${award} awards`;
    }
    
    // If it's text or outside the range, display as is
    return award;
  };

  return (
    <div
      aria-label="Design team profiles carousel"
      data-component="profile-content"
      className="transparent rounded-lg pb-20"
    >
      <Swiper
        className="h-50 lg:h-80"
        mousewheel={{
          forceToAxis: true,
          invert: false,
        }}
        freeMode={{
          enabled: false,
          sticky: true,
        }}
        spaceBetween={20}
        navigation={{
          nextEl: ".vector-one",
          prevEl: ".vector-two",
        }}
        modules={[Navigation]}
        style={{ "--swiper-navigation-size": "24px" }}
        breakpoints={{
          100: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        aria-roledescription="carousel"
        aria-live="polite"
      >
        {profileData.map((person, index) => (
          <SwiperSlide
            className="bg-[#f5f5f5] pr-3"
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${profileData.length}`}
            data-component="profile-slide"
            data-profile-id={person.user?._id}
          >
            <article
              className="flex flex-col items-center"
              data-component="profile-card"
            >
              <div
                className="parent flex flex-col items-center relative bg-black rounded-full md:h-36 h-32 md:w-36 w-32 mb-2 md:mt-8 mt-4"
                role="img"
                aria-label={`Profile image of ${person.user?.displayName}`}
              >
                <Image
                  loading="lazy"
                  src={person.user?.image}
                  alt=""
                  className="rounded-full w-full h-full object-cover"
                  fill
                  style={{ objectFit: "cover" }}
                  aria-hidden="true"
                />
              </div>
              <div className="text-[13px] lg:text-[16px] p-1 flex gap-[5px] items-center font-bold">
                <h3 className="line-clamp-1" data-component="profile-name">
                  {person.user?.displayName}
                </h3>
                {person.user?.links?.linkedin && (
                  <Link
                    href={person.user?.links?.linkedin}
                    className="flex items-center"
                    target="_blank"
                    aria-label={`LinkedIn profile of ${person.user?.displayName}`}
                    data-component="profile-link-linkedin"
                  >
                    <Image
                      loading="lazy"
                      className="sm:h-6 h-6 sm:w-6 w-6"
                      src="/icons/social-icon/linkedln.svg"
                      alt="LinkedIn icon"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
                {person.user?.links?.instagram && (
                  <Link
                    href={person.user?.links?.instagram}
                    className="flex items-center"
                    target="_blank"
                    aria-label={`Instagram profile of ${person.user?.displayName}`}
                    data-component="profile-link-instagram"
                  >
                    <Image
                      loading="lazy"
                      className="sm:h-6 h-6 sm:w-6 w-6"
                      src="/icons/social-icon/instagram.svg"
                      alt="Instagram icon"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
                {person.user?.links?.youtube && (
                  <Link
                    href={person.user?.links?.youtube}
                    className="flex items-center"
                    target="_blank"
                    aria-label={`YouTube profile of ${person.user?.displayName}`}
                    data-component="profile-link-youtube"
                  >
                    <Image
                      loading="lazy"
                      className="sm:h-6 h-6 sm:w-6 w-6"
                      src="/icons/social-icon/youtube.svg"
                      alt="YouTube icon"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
              </div>
              <p
                className="lg:text-[13px] text-[11px] text-center line-clamp-1"
                data-component="profile-role"
              >
                {person.user?.role}
              </p>
              <div
                className="flex flex-col justify-center items-center gap-2 mt-2"
                data-component="profile-badges"
              >
                {person.user?.authorDetails?.experience && (
                  <span
                    className="bg-[#e8e8e8] text-[13px] rounded-full py-[2px] px-[10px] color-[#000] badge badge-award"
                    aria-label={`${person.user?.authorDetails?.experience} years of experience`}
                  >
                    {person.user?.authorDetails?.experience} years of experience
                  </span>
                )}
                {person.user?.authorDetails?.award && (
                  <span
                    className="bg-[#e8e8e8] text-[13px] rounded-full py-[2px] px-[10px] color-[#000] badge badge-award"
                    aria-label={formatAward(person.user?.authorDetails?.award)}
                  >
                    {formatAward(person.user?.authorDetails?.award)}
                  </span>
                )}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="flex flex-row items-end justify-end gap-6 mt-6"
        data-component="profile-navigation"
      >
        <Image
          loading="lazy"
          src="/icons/backarrowhite.svg"
          width={20}
          height={20}
          alt="Previous slide"
          className="vector-two rounded-full h-7 w-7"
        />
        <Image
          loading="lazy"
          src="/icons/rightarro-white.svg"
          width={20}
          height={20}
          alt="Next slide"
          className="vector-one mr-10 rounded-full h-7 w-7"
        />
      </div>
    </div>
  );
};

export default ProfileContent;