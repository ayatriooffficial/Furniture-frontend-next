"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import "./imagecaresoul.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  selectImages,
  selectProductImages,
} from "../Features/Slices/imageDataSlice";
import { useSelector } from "react-redux";
import Link from "next/link";

/**
 * Resolves dynamic Visualizer action label based on category and subcategory.
 */
const getVisualizerActionLabel = (category = "", subcategory = "", title = "") => {
  const text = `${category || ""} ${subcategory || ""} ${title || ""}`.toLowerCase();

  // 1. Curtains & Blinds -> Window
  if (
    text.includes("curtain") ||
    text.includes("drape") ||
    text.includes("blind") ||
    text.includes("shade") ||
    text.includes("shutter")
  ) {
    return "See on the Window";
  }

  // 2. Flooring, Mats, Rugs, Artificial Grass -> Floor
  if (
    text.includes("floor") ||
    text.includes("carpet") ||
    text.includes("rug") ||
    text.includes("mat") ||
    text.includes("grass") ||
    text.includes("plank") ||
    (text.includes("tile") && !text.includes("wall tile"))
  ) {
    return "See on the Floor";
  }

  // 3. Wallpaper, Wall Decor, Wall Murals -> Wall
  if (
    text.includes("wall") ||
    text.includes("paper") ||
    text.includes("paint") ||
    text.includes("mural")
  ) {
    return "See on the Wall";
  }

  // 4. Upholstery & Furniture Fabrics -> Furniture
  if (
    text.includes("upholster") ||
    text.includes("sofa") ||
    text.includes("chair") ||
    text.includes("fabric")
  ) {
    return "See on Furniture";
  }

  // 5. Home furnishing, Pillows, Cushions, Bedding -> Room
  if (
    text.includes("furnish") ||
    text.includes("pillow") ||
    text.includes("cushion") ||
    text.includes("bed") ||
    text.includes("decor")
  ) {
    return "See in the Room";
  }

  // Default clean fallback
  return "See in Your Room";
};
const Carousel = ({ images: prodImage, data }) => {
  const router = useRouter();
  const productImages = useSelector(selectProductImages);
  // const prodImage = useSelector(selectImages);

  const visualizerLabel = useMemo(() => {
    return getVisualizerActionLabel(data?.category, data?.subcategory, data?.productTitle);
  }, [data?.category, data?.subcategory, data?.productTitle]);

  const handleSeeOnWall = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (data?.category && data?._id) {
      const category = encodeURIComponent(data.category);
      const id = encodeURIComponent(data._id);
      router.push(`/seeonwall?category=${category}&id=${id}`);
    } else {
      router.push("/seeonwall");
    }
  };

  const images = productImages.length > 0 ? productImages[0].images : prodImage;

  const swiperRef = useRef(null);

  useEffect(() => {
    const params = {
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 12,
      navigation: {
        nextEl: ".custom-next-button",
        prevEl: ".custom-prev-button",
      },
      allowSlidePrev: true,
      allowSlideNext: true,
      draggable: true,
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
    };

    if (swiperRef.current) {
      Object.assign(swiperRef.current, params);
      swiperRef.current.initialize?.();
    }
  }, [images, swiperRef]);

  const handlePrevSlide = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    } else if (typeof swiperRef.current?.slidePrev === "function") {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextSlide = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    } else if (typeof swiperRef.current?.slideNext === "function") {
      swiperRef.current.slideNext();
    }
  };

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    try {
      const token = localStorage?.getItem("token");
      if (token) {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        if (data.isAuthenticated) {
          setLoggedInUser(data.user);
        } else {
          setLoggedInUser(null);
        }
      } else {
        setLoggedInUser(null);
      }
    } catch (error) {
      setLoggedInUser(null);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    checkUser();
  }, [data]);

  useEffect(() => {
    if (loggedInUser) {
      const checkProductLiked = loggedInUser.likedProducts.includes(data._id);
      setIsLiked(checkProductLiked);
    }
  }, [loggedInUser]);

  const handleLike = async () => {
    setLoading(true);
    if (loggedInUser && !isLiked) {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/likeProduct`,
        {
          productId: data._id,
          userId: loggedInUser._id,
        }
      );

      if (response.status === 200) {
        setIsLiked(true);
        setTotalLikes(response.data.likes);
      }
    }
    setLoading(false);
  };

  const handleUnlike = async () => {
    setLoading(true);
    if (loggedInUser && isLiked) {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/unlikeProduct`,
        {
          productId: data._id,
          userId: loggedInUser._id,
        }
      );

      if (response.status === 200) {
        setIsLiked(false);
        setTotalLikes(response.data.likes);
      }
    }
    setLoading(false);
  };

  return (
    <section data-citation="product-image-main" itemprop="image" aria-label="product-images-view" className="sm:hidden h-fit">
      <div className="relative aspect-square w-full overflow-hidden">
        {/* <Link
          href={"/login"}
          className="absolute z-10 top-2 right-2 opacity-85 hover:opacity-100 bg-white p-[6px] hover:scale-105 transition-transform rounded-full"
          style={{ boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.12)" }}
        >
          <Image
            loading="lazy"
            src={"/icons/like.svg"}
            height={20}
            width={20}
            className="cursor-pointer"
            alt="like icon"
          />
        </Link> */}
        {loggedInUser ? (
          <div
            className="absolute z-10 top-3 right-4 opacity-85 hover:opacity-100 flex gap-2 bg-white p-[6px]  rounded-full"
            style={{ boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.12)" }}
          >
            {isLiked ? (
              <button disabled={loading} onClick={handleUnlike}>
                <Image
                  loading="lazy"
                  src={"/icons/like-fill.svg"}
                  height={20}
                  width={20}
                  className={`cursor-pointer hover:scale-105 transition-transform`}
                  alt="like icon"
                />
              </button>
            ) : (
              <button disabled={loading} onClick={handleLike}>
                <Image
                  loading="lazy"
                  src={"/icons/like.svg"}
                  height={20}
                  width={20}
                  className={`cursor-pointer hover:scale-105 transition-transform`}
                  alt="like icon"
                />
              </button>
            )}
            {totalLikes || data?.likes}
          </div>
        ) : (
          <Link
            href={"/login"}
            className="absolute z-10 top-3 right-3 bg-opacity-70 hover:opacity-100 blur-[0.2] flex gap-2 bg-white p-[7px] rounded-full"
            style={{ boxShadow: "0 2px 6px 0 rgba(0, 0, 0, 0.12)" }}
          >
            <Image
              loading="lazy"
              src={"/icons/like.svg"}
              height={20}
              width={20}
              className="cursor-pointer  hover:scale-105 transition-transform"
              alt="like icon"
            />

            {totalLikes || data?.likes}
          </Link>
        )}
        <figure className="relative flex h-full w-full items-center justify-center aspect-square thumbnail">
          <swiper-container
            init="false"
            ref={swiperRef}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {images && images.length > 1 ? (
              images?.map((src, idx) => {
                return (
                  <swiper-slide key={idx}>
                    <Image
                      src={src}
                      alt="NA"
                      height={400}
                      width={400}
                      className="aspect-square"
                      data-citation="product-images"
                    />
                  </swiper-slide>
                );
              })
            ) : (
              <div className="h-full w-full aspect-square flex items-center justify-center">
                Loading...
              </div>
            )}
          </swiper-container>
          <span className="flex absolute bottom-[16px]">
            {/* {images?.map((_, idx) => {
              return (
                <button
                  key={idx}
                  className={
                    activeIndex === idx
                      ? "bg-white h-[0.4rem] w-[0.4rem] rounded-[50%] mr-1"
                      : "bg-[#cccc] h-[0.4rem] w-[0.4rem] rounded-[50%] mr-1"
                  }
                  onClick={() => goToSlide(idx)}
                ></button>
              );
            })} */}
          </span>

          {/* SWIPER PREV / NEXT NAVIGATION BUTTONS */}
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous image"
            className="z-50 custom-prev-button absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-90"
          >
            <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next image"
            className="z-50 custom-next-button absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md flex items-center justify-center cursor-pointer transition-all active:scale-90"
          >
            <svg className="w-4 h-4 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* FLOATING BOTTOM-RIGHT DYNAMIC VISUALIZER ACTION BUTTON */}
          <button
            onClick={handleSeeOnWall}
            aria-label={visualizerLabel}
            className="absolute bottom-3 right-3 z-40 flex items-center gap-1.5 bg-white/95 hover:bg-white text-gray-900 px-3.5 py-1.5 rounded-full shadow-md border border-gray-200/90 backdrop-blur-xs font-bold text-xs tracking-tight transition-all active:scale-95 cursor-pointer"
          >
            <Image
              src="/icons/3d.svg"
              alt="3D Visualizer"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span>{visualizerLabel}</span>
          </button>
        </figure>
      </div>
    </section>
  );
};

export default Carousel;
