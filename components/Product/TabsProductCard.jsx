import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import "./styles.css";
import axios from "axios";
import { setDbItems } from "../Features/Slices/cartSlice";
import { FAQPageJsonLd } from 'next-seo';

function TabsProductCard(props) {
  const faqData = props.faqs.map(faq => ({
    questionName: faq.question,
    acceptedAnswerText: faq.answer
  }));
  const [slide, setSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();

  const [Reviews, setReviews] = useState([]);
  const [Stars, setStars] = useState();

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getReview?productId=${props.id}`
      );
     
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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

  const handleclick = async (title) => {
    
    dispatch({ type: "FETCH_ROOM_REQUEST", payload: title });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  const nextSlide = () => {
    setSlide(slide === props.images.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? props.images.length - 1 : slide - 1);
  };

  const startDate = new Date(props?.specialPrice?.startDate);
  const endDate = new Date(props?.specialPrice?.endDate);

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const [colorImage, setColorImage] = useState("");
  const imageData = props?.text?.productImages?.map((item) => {
    return {
      color: item.color,
      image: item.images[0],
    };
  });

  const handleColor = (imagesrc) => {
    
    setColorImage(imagesrc);
  };

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

  const colors = props.productImages?.map((item) => item.color);
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const productImages = props.productImages;
  const [isNavigationHovered, setIsNavigationHovered] = useState(false);

  useEffect(() => {
    setSelectedColor(colors[0]);
  }, [
    props.productImages,
    props.productImages?.length,
    props.productImages?.[0],
  ]);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
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
      props.specialprice?.startDate || props.discountedprice?.startDate;
    const endDate =
      props.specialprice?.endDate || props.discountedprice?.endDate;
    const chunkSize =
      props.specialprice?.chunkSize || props.discountedprice?.chunkSize;

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
    <>
    {faqData.length > 0 && <FAQPageJsonLd mainEntity={faqData} />}
      <div
        key={props.idx}
        className="flex flex-col  border-b border-r  sm:border-none "
        onClick={() => props.handlenav(props.text._id)}
      >
        <div className="relative z[-999999] w-fit">
          <div
            onClick={(event) => event.stopPropagation()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className={`flex justify-between text-black ${isHovered ? "flex" : "hidden"
              }    checkbox-div absolute top-0 right-0 z-50 ${props.selectedpdt.includes(props.text) ? "visible" : "visible"
              }`}
          >
            <input
              type="checkbox"
              onChange={(e) => {
                props.handleCheckbox(props.text, e.target.checked);
                props.setShowcompare(true);
              }}
              style={{
                border: "2px solid red",
              }}
              checked={props.selectedpdt.includes(props.text)}
              className="accent-black"
            />
          </div>

          <div className="absolute top-2 left-2 z-10 flex gap-2">
            {props.demandtype && (
              <p className="text-[12px] text-black font-normal bg-white py-[.1rem] px-[.5rem]">
                {props.demandtype}
              </p>
            )}
            {props.offer && (
              <p className="text-[12px] text-[#C31952] font-normal bg-white py-[.1rem] px-[.5rem]">
                {props.offer}
              </p>
            )}
          </div>
          <div
            className="relative flex h-full w-full items-center justify-center  aspect-square bg-[#f5f5f5]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
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
                className="arrow arrow-left hover:opacity-100"
              />
            )}
            {selectedColor !== ""
              ? productImages
                .find((item) => item.color === selectedColor)
                ?.images?.map((src, idx) => {
                  return (
                    <Link
                      href={`/${props.productTitle.replace(/ /g, "-")}/${props.productId
                        }`}
                      onClick={() => handleclick(props.productTitle)}
                    >
                      <Image
                        loading="lazy"
                        src={
                          isHovered && !isNavigationHovered
                            ? productImages.find(
                              (item) =>
                                item.color ===
                                colors.find(
                                  (item) => item === selectedColor
                                )
                            )?.images[2]
                            : src
                        }
                        alt={props.productTitle}
                        key={idx}
                        height={300}
                        width={300}
                        className={
                          slide === idx ? "aspect-square w-[400px]" : "hidden"
                        }
                      />
                    </Link>
                  );
                })
              : props.images?.map((item, idx) => {
                return (
                  <Link
                    href={`/${props.productTitle.replace(/ /g, "-")}/${props.productId
                      }`}
                    onClick={() => handleclick(props.productTitle)}
                  >
                    <Image
                      loading="lazy"
                      src={
                        isHovered && !isNavigationHovered
                          ? props.images[1]
                          : item
                      }
                      alt={props.productTitle}
                      key={idx}
                      height={300}
                      width={300}
                      className={
                        slide === idx ? "aspect-square w-[400px]" : "hidden"
                      }
                    />
                  </Link>
                );
              })}

            {isHovered && (
              <div>
                <Image
                  onMouseEnter={() => setIsNavigationHovered(true)}
                  onMouseLeave={() => setIsNavigationHovered(false)}
                  loading="lazy"
                  src="/icons/rightarro-white.svg"
                  height={20}
                  width={20}
                  alt="arrow icon"
                  onClick={nextSlide}
                  className="arrow arrow-right hover:opacity-100"
                />
              </div>
            )}

            <span className="flex absolute bottom-[16px]">
              {props.images.map((_, idx) => {
                return (
                  <button
                    key={idx}
                    className={
                      slide === idx
                        ? "bg-white w-[0.4rem] h-[0.4rem] cursor-pointer rounded-[50%] mr-1"
                        : "bg-[#ccc] w-[0.4rem] h-[0.4rem] cursor-pointer rounded-[50%] mr-1"
                    }
                    onClick={() => setSlide(idx)}
                  ></button>
                );
              })}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between pt-2 ">
            <div className=" flex flex-col">
              {props.urgency && (
                <p aria-label="Special offer" className="font-semibold tracking-wide text-[#0152be]  mb-[3px] text-[12px]">
                  {props.urgency}
                </p>
              )}
              <h3 id="products-title"  itemProp="name" className={` text-[14px] font-semibold `}>
                {props.productTitle}
              </h3>
            </div>
          </div>
          <p itemProp="description" className="font-normal mb-1 text-[14px] py-[2px] hide-on-mobile">
            {props?.shortDescription}
          </p>

          {props.productType === "normal" || props.productType === "special" ? (
            <>
              <div className=" flex h-[40px] items-center justify-between mt-2">
                <div className="flex gap-1 items-end">
                  <h2
                    className={`text-3xl flex font-semibold leading-[0.5]  tracking-wide ${props?.specialprice?.price
                      ? "bg-[#FFD209] px-2 pt-3 pb-1 w-fit shadow-lg"
                      : ""
                      } `}
                    style={
                      props?.specialprice?.price
                        ? { boxShadow: "3px 3px #C31952" }
                        : {}
                    }
                  >
                    <span
                      className={`text-sm ${props?.specialprice?.price ? "" : "pt-3.5"
                        }`}
                    >
                      Rs.  
                    </span>{" "}
                    {props?.specialprice?.price ? (
                      Math.floor(props?.specialprice?.price)
                    ) : (
                      <p className="pt-3 ">
                        {props?.discountedprice?.price
                          ? Math.floor(props?.discountedprice?.price)
                          : Math.floor(props.perUnitPrice)}
                      </p>
                    )}
                  </h2>
                  {props.unitType ? (
                    <span className="tracking-wide text-sm">{`/ ${props.unitType}`}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {(props?.specialprice?.price ||
                props?.discountedprice?.price) && (
                  <div className="flex flex-col mb-3">
                    <p className="text-[#757575] text-[12px] pt-[3px]">
                      Regular price:{" "}
                      <span className="font-bold text-black">
                        Rs.
                        <span className="line-through  text-base">
                          {Math.floor(props?.perUnitPrice)}
                        </span>
                      </span>{" "}
                      (incl. of all taxes)
                    </p>
                    {currentPeriod && (
                      <p className="text-[#757575] text-[12px] hide-on-mobile">
                        Price valid {formatDate(currentPeriod?.from)} -{" "}
                        {formatDate(currentPeriod?.to)}
                      </p>
                    )}
                  </div>
                )}
            </>
          ) : (
            <div className=" flex h-[40px] pb-[6px] items-center justify-between mt-2">
              <div className="flex gap-1 items-end">
                <h2
                  className={`text-xl flex font-semibold leading-[0.5]  tracking-wide bg-[#FFD209] px-2 pt-3 pb-1 w-fit shadow-lg $ `}
                  style={{ boxShadow: "3px 3px #C31952" }}
                >
                  Request now
                </h2>
              </div>
            </div>
          )}

          <div className="card-rating">{props.rating}</div>
          {Stars && (
            <div className="flex items-center mt-1 hide-on-mobile">
              {Stars}
              <p className="text-[14px] mt-1 ml-2">({Reviews?.length})</p>
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
                className="cursor-pointer rounded-full"
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
                    height={50}
                    width={50}
                  />
                )}
              </div>
              <p className="text-[#757575] text-[12px] mt-1">
                Expected delivery on  
                <span className="text-[#0152be] font-md font-semibold">
                  {getExpectedDeliveryDate(props.expectedDelivery)}
                </span>
              </p>
            </div>
          )}

          {imageData?.length > 1 && (
            <div className="colorContainer flex flex-col sm:w-auto w-[80vw] mt-1 ">
              <div className="w-full flex justify-between mb-1">
                <p className="text-[12px] font-medium text-[#757575]">
                  More options
                </p>
              </div>
              {
                <>
                  <div className="colors flex gap-1.5">
                    {imageData?.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedColor(item.color);
                          handleColor(item.image);
                        }}
                        className={`parent relative w-[40px] h-[40px] text-gray-900 text-center text-xs flex justify-center items-center cursor-pointer
            ${selectedColor === item.color ||
                            (index === 0 && selectedColor === "")
                            ? " border-black "
                            : " border-black"
                          }   
          `}
                      >
                        <Image
                          loading="lazy"
                          className="relative w-full h-full object-cover"
                          src={item.image}
                          alt={item.color}
                          width={25}
                          height={25}
                          style={{ objectFit: "cover" }}
                        />
                        {colorImage === item.image ||
                          (index === 0 && colorImage === "") ? (
                          <div className="w-[100%] h-[2px] bg-black mt-[50px]" />
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </>
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TabsProductCard;