import {
  getCategoryByName
} from "@/components/Features/api";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FreeMode, Mousewheel, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReviewForm from "../../../app/(with-header)/profile/ReviewForm";
import "../styles.css";

const ratingsData = [
  {
    label: "Overall rating",
    value: (
      <div className="-ml-3 mt-3">
        {[1, 2, 3, 4, 5].map((number, index) => (
          <div
            key={index}
            className={`border mb-2 ${
              index === 0 ? "border-black bg-black" : "bg-gray-300"
            }  w-32 h-1.5 flex flex-row items-center justify-start`}
          >
            <span className="-ml-3 text-sm">{number}</span>
          </div>
        ))}
      </div>
    ),
    icon: null,
  },
  {
    label: "Accuracy",
    value: "5.0",
    icon: (
      <Image
        loading="lazy"
        src="/icons/checkmark-icon.svg"
        width={36}
        height={36}
        alt="accuracy"
        className="mt-5"
      />
    ),
  },
  {
    label: "Communication",
    value: "4.9",
    icon: (
      <Image
        loading="lazy"
        src="/icons/message-icon.svg"
        width={36}
        height={36}
        alt="communication"
        className="mt-5"
      />
    ),
  },
  {
    label: "Location",
    value: "4.0",
    icon: (
      <Image
        loading="lazy"
        src="/icons/location-pin-icon.svg"
        width={36}
        height={36}
        alt="map"
        className="mt-5"
      />
    ),
  },
  {
    label: "Value",
    value: "5.0",
    icon: (
      <Image
        loading="lazy"
        src="icons/offer.svg"
        width={36}
        height={36}
        alt="value"
        className="mt-5"
      />
    ),
  },
  {
    label: "waterprof",
    value: "5.0",
    icon: (
      <Image
        loading="lazy"
        src="icons/offer.svg"
        width={36}
        height={36}
        alt="value"
        className="mt-5"
      />
    ),
  },
];

const Reviews = ({ productId, data }) => {
  const [reviews, setReviews] = useState([]);
  const [sidebarContent, setSidebarContent] = useState(null);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReview, setIsReview] = useState(false);

  const [categoryData, setCategoryData] = useState(null);
  const [showRatingTypes, setShowRatingTypes] = useState(null);
  const [averageRatings, setAverageRatings] = useState({});
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window?.location?.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // urlParams.delete("token");
      window.history.replaceState({}, "", `${window.location.pathname}`);
    }
  }, []);

  useEffect(() => {
    const fetchCategoryRatingTypes = async () => {
      try {
        if (data && data.category) {
          const category = await getCategoryByName(data.category);
          setCategoryData(category);
          setShowRatingTypes(category.availableRatingTypes);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategoryRatingTypes();
  }, [data, data.category]);

  // avg rating of each dynamic rating [e.g waterproof, quality,...]
  const computeAverageRatings = useMemo(() => {
    const avgRatings = {};

    if (reviews.length > 0 && showRatingTypes) {
      showRatingTypes.forEach((type) => {
        const ratingsForType = reviews.map((review) => {
          const dynamicRating = review.dynamicRatings.find(
            (r) => r.name === type.name
          );
          return dynamicRating ? Number(dynamicRating.value) : 0;
        });
        const sum = ratingsForType.reduce((acc, rating) => acc + rating, 0);
        const avg = sum / ratingsForType.length || 0; // Handle division by zero

        avgRatings[type._id] = avg.toFixed(1); // Store the average with one decimal place
      });
    }

    return avgRatings;
  }, [reviews, showRatingTypes]);

  useEffect(() => {
    if (reviews.length > 0) {
      const counts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      // Count ratings
      reviews.forEach((review) => {
        counts[review.rating]++;
      });

      setRatingCounts(counts);
    }
  }, [reviews]);

  // overall avg rating of the product
  const calculateOverallAverageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  }, [reviews]);

  const handleReview = () => {
    setIsReview(!isReview);
  };

  const checkUser = async () => {
    try {
      const token = localStorage?.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data;
      if (userData.isAuthenticated) {
       
        setUser(userData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getReview?productId=${productId}`
      );
      

      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    setReviews([]);
    fetchReviews();
  }, [productId, data]);

  const addReview = async (newReview) => {
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("name", user.displayName);
    formData.append("userEmail", user.email);
    formData.append("userId", user._id);
    formData.append("rating", newReview.rating);
    formData.append("comment", newReview.comment);
    formData.append("profilePic", user.image);
    newReview.images.forEach((image) => {
      formData.append("image", image);
    });

    // Append dynamicRatings to FormData
    newReview.dynamicRatings?.forEach((rating, index) => {
      formData.append(`dynamicRatings[${index}][name]`, rating.name);
      formData.append(`dynamicRatings[${index}][value]`, rating.value);
    });

    if (isAuthenticated) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/createReview`,
          formData
        );
        // console.log(response.data);
        fetchReviews();
        // Add any necessary logic after successful submission
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    } else {
      alert("Login first");
    }
  };

  const handleDelete = async (id) => {
    if (isAuthenticated) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteReview/${id}`
        );
        // console.log(response);
        fetchReviews();
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const toggleShowMore = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].showFullComment =
      !updatedReviews[index].showFullComment;
    setReviews(updatedReviews);
  };

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <section className="reviews-section sm:w-auto overflow-x-hidden mb-5 -mt-6 flex flex-col justify-center py-[24px] border-b-[0.5px] border-[#f5f5f5]" aria-labelledby="reviews-header">
      <div className="flex justify-between" onClick={toggleDropdown} role="button" aria-expanded={isDropdownOpen} aria-controls="reviews-content" tabIndex="0">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2 overflow-hidden" aria-hidden="true">
            {reviews.slice(0, 3).map((review, index) => (
              <figure key={index} className="bg-white rounded-full flex items-center justify-center w-[25px] h-[25px] md:w-[25px] md:h-[25px]">
                <Image
                  loading="lazy"
                  src={review.profilePic}
                  height={20}
                  width={20}
                  alt={`${review.name}'s profile picture`}
                  className="rounded-full w-[22px] h-[22px] md:w-[22px] md:h-[22px]"
                />
              </figure>
            ))}
          </div>
  
          <h2 id="reviews-header" className="text-[#222222] text-[20px] font-medium">
            {reviews.length}
            <span> reviews</span>
          </h2>
        </div>
        
        <div className="flex space-x-4" aria-label={`Average rating: ${calculateOverallAverageRating} out of 5 stars`}>
          <p className="text-lg font-bold">{calculateOverallAverageRating}</p>
          <Image
            loading="lazy"
            src="/icons/star full black.svg"
            width={15}
            height={15}
            alt=""
            aria-hidden="true"
            className="m-[2px]"
          />
          <div className="pr-5">
            <Image
              loading="lazy"
              src="/icons/downarrow.svg"
              alt=""
              width={20}
              height={20}
              className=""
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      
      <div id="reviews-content" aria-hidden={!isDropdownOpen}>
        {isDropdownOpen &&
          (data.productType === "special" ||
            data.productType === "requested") && (
            <section className="product-highlight md:mb-[34px] mt-7 mb-[16px]" aria-label="Product highlight">
              <div className="flex flex-col justify-center mx-auto">
                {data.productType === "requested" && (
                  <div className="flex items-center justify-center overflow-hidden flex-row">
                    <img
                      className="h-32 scale-x-[-1]"
                      alt=""
                      aria-hidden="true"
                      src="/icons/amf/rightGold.svg"
                    />
                    <div className="text-[5rem] font-medium text-[#bf9b30] pb-5" aria-label={`Rating: ${calculateOverallAverageRating || "5.0"} out of 5`}>
                      {calculateOverallAverageRating || "5.0"}
                    </div>
                    <img
                      className="h-32"
                      alt=""
                      aria-hidden="true"
                      src="/icons/amf/rightGold.svg"
                    />
                  </div>
                )}
                {data.productType === "special" && (
                  <div className="flex gap-2 items-center justify-center overflow-hidden flex-row">
                    <img
                      className="h-32 scale-x-[-1]"
                      alt=""
                      aria-hidden="true"
                      src="/icons/ayatrio famaily faveriot right.svg"
                    />
                    <div className="text-[5rem] font-medium text-black pb-5" aria-label={`Rating: ${calculateOverallAverageRating || "5.0"} out of 5`}>
                      {calculateOverallAverageRating || "5.0"}
                    </div>
                    <img
                      className="h-32"
                      alt=""
                      aria-hidden="true"
                      src="/icons/ayatrio famaily faveriot right.svg"
                    />
                  </div>
                )}
                <div className="flex justify-center items-center flex-col">
                  <div
                    className={`text-xl mb-1 font-bold ${
                      data.productType === "requested"
                        ? "text-[#bf9b30]"
                        : "text-black"
                    }`}
                  >
                    Ayatrio Member Favourite
                  </div>
                  <div className="text-center text-gray-500">
                    <p className="text-[14px]">
                      One of the most loved homes on Ayatrio
                    </p>
                    <p className="text-[14px]">
                      based on{" "}
                      {showRatingTypes?.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        
        {isDropdownOpen &&
          reviews?.length > 0 &&
          showRatingTypes?.length > 0 && (
            <section className="rating-map hidden md:flex justify-between mt-6 w-full overflow-x-auto lg:mb-8 mb-4" aria-label="Rating categories">
              {/* Overall Ratings */}
              <article className="flex flex-col items-center">
                <h3 className="font-semibold text-gray-700 mb-2 capitalize" id="overall-ratings">
                  Overall Ratings
                </h3>
                <div className="mt-2" aria-labelledby="overall-ratings">
                  {[5, 4, 3, 2, 1].map((number, index) => (
                    <div className="flex" key={index} aria-label={`${number} star rating: ${Math.round((ratingCounts[number] / reviews.length) * 100)}%`}>
                      <span className="mr-2 text-sm">{number}</span>
                      <div className="flex items-center w-20">
                        <div className="h-1 bg-gray-300 w-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-r-full"
                            style={{
                              width: `${
                                (ratingCounts[number] / reviews.length) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
    
              {/* Rating Types */}
              {showRatingTypes?.map((item, index) => (
                <article
                  key={`${item._id}_${index}`}
                  className={`flex flex-col items-center text-center min-w-[110px] ${
                    index === showRatingTypes.length - 1 ? "mr-8" : ""
                  }`}
                  aria-label={`${item.name} rating: ${computeAverageRatings[item._id]} out of 5`}
                >
                  <h3 className="font-semibold text-gray-700 mb-4 capitalize" id={`rating-${item._id}`}>
                    {item.name}
                  </h3>
                  <div className="text-lg font-semibold text-gray-900 my-2" aria-labelledby={`rating-${item._id}`}>
                    {computeAverageRatings[item._id]}
                  </div>
                  <figure>
                    <Image
                      src={item.image}
                      alt=""
                      width={30}
                      height={30}
                      loading="lazy"
                      aria-hidden="true"
                    />
                  </figure>
                </article>
              ))}
            </section>
          )}
        
        {isDropdownOpen && (
          <>
            <div className="flex justify-between items-baseline mt-10 mb-2">
              <div className="flex mb-1 text-xl font-semibold space-x-1" aria-label={`${calculateOverallAverageRating} out of 5 stars. ${reviews.length} reviews`}>
                {calculateOverallAverageRating > 0 && (
                  <>
                    <Image
                      loading="lazy"
                      src="/icons/star full black.svg"
                      width={15}
                      height={15}
                      alt=""
                      aria-hidden="true"
                      className="m-[2px]"
                    />
                    {calculateOverallAverageRating}
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <div className="text-lg underline">
                  {reviews.length}
                  <span> reviews</span>
                </div>
              </div>
              <>
                {isLoading ? (
                  <p role="status">Loading...</p>
                ) : !isReview ? (
                  <ReviewForm
                    addReview={addReview}
                    categoryData={categoryData}
                    isAuthenticated={isAuthenticated}
                  />
                ) : (
                  <div>
                    {/* This section can be used for further review-related content */}
                  </div>
                )}
              </>
            </div>
            
            <main className="reviews-container hidden mt-4 max-w-[80%] md:flex md:flex-col gap-4" style={{ overflowX: "hidden" }} aria-label="Featured reviews">
              {reviews.slice(0, 3).map((review, index) => (
                <article key={index} className="review-item sm:mr-12 mb-8 m-0 sm:block">
                  <header className="flex justify-between">
                    <Link
                      className="review-header flex items-center"
                      href={`/profile/${review?.userId}`}
                      aria-label={`Review by ${review.name}`}
                    >
                      <figure className="w-[48px] h-[48px] mr-4">
                        <img
                          className="w-full h-full rounded-full object-cover"
                          src={review.profilePic}
                          alt={`${review.name}'s avatar`}
                        />
                      </figure>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[16px]">
                          {review.name}
                        </span>
                      </div>
                    </Link>
                    {isAuthenticated && user.email === review.userEmail && (
                      <div className="flex items-center">
                        <button 
                          onClick={() => handleDelete(review._id)}
                          aria-label="Delete your review"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </header>
                  
                  <div className="ratings flex mt-3" aria-label={`Rated ${review.rating} out of 5 stars on ${Date(review.createdAt).slice(0, 15)}`}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Image
                        loading="lazy"
                        key={i}
                        src="/icons/star full black.svg"
                        width={15}
                        height={15}
                        alt=""
                        aria-hidden="true"
                        className="m-[2px]"
                      />
                    ))}
                    <span className="text-sm font-semibold ml-2">
                      {Date(review.createdAt).slice(0, 15)}
                    </span>
                  </div>
    
                  <div className="review mt-2">
                    <p className="text-gray-600 font-[16px] leading-6 sm:w-auto text-left w-[100%]">
                      {review.showFullComment
                        ? review.comment
                        : `${review.comment.slice(0, 150)}...`}
                      {review.comment.length > 150 && (
                        <button
                          className="underline font-medium cursor-pointer ml-1"
                          onClick={() => toggleShowMore(index)}
                          aria-expanded={review.showFullComment}
                          aria-controls={`review-${index}-content`}
                        >
                          {review.showFullComment ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </p>
                  </div>
    
                  {review.images.length > 0 && (
                    <figure className="flex gap-2 mb-4">
                      {review.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`Review image ${imgIndex + 1} by ${review.name}`}
                          className="w-[100px] h-[100px] object-cover"
                        />
                      ))}
                    </figure>
                  )}
                </article>
              ))}
            </main>
    
            {reviews.length > 3 && (
              <footer className="desktop-footer hidden md:block">
                <button
                  onClick={() => {
                    setSidebarContent("showReviews");
                  }}
                  className="font-semibold hidden md:flex mb-4 py-2 px-4 border hover:bg-zinc-100"
                  aria-label="Show all reviews"
                  aria-controls="all-reviews-sidebar"
                >
                  Show all reviews
                </button>
              </footer>
            )}
          </>
        )}
        
        {isDropdownOpen && (
          <aside className="mobile-reviews md:hidden max-h-[300px] w-full" aria-label="Mobile reviews">
            <Swiper
              ref={swiper1Ref}
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
                  slidesPerView: 1.1,
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
                prevSlideMessage: 'Previous review',
                nextSlideMessage: 'Next review',
                firstSlideMessage: 'This is the first review',
                lastSlideMessage: 'This is the last review',
                paginationBulletMessage: 'Go to review {{index}}'
              }}
            >
              {reviews.slice(0, 3).map((review, index) => (
                <SwiperSlide key={`mobile-review-${index}`}>
                  <article className="sm:mr-12 mb-8 flex flex-col justify-between m-0 sm:block rounded-sm p-4 border shadow-sm min-h-[230px]" aria-labelledby={`mobile-review-title-${index}`}>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="ratings flex mt-3" aria-label={`Rated ${review.rating} out of 5 stars`}>
                          {[...Array(review.rating)].map((_, i) => (
                            <Image
                              loading="lazy"
                              key={i}
                              src="/icons/star full black.svg"
                              width={10}
                              height={10}
                              alt=""
                              aria-hidden="true"
                              className="m-[2px]"
                            />
                          ))}
                          <span className="text-sm font-semibold ml-2 text-gray-600">
                            {new Date(review.createdAt).toLocaleString(
                              "default",
                              { month: "long", year: "numeric" }
                            )}
                          </span>
                        </div>
    
                        <div className="review mt-1">
                          <p className="text-gray-600 font-[16px] text-[14px] leading-6 sm:w-auto text-left w-[100%]" id={`mobile-review-content-${index}`}>
                            {review.showFullComment
                              ? review.comment
                              : `${review.comment.slice(0, 100)}...`}
                          </p>
                          {review.comment.length > 100 && (
                            <button
                              className="underline font-medium cursor-pointer text-[14px] mt-1"
                              onClick={() => toggleShowMore(index)}
                              aria-expanded={review.showFullComment}
                              aria-controls={`mobile-review-content-${index}`}
                            >
                              {review.showFullComment
                                ? "Show Less"
                                : "Show More"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <footer className="flex justify-between mt-5">
                      <Link
                        className="review-header flex items-center"
                        href={`/profile/${review?.userId}`}
                        id={`mobile-review-title-${index}`}
                      >
                        <figure className="w-[48px] h-[48px] mr-4">
                          <img
                            className="w-full h-full rounded-full object-cover"
                            src={review.profilePic}
                            alt={`${review.name}'s avatar`}
                          />
                        </figure>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[16px]">
                            {review.name}
                          </span>
                          <span className="font-normal text-[14px] text-gray-500"></span>
                        </div>
                      </Link>
                      {isAuthenticated && user.email === review.userEmail && (
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleDelete(review._id)}
                            aria-label="Delete your review"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </footer>
    
                    {review.images.length > 0 && (
                      <figure className="flex gap-2 mb-4 mt-4">
                        {review.images.map((image, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={image}
                            alt={`Review image ${imgIndex + 1} by ${review.name}`}
                            className="w-[100px] h-[100px] object-cover"
                          />
                        ))}
                      </figure>
                    )}
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </aside>
        )}
        
        {isDropdownOpen && reviews.length > 3 && (
          <footer className="mobile-footer">
            <button
              onClick={() => {
                setSidebarContent("showReviews");
              }}
              className="font-semibold flex md:hidden mb-4 py-2 px-4 mt-6 border hover:bg-zinc-100"
              aria-label="Show all reviews"
              aria-controls="all-reviews-sidebar"
            >
              Show all reviews
            </button>
          </footer>
        )}
      </div>
      
      {isDropdownOpen && sidebarContent === "showReviews" && (
        <div className="fixed z-[99999] h-full w-screen bg-black/50 top-0 left-0" role="dialog" aria-modal="true" aria-labelledby="all-reviews-title">
          <section id="all-reviews-sidebar" className="text-black bg-white flex-col absolute right-0 top-0 h-full z-[99999] w-full lg:w-[35%] flex overflow-y-auto">
            <div className="flex flex-col">
              <div className="px-[25px] pb-[32px]">
                <div>
                  <div className="flex bg-white flex-col fixed top-0 w-[90%] md:w-[32%]">
                    <div className="flex items-center justify-between pt-2 mt-[10px] mb-[10px] h-[72px]">
                      <p className="text-[24px] font-semibold text-[#111111]" id="all-reviews-title">
                        All Reviews
                      </p>
                      <button
                        className="text-xl px-3 py-1 hover:bg-[#e5e5e5] rounded-full cursor-pointer"
                        onClick={() => setSidebarContent(null)}
                        aria-label="Close reviews"
                      >
                        <Image
                          loading="lazy"
                          src="/icons/cancel.svg"
                          alt=""
                          width={20}
                          height={30}
                          className="py-2"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="mt-20">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="flex flex-col mb-2 border-b-2 pb-2 justify-between m-0 sm:block rounded-sm"
                        aria-labelledby={`sidebar-review-title-${index}`}
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="ratings flex mt-3" aria-label={`Rated ${review.rating} out of 5 stars`}>
                              {[...Array(review.rating)].map((_, i) => (
                                <Image
                                  loading="lazy"
                                  key={i}
                                  src="/icons/star full black.svg"
                                  width={10}
                                  height={10}
                                  alt=""
                                  aria-hidden="true"
                                  className="m-[2px]"
                                />
                              ))}
                              <span className="text-sm font-semibold ml-2 text-gray-600">
                                {new Date(review.createdAt).toLocaleString(
                                  "default",
                                  { month: "long", year: "numeric" }
                                )}
                              </span>
                            </div>
                            <div className="review mt-1">
                              {review.comment}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-5">
                          <Link
                            className="review-header flex items-center"
                            href={`/profile/${review?.userId}`}
                            id={`sidebar-review-title-${index}`}
                          >
                            <div className="w-[48px] h-[48px] mr-4">
                              <img
                                className="w-full h-full rounded-full object-cover"
                                src={review.profilePic}
                                alt={`${review.name}'s avatar`}
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[16px]">
                                {review.name}
                              </span>
                              <span className="font-normal text-[14px] text-gray-500"></span>
                            </div>
                          </Link>
                          {isAuthenticated &&
                            user.email === review.userEmail && (
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleDelete(review._id)}
                                  aria-label="Delete your review"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                        </div>
                        {review.images.length > 0 && (
                          <div className="flex gap-2 mb-4 mt-4">
                            {review.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image}
                                alt={`Review image ${imgIndex + 1} by ${review.name}`}
                                className="w-[100px] h-[100px] object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Reviews;