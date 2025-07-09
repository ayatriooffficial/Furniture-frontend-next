"use client";
import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { selecteddbItems, setDbItems } from "../Features/Slices/cartSlice";

function Card(props) {
  const dispatch = useDispatch();
    const imagesToUse = props.imgSrc?.length > 0
  ? props.images || props.imgSrc
  : props.productImages?.[0]?.images || [];
     


  function renderStars(averageRating) {
    const maxStars = 5;
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;
  
    const starsArray = [];
    for (let i = 0; i < fullStars; i++) {
      starsArray.push(
        <img
          key={i}
          src={"/icons/star full black.svg"}
          height={20}
          width={20}
          alt="star"
          className="h-[1em] w-[1em] hover:text-gray-600"
        />
      );
    }

    if (halfStar === 1) {
      starsArray.push(
        <img
          key={fullStars}
          src={"/icons/half black half white.svg"}
          height={20}
          width={20}
          alt="half-star"
          className="h-[1em] w-[1em] hover:text-gray-600"
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      starsArray.push(
        <img
          key={fullStars + halfStar + i}
          src={"/icons/star full white.svg"}
          height={20}
          width={20}
          alt="empty-star"
          className="h-[1em] w-[1em] hover:text-gray-600"
        />
      );
    }

    return starsArray;
  }
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchReviews();
    const stars = renderStars(3.6);
    setStars(stars);
  }, [props.id]);

  const [slide, setSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setSlide(slide === props.imgSrc.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? props.imgSrc.length - 1 : slide - 1);
  };

  const imageData = props.productImages?.map((item) => {
    return {
      color: item.color,
      image: item.images[0] || "/fallback-image.jpg",
    };
  });

  const colors = props.productImages?.map((item) => item.color) || [];
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const productImages = props.productImages;

  const [colorImage, setColorImage] = useState("");

  const [isNavigationHovered, setIsNavigationHovered] = useState(false);

  const [Reviews, setReviews] = useState([]);
  const [Stars, setStars] = useState();

  const fetchReviews = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getReview?productId=${props.id}`
      );

      setReviews(response.data);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoader(false);
    }
  };

  function renderStars(averageRating) {
    const maxStars = 5;
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = maxStars - fullStars - halfStar;

    const starsArray = [];
    for (let i = 0; i < fullStars; i++) {
      starsArray.push(
        <img
          key={i}
          src={"/icons/star full black.svg"}
          height={15}
          width={15}
          alt="star"
          className=" mr-[2px]  hover:text-gray-600"
        />
      );
    }

    if (halfStar === 1) {
      starsArray.push(
        <img
          key={fullStars}
          src={"/icons/half black half white.svg"}
          height={15}
          width={15}
          alt="half-star"
          className=" mr-[2px] hover:text-gray-600"
        />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      starsArray.push(
        <img
          key={fullStars + halfStar + i}
          src={"/icons/star full white.svg"}
          height={15}
          width={15}
          alt="empty-star"
          className=" mr-[2px]  hover:text-gray-600"
        />
      );
    }

    return starsArray;
  }

  useEffect(() => {
    fetchReviews();
  }, [props.id]);

  function calculateAverageRating(reviews) {
    if (reviews.length > 0) {
      const totalRatings = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRatings / reviews.length;
      return averageRating;
    }

    return 0;
  }

  const [inCart, setInCart] = useState(props?.inCart);

  useEffect(() => {
    const averageRating = calculateAverageRating(Reviews);
    const stars = renderStars(averageRating);
    setStars(stars);
  }, [Reviews]);

  const cartData = useSelector(selecteddbItems);

  const addProductToCart = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
      {
        deviceId: localStorage.getItem("deviceId"),
        productId: props.id,
        quantity: 1,
      }
    );
    if (response.status === 200) {
      setInCart(true);
      dispatch(setDbItems(response.data));
    }
  };

  useEffect(() => {
    setInCart(props.inCart);
  }, [props.inCart]);

  useEffect(() => {
    if (imageData?.length > 0) {
      setColorImage(imageData[0]?.image);
    }
  }, []);


  const getExpectedDeliveryDate = (expectedDelivery) => {
    const today = new Date();
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + expectedDelivery);
    return expectedDate.toDateString();
  };

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("token");
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
  }, [props._id]);

  useEffect(() => {
    if (loggedInUser) {
      const checkProductLiked = loggedInUser.likedProducts.includes(props.id);
      setIsLiked(checkProductLiked);
    }
  }, [loggedInUser]);

  const handleLike = async () => {
    setLoading(true);
    if (loggedInUser && !isLiked) {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/likeProduct`,
        {
          productId: props.id,
          userId: loggedInUser._id,
        }
      );

      if (response.status === 200) {
        setIsLiked(true);
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
          productId: props.id,
          userId: loggedInUser._id,
        }
      );

      if (response.status === 200) {
        setIsLiked(false);
      }
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const splitPeriod = (startDate, endDate, chunkSize) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = [];

    while (start <= end) {
      const chunkEnd = new Date(start);
      chunkEnd.setDate(start.getDate() + chunkSize - 1);
      result.push({
        from: new Date(start),
        to:
          chunkEnd <= end
            ? new Date(chunkEnd.setHours(23, 59, 59, 999))
            : new Date(end.setHours(23, 59, 59, 999)),
      });
      start.setDate(start.getDate() + chunkSize);
      start.setHours(0, 0, 0, 0);
    }
    return result;
  };

  const [currentPeriod, setCurrentPeriod] = useState(null);

  useEffect(() => {
    const currentDate = new Date();
    const startDate =
      props.specialPrice?.startDate || props.discountedprice?.startDate;
    const endDate =
      props.specialPrice?.endDate || props.discountedprice?.endDate;
    const chunkSize =
      props.specialPrice?.chunkSize || props.discountedprice?.chunkSize;

    const fetchAndSplitPeriod = async () => {
      const splitPeriods = splitPeriod(startDate, endDate, chunkSize);
      const periodWithCurrentDate = splitPeriods.find((period) => {
        const from = new Date(period.from);
        const to = new Date(period.to);
        return currentDate >= from && currentDate <= to;
      });
      setCurrentPeriod(periodWithCurrentDate);
    };

    if (chunkSize) {
      fetchAndSplitPeriod();
    } else {
      setCurrentPeriod({ from: startDate, to: endDate });
    }
  }, []);

  return (
    <div
      itemScope
      itemType="https://schema.org/Product"
      key={props.cardkey}
      className="card pb-12 "
      style={{
        width: "100%",
        height: "100%",
      }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className={`relative`}>
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          
  {props.demandtype && (
 
    <p className="text-[12px] text-black font-normal bg-white py-[.1rem] px-[.5rem] cursor-pointer hover:underline">
      {props.demandtype}
    </p>

)}

{props.offer && (
       <p className="text-[12px] text-[#C31952] font-normal bg-white py-[.1rem] px-[.5rem] cursor-pointer hover:underline">
      {props.offer}
    </p>
  
)}
        </div>

        <div
          className="relative flex h-full w-full items-center justify-center cursor-pointer aspect-square bg-[#f5f5f5]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && slide !== 0 && (
            <Image
              onMouseEnter={() => setIsNavigationHovered(true)}
              onMouseLeave={() => setIsNavigationHovered(false)}
              loading="lazy"
              src="/icons/backarrowhite.svg"
              height={20}
              width={20}
              alt="arrow"
              onClick={prevSlide}
              className="arrow arrow-left hover:opacity-[1.0] hover:scale-105"
            />
          )}

          
            {imagesToUse.map((img, idx) => (
  <Link
    href={`/${props.title.replace(/ /g, "-")}/${props.productId}`}
    key={idx}
    aria-label={`View details about ${props.title}`}
  >
    <Image
      loading={idx === 0 ? "eager" : "lazy"}
      src={isHovered && !isNavigationHovered && imagesToUse.length > 1
        ? imagesToUse[1]
        : imagesToUse[idx]}
      alt={`Image of ${props.title}`}
      fill 
      sizes="(min-width: 768px) 33vw, 100vw"
      className={slide === idx
        ? "aspect-square"
        : "slide-hidden"}
      itemProp="image"  
    />
  </Link>
))}

       

          {isHovered && (
            <Image
              onMouseEnter={() => setIsNavigationHovered(true)}
              onMouseLeave={() => setIsNavigationHovered(false)}
              src="/icons/rightarro-white.svg"
              height={30}
              width={30}
              alt="arrow"
              onClick={nextSlide}
              className="arrow arrow-right hover:opacity-1"
            />
          )}

          <span className="flex items-center absolute bottom-[16px]">
            {props.imgSrc?.map((_, idx) => (
              <div
                key={idx}
                className={`h-[0.4rem] w-[0.4rem] rounded-[50%] mr-1 ${slide === idx ? "bg-white" : "bg-[#cccc]"
                  }`}
              ></div>
            ))}
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between pt-2 b">
          <div className="flex flex-col">
            {props.urgency && (
              <p aria-label="Special offer" className="font-semibold tracking-wide text-[#0152be]  mb-[3px] text-[12px]">
                {props.urgency}
              </p>
            )}
            <h3 id="products-title" itemProp="name" className="text-[15px] font-semibold">{props.title}</h3>
          </div>
        </div>
        <p itemProp="description" className="font-normal mb-1 text-[14px] py-[2px] text-[#484848] hide-on-mobile">
          {props?.shortDescription}
        </p>

        <div className=" flex h-[40px]  items-center justify-between mt-2 ">
          {props.productType === "normal" || props.productType === "special" ? (
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex gap-1 items-end">
              <p
                itemProp="price" itemprop="priceCurrency"className={`text-3xl flex font-bold leading-[0.5] tracking-wide ${props.specialPrice?.price
                    ? "bg-[#FFD209] px-2 pt-3 pb-1 w-fit shadow-lg"
                    : ""
                  }`}
                style={
                  props?.specialPrice?.price
                    ? { boxShadow: "3px 3px #C31952" }
                    : {}
                }
              >
                <span
                  className={`text-sm ${props?.specialPrice?.price ? "" : "pt-3.5"
                    }`}
                >
                  Rs.  
                </span>{" "}
                {props?.specialPrice?.price ? (
                  Math.floor(props?.specialPrice?.price)
                ) : (
                  <p className="pt-3">
                    {props?.discountedprice?.price
                      ? Math.floor(props?.discountedprice?.price)
                      : Math.floor(props?.price)}
                  </p>
                )}
              </p>
              {props.unitType ? (
                <span className="tracking-wide text-sm font-semibold">{`/${props.unitType}`}</span>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex gap-1 items-end">Request Now</div>
          )}
        </div>

        {(props?.specialPrice?.price || props?.discountedprice?.price) && (
          <div className="flex flex-col mb-3">
            <p className="text-[#484848] text-[12px] pt-[3px]">
              Regular price:{" "}
              <span className="font-bold text-black">
                Rs.{" "}
                <span className="line-through  text-base">{Math.floor(props?.price)}</span>
              </span>{" "}
              (incl. of all taxes)
            </p>

            {currentPeriod && (
              <p className="text-[#484848] text-[12px] hide-on-mobile">
                Price valid {formatDate(currentPeriod?.from)} -{" "}
                {formatDate(currentPeriod?.to)}
              </p>
            )}
          </div>
        )}

        {Stars && (
          <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="flex items-center mt-1 hide-on-mobile">
            {Stars}
            <p itemProp="ratingValue" className="text-[14px] mt-1 ml-2">({Reviews?.length})</p>
          </div>
        )}

        <div className="flex my-2 items-center gap-2 hide-on-mobile">
          <div
            className="bg-[#0152be] hover:bg-[#0049ab] p-2 mr-2 rounded-full"
            onClick={addProductToCart}
          >
            <Image
              loading="lazy"
              src={"/icons/adtocart plush.svg"}
              height={25}
              width={25}
              alt="add to cart icon"
              className="cursor-pointer rounded-full"
              itemProp="image"
            />
          </div>

          <div  className="bg-[#fff] border border-solid border-[#efefef] hover:bg-[#f5f5f5] p-2 mr-2 rounded-full">

          {loggedInUser ? (
            <div className="flex items-center">
              {isLiked ? (
                <button disabled={loading} onClick={handleUnlike}>
                  <Image
                    loading="lazy"
                    src={"/icons/like-fill.svg"}
                    height={25}
                    width={25}
                    className={`cursor-pointer  hover:scale-105 transition-transform`}
                    alt="like icon"
                    itemProp="image"
                  />
                </button>
              ) : (
                <button disabled={loading} onClick={handleLike}>
                  <Image
                    loading="lazy"
                    src={"/icons/like.svg"}
                    height={25}
                    width={25}
                    className={`cursor-pointer hover:scale-105 transition-transform`}
                    alt="like icon"
                    itemProp="image"
                  />
                </button>
              )}
            </div>
          ) : (
            <Link href={"/login"}>
              <Image
                loading="lazy"
                src={"/icons/like.svg"}
                height={25}
                width={25}
                className="cursor-pointer  hover:scale-105 transition-transform"
                alt="like icon"
                itemProp="image"
              />
            </Link>
          )}
        </div></div>

        {props.expectedDelivery && (
          <div className="flex flex-col items-start mt-2">
            <div className="flex items-center">
              {props.expectedDelivery <= 5 && (
                <img
                  alt="speedDelivery"
                  loading="lazy"
                  src={"/icons/speeddelivery.svg"}
                  height={25}
                  width={25}
                />
              )}
            </div>
            <p className="text-[#484848] text-[12px] mt-2">
              Expected delivery on  
              <span className="text-[#0152be] font-md font-semibold">
                {getExpectedDeliveryDate(props.expectedDelivery)}
              </span>
            </p>
          </div>
        )}

        {imageData?.length > 1 && (
          <div className="colorContainer flex flex-col sm:w-auto w-[80vw] mt-1">
            <div className="w-full flex justify-between mb-1">
              <p className="text-[12px] font-normal text-[#757575]">
                More options
              </p>
            </div>
            <div className=" flex gap-1.5">
              {imageData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedColor(item.color)}
                  className={`relative w-[40px] h-[40px] text-center flex justify-center items-center cursor-pointer
            ${selectedColor === item.color ? "border-black" : "border-black"}
          `}
                >
                  <Image
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.color}
                    fill
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                    itemProp="image"
                  />
                  {selectedColor === item.color ? (
                    <div className="w-full h-[2px] bg-black mt-[50px]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;