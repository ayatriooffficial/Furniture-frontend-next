"use client";
// Import your icon library (e.g., Lucide icons)
import {
  Award,
  Coffee,
  Heart,
  Shield,
  Star,
} from "lucide-react";

const iconMap = {
  "heart": Heart,
  "star": Star,
  "shield": Shield,
  "award": Award,
  "coffee": Coffee,
  // Add more mappings as needed
};

import BlogRelatedProducts from "@/components/Cards/BlogRelatedProducts";
import Tabs from "@/components/Cards/Tabs";
import { selectRecommendedProduct } from "@/components/Features/Slices/recommendationSlice";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TabImage from "@/components/Cards/TabImage";

import {
  selectSuggestionData,
  selectSuggestionStatus,
} from "@/components/Features/Slices/suggestionDataSlice";
import { usePathname } from "next/navigation";
import {
  FreeMode,
  Mousewheel,
  Pagination,
  Scrollbar
} from "swiper/modules";
import RankedProducts from "../Cards/RankedProducts";
import Multicard from "../Imagechanger/Multicard";

const Suggestion = ({ id }) => {
  const pathname = usePathname();

  const dispatch = useDispatch();
  const selectData = useSelector(selectRecommendedProduct);
  const suggestion = useSelector(selectSuggestionData);
  const suggestionStatus = useSelector(selectSuggestionStatus);

  const handleSetItem = () => {
    const newItem = { label: "Blog", href: pathname };
    sessionStorage.setItem("navigationItem", JSON.stringify(newItem));
  };

  const cardDescriptionRenderer = (card) => {
    if (!card?.description) return null;

    // Utility: check if content is HTML
    const hasHtml = (html) => /<\/?[a-z][\s\S]*>/i.test(html);

    // Utility: strip HTML tags for plain text rendering
    const stripHtmlTags = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    // Get the description (single string or array)
    const descriptionContent = Array.isArray(card.description)
      ? card.description[0]
      : card.description;

    const descriptionText = descriptionContent
      ? stripHtmlTags(descriptionContent)
      : "";

    // Handle HTML vs plain text
    if (hasHtml(descriptionContent)) {
      return (
        <div
          className="card-description w-full overflow-x-auto"
          style={{
            width: "100%",
            overflowX: "auto",
            margin: "5px 0",
          }}
          dangerouslySetInnerHTML={{ __html: descriptionContent }}
        />
      );
    }

    // Default plain text fallback
    return (
      <div
        className="card-description text-[12px] text-gray-700"
        style={{
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
        }}
      >
        {descriptionText}
      </div>
    );
  };

  const renderFeatureDescription = (feature) => {
    if (!feature?.description) return null;
    // Utility to check if the description contains HTML
    const hasHtml = (html) => /<\/?[a-z][\s\S]*>/i.test(html);

    // Utility to strip HTML tags for plain text rendering
    const stripHtmlTags = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };

    const descriptionText = feature.description
      ? stripHtmlTags(feature.description)
      : "";

    switch (feature.displayType) {
      case "Tip":
        // Only render as Tip if explicitly marked as Tip and no HTML table
        if (!hasHtml(feature.description)) {
          return (
            <div
              key={feature._id}
              style={{
                padding: "20px",
                margin: "10px",
                borderLeft: "4px solid #0152be",
                backgroundColor: "#e6f0fa",
                textAlign: "left",
                width: "100%",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                Expert Tip
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#000",
                  lineHeight: "1.5",
                }}
              >
                {descriptionText}
              </p>
            </div>
          );
        }
      // Fall through to default if Tip contains HTML (treat as table)

      // case "cardSVG":
      //   return (
      //     <div
      //       key={feature._id}
      //       style={{
      //         flex: "1",
      //         minWidth: "200px",
      //         maxWidth: "300px",
      //         padding: "20px",
      //         margin: "10px",
      //         borderRadius: "10px",
      //         backgroundColor: "#f9f9f9",
      //         textAlign: "center",
      //         boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      //       }}
      //     >
      //       {feature.svg && (
      //         <img
      //           src={feature.svg}
      //           alt={`${feature.title} icon`}
      //           style={{
      //             width: "40px",
      //             height: "40px",
      //             marginBottom: "10px",
      //             display: "block",
      //             marginLeft: "auto",
      //             marginRight: "auto",
      //           }}
      //         />
      //       )}
      //       <h3
      //         style={{
      //           fontSize: "18px",
      //           fontWeight: "bold",
      //           marginBottom: "10px",
      //           color: "#333",
      //         }}
      //       >
      //         {feature.title}
      //       </h3>
      //       <p
      //         style={{
      //           fontSize: "14px",
      //           color: "#666",
      //           lineHeight: "1.5",
      //         }}
      //       >
      //         {descriptionText}
      //       </p>
      //     </div>
      //   );
      default:
        // Handle tables or any HTML content
        if (hasHtml(feature.description)) {
          console.log("cwiwiebfiewb")
          return (
            <div
              key={feature._id}
              style={{
                width: "100%",
                overflowX: "auto",
                margin: "10px 0",
              }}
            >
              <style>
                {`
                  .custom-table table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 1px solid #e0e0e0;
                    font-size: 14px;
                    color: #666;
                  }
                  .custom-table th,
                  .custom-table td {
                    border: 1px solid #e0e0e0;
                    padding: 10px;
                    text-align: center;
                  }
                  .custom-table th {
                    font-weight: bold;
                    color: #333;
                    background-color: #f5f5f5;
                    text-transform: uppercase;
                  }
                  .custom-table td {
                    background-color: #fff;
                  }
                `}
              </style>
              <div
                className="custom-table"
                dangerouslySetInnerHTML={{
                  __html: feature.description || "",
                }}
              />
            </div>
          );
        }

        // Default plain text case
        return (
          <div
            key={feature._id}
            style={{
              flex: "1",
              minWidth: "200px",
              maxWidth: "300px",
              padding: "20px",
              margin: "10px",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {feature.svg && (
              <img
                src={feature.svg}
                alt={`${feature.title} icon`}
                style={{
                  width: "40px",
                  height: "40px",
                  marginBottom: "10px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            )}
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.5",
              }}
            >
              {descriptionText}
            </p>
          </div>
        );
    }
  };

  useEffect(() => {
    handleSetItem();
    if (suggestionStatus === "idle" || suggestionStatus === "failed") {
      dispatch({ type: "FETCH_SUGGESTION_DATA", payload: id });
    }
  }, [id, suggestion]);



  const [recommended, setRecommended] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      dispatch({ type: "RECOMMENDATION_REQUEST" });
      setDataFetched(true);
    }

    if (selectData) {
      setRecommended(selectData.recommendations?.recommendedProducts);
    }

    if (typeof window !== "undefined") {
      var id = localStorage.getItem("deviceId");
    }
  }, [dispatch, selectData, dataFetched]); // Include dataFetched in the dependency array

  const [reviewRoom, setReviewRoom] = useState({});
  const [reviewData, setReviewData] = useState([]);

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRoomByQuery`,
        {
          params: {
            category:
              (suggestion && suggestion.category && suggestion.category[0]) ||
              "",
          },
        }
      );
      setReviewRoom(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const fetchReviewData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getSpecialReview`
      );
      setReviewData(response.data);
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  useEffect(() => {
    fetchRoomData();
    fetchReviewData();

  }, [suggestion]);

  const swiperOptions2 = {
    slidesPerView: 4.08,
    centeredSlides: false,
    spaceBetween: 5,
    modules: [Pagination, Scrollbar, Mousewheel, FreeMode],
    noSwiping: true,
    allowSlidePrev: true,
    allowSlideNext: true,
  };
  const swiper1Ref = useRef(null);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const Card1Features = ({ features, iconMap }) => {
    if (!features || features.length === 0) return null;

    return (
      <div className="mt-6 w-full flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        {features.map((feature, index) => {
          const Icon = feature.icon ? iconMap[feature.icon] : null;

          return (
            <div key={index} className="h-full flex-shrink-0">
              <div className="bg-white min-h-[200px] md:min-w-[20vw] min-w-[90vw] md:max-w-[30vw] max-w-[90vw] p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                {Icon && (
                  <Icon size={36} className="mb-4 text-indigo-600" />
                )}
                <h3 className="font-semibold text-gray-900 text-lg">
                  {feature.name}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Card2Component - Grid layout for cards without icons
  const Card2Features = ({ features }) => {
    if (!features || features.length === 0) return null;

    return (
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full">
        {features.map((feature, index) => (
          <div key={index} className="h-full">
            <div className="bg-white min-h-[350px] p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col">
              <h3 className="font-semibold text-gray-900 text-lg">
                {feature.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // TipsComponent - Vertically stacked tips
  const TipsFeatures = ({ features }) => {
    if (!features || features.length === 0) return null;

    return (
      <div className="mt-8 flex flex-col gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full text-green-800 bg-green-500/25 p-4 border-l-4 border-green-800"
          >
            <strong>{feature.name}:</strong> {feature.description}
          </div>
        ))}
      </div>
    );
  };

  const FeaturesSection = ({ suggestion, iconMap }) => {
    if (!suggestion || !suggestion.features || suggestion.features.length === 0) {
      return null;
    }

    const card1Features = suggestion.features.filter(feature => feature.displayType === 'card1');
    const card2Features = suggestion.features.filter(feature => feature.displayType === 'card2');
    const tipsFeatures = suggestion.features.filter(feature => feature.displayType === 'tips');

    return (
      <div className="mt-20 px-5 sm:px-12">
        <h></h>
        <h2 className="text-2xl font-semibold">Features</h2>

        <article className="sm:w-3/4 py-3 w-full ">
          {suggestion.features.length > 0
            ?
            <div className="">
              <div className="flex flex-col ">
                <div>
                  <h2 className="text-[14px] font-medium text-[#6e6e73] mt-10">
                    {suggestion.features[0].name || "Feature"}:
                  </h2>
                  <div className="text-[13px] text-[#6e6e73] pt-[3px] pb-[15px]">
                    {/* {roomMain?.features[0]?.description} */}
                    {renderFeatureDescription(suggestion.features[0])}
                  </div>
                </div>
                <div className="w-full h-auto flex justify-start gap-6 flex-nowrap overflow-auto scrollbar-hidden bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {suggestion.features[0].cards &&
                    suggestion.features[0]?.cards.map((card, cardIdx) => {
                      // let parsedCard;
                      // try {
                      //   parsedCard = JSON.parse(card);
                      // } catch {
                      //   parsedCard = { description: 'Invalid card', svgUrl: '' };
                      // }

                      return (
                        <div
                          key={cardIdx}
                          className="bg-white border-[1px] border-gray-200 text-[12px] text-black font-semibold pt-[3px] max-h-full min-w-[240px] max-w-[240px] aspect-square overflow-auto p-2 rounded-xl px-8"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {card.svgUrl && (
                            <img
                              className="size-20 text-center mx-auto mt-6"
                              src={card.svgUrl}
                              alt=""
                            />
                          )}
                          {cardDescriptionRenderer(card)}
                        </div>
                      );
                    })}

                </div>


                {suggestion.features[0].icon && (
                  <div className="bg-green-200 text-[12px] text-green-700 w-full mt-10 p-4">
                    <span className="font-bold">{suggestion.features[0].name} Tip :</span> {suggestion.features[0]?.icon}
                  </div>
                )}
              </div>
            </div>
            : filteredSubCategory &&
            filteredSubCategory[0]?.features?.length > 0 &&
            filteredSubCategory[0]?.features.map((feature, featureIdx) => (
              <div key={featureIdx} className="">
                <div className="flex flex-col ">
                  <div>
                    <h2 className="text-[14px] font-medium text-[#6e6e73] mt-10">
                      {feature.title || "Feature"}:
                    </h2>
                    <div className="text-[13px] text-[#6e6e73] pt-[3px] pb-[15px]">
                      {renderFeatureDescription(feature)}
                    </div>
                  </div>
                  <div className="w-full h-auto flex justify-start gap-6 flex-nowrap overflow-auto scrollbar-hidden bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {feature.cards &&
                      feature.cards.map((card, cardIdx) => (
                        <div
                          key={cardIdx}
                          className="bg-white border-[1px] border-gray-200  text-[12px] text-black font-semibold pt-[3px] max-h-full min-w-[240px] max-w-[240px] aspect-square overflow-auto p-2 rounded-xl px-8"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {card.svgUrl && (<img className="size-20 text-center mx-auto mt-6" src={card.svgUrl} alt="" />)}
                          {cardDescriptionRenderer(card)}
                          {/* {Array.isArray(card.description)
        ? card.description.map((desc, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: desc }} />
          ))
        : <div dangerouslySetInnerHTML={{ __html: card.description }} />} */}
                        </div>
                      ))}
                  </div>

                  {suggestion.features[0].icon && (
                    <div className="bg-blue-400 text-[12px] text-white w-full mt-10 p-4">
                      <span className="font-bold">{suggestion.features[0].title} Tip :</span> {suggestion.features[0].icon}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </article>


        <Card1Features features={card1Features} iconMap={iconMap} />
        <Card2Features features={card2Features} />
        <TipsFeatures features={tipsFeatures} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" role="main" aria-label="Content showcase">
      {suggestion && suggestion.position && suggestion.position.length > 0 && (
        <main className="md:pt-[7rem]">
          {suggestion.position.map((name, idx) => (
            <section key={idx} className="px-[20px] sm:px-[50px]" aria-labelledby={`section-${name}`}>
              {name === "heading" && (
                <div>
                  <h1 id="section-heading" className="lg:text-[30px] lg:w-[70%] text-[24px] font-semibold">
                    {suggestion.heading}
                  </h1>
                  <p className="mt-5 line-clamp-3 lg:line-clamp-none lg:w-[90%]">
                    {suggestion.summary}
                  </p>
                  {suggestion?.author && (
                    <div className="flex items-center gap-4 mt-5">
                      {suggestion.author.image && (
                        <Image
                          src={suggestion.author.image}
                          alt={suggestion.author.displayName}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-lg">{suggestion.author.displayName}</p>
                        {suggestion.author.role && (
                          <p className="text-gray-500 text-sm">{suggestion.author.role}</p>
                        )}
                        {suggestion.author.authorDetails?.experience && (
                          <p className="text-gray-500 text-sm">
                            {suggestion.author.authorDetails.experience} years experience
                          </p>
                        )}
                        {suggestion.author.authorDetails?.award && (
                          <p className="text-gray-500 text-sm">
                            Award: {suggestion.author.authorDetails.award}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {name === "mainImage" && (
                <div className="mt-20 relative w-full h-[550px]" aria-label="Featured product image">
                  <TabImage
                    src={suggestion.mainImage.imgSrc}
                    href={`/${suggestion.mainImage.productCategory.replace(/ /g, "-")}/collection/all`}
                    alt={`Featured product from ${suggestion.mainImage.productCategory} collection`}
                    fill
                    width={1000}
                    height={1000}
                    style={{ objectFit: "cover" }}
                    labelData={suggestion.mainImage.children}
                    aria-describedby="main-image-desc"
                  />
                </div>
              )}

              {name === "twoGrid" && (
                <section className="mt-20">
                  <h2 id="section-twoGrid" className="text-2xl font-semibold">
                    {suggestion.twoGrid.twoGridHeader}
                  </h2>
                  <p className="text-gray-700 mt-5 lg:w-[70%] line-clamp-3 lg:line-clamp-none">
                    {suggestion.twoGrid.twoGridDescription}
                  </p>
                  <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between mx-auto" aria-label="Two-column product showcase">
                    <div className="relative h-[449px] lg:min-h-[730px] w-full" aria-label="Left product image">
                      <TabImage
                        src={suggestion.twoGrid.twoGridRooms[0].imgSrc}
                        href={`/${suggestion.twoGrid.twoGridRooms[0].productCategory.replace(/ /g, "-")}/collection/all`}
                        alt={`Product from ${suggestion.twoGrid.twoGridRooms[0].productCategory} category`}
                        fill
                        width={1000}
                        height={1000}
                        style={{ objectFit: "cover" }}
                        labelData={suggestion.twoGrid.twoGridRooms[0].children}
                      />
                    </div>
                    <div className="relative h-[449px] lg:min-h-[730px] w-full" aria-label="Right product image">
                      <TabImage
                        src={suggestion.twoGrid.twoGridRooms[1].imgSrc}
                        href={`/${suggestion.twoGrid.twoGridRooms[1].productCategory.replace(/ /g, "-")}/collection/all`}
                        alt={`Product from ${suggestion.twoGrid.twoGridRooms[1].productCategory} category`}
                        fill
                        width={1000}
                        height={1000}
                        style={{ objectFit: "cover" }}
                        labelData={suggestion.twoGrid.twoGridRooms[1].children}
                      />
                    </div>
                  </div>
                </section>
              )}

              {name === "fiveGrid" && (
                <section className="mt-20">
                  <h2 id="section-fiveGrid" className="text-2xl font-semibold">
                    {suggestion.fiveGrid.fiveGridHeader}
                  </h2>
                  <p className="text-gray-700 my-5 lg:w-[70%] line-clamp-3 lg:line-clamp-none">
                    {suggestion.fiveGrid.fiveGridDescription}
                  </p>
                  <div className="flex justify-between mb-10" aria-label="Grid layout product showcase">
                    <div className="w-full flex justify-center max-h-[915px] screens">
                      <div className="w-full lg:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr">
                        {suggestion.fiveGrid.fiveGridRooms.map((room, index) => (
                          <div
                            key={index}
                            className={`parent ${index === 0
                              ? "col-start-1 col-end-3 row-start-1 row-end-6 lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-12"
                              : index === 1
                                ? "col-start-1 col-end-2 row-start-6 row-span-2 lg:col-start-7 lg:col-end-10 lg:row-start-1 lg:row-end-6"
                                : index === 2
                                  ? "col-start-2 col-end-3 row-start-6 row-span-3 lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-7"
                                  : index === 3
                                    ? "col-start-1 col-end-2 row-start-8 row-span-3 lg:col-start-7 lg:col-end-10 lg:row-start-6 lg:row-end-12"
                                    : "col-start-2 col-end-3 row-start-9 row-span-2 lg:col-start-10 lg:col-end-13 lg:row-start-7 lg:row-end-12"
                              }`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            aria-label={`Product cell ${index + 1}`}
                          >
                            <div className="relative w-full h-full">
                              <TabImage
                                href={`/${room.productCategory.replace(/ /g, "-")}/collection/all`}
                                src={room.imgSrc}
                                alt={`Product from ${room.productCategory} category`}
                                width={1000}
                                height={338}
                                labelData={room.children}
                                hovered={hoveredIndex === index}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {(name === "firstSlider" ||
                name === "secondSlider" ||
                name === "thirdSlider" ||
                name === "forthSlider" ||
                name === "fifthSlider") && (
                  <section aria-labelledby={`section-${name}`}>
                    <h2 id={`section-${name}`} className="sr-only">{suggestion[name].header}</h2>
                    <BlogRelatedProducts
                      relatedProducts={suggestion[name].products}
                      title={suggestion[name].header}
                      description={suggestion[name].description}
                      descriptionLinks={suggestion[name].descriptionLinks}
                      aria-label={`${suggestion[name].header} slider`}
                    />
                  </section>
                )}
            </section>
          ))}

          <section aria-labelledby="ranked-products">
            <h2 id="ranked-products" className="sr-only">Ranked Products</h2>
            <RankedProducts aria-label="Top-ranked products" />
          </section>

          <section className="flex my-8 lg:max-h-[490px] lg:flex-row w-full flex-col" aria-label="Customer testimonial with product image">
            <div className="lg:w-2/3 h-[446px]" aria-label="Featured room image">
              {reviewRoom && (
                <TabImage
                  src={reviewRoom.imgSrc}
                  alt={`Room design featuring our products`}
                  width={1000}
                  height={446}
                  labelData={reviewRoom.children}
                />
              )}
            </div>
            {reviewData && <aside className="lg:w-1/3 min-h-[363px] bg-zinc-100 p-10 lg:p-12" aria-label="Customer review">
              <div className="flex flex-col">
                <div>
                  <p>{reviewData && reviewData.comment}</p>
                </div>
                <div className="flex mt-5 flex-row items-center gap-2" aria-label="Reviewer information">
                  <Image
                    loading="lazy"
                    src={reviewData && reviewData.image}
                    width={45}
                    height={45}
                    alt={reviewData && `Photo of ${reviewData.name}`}
                    className="aspect-square object-cover rounded-full"
                  />
                  <p>{reviewData && reviewData.name}</p>
                </div>
              </div>
            </aside>}
          </section>

          <section aria-labelledby="multicard-section">
            <h2 id="multicard-section" className="sr-only">Product Cards</h2>
            <Multicard forhomePage={false} aria-label="Featured product cards" />
          </section>

          <section aria-labelledby="recommended-section">
            <h2 id="recommended-section" className="sr-only">Recommended Products</h2>
            <Tabs data={recommended} aria-label="Recommended product tabs" />
          </section>

          {suggestion && suggestion.features && suggestion.features.length > 0 && (
            <section aria-labelledby="features-section">
              <h2 id="features-section" className="sr-only">Product Features</h2>
              <FeaturesSection
                suggestion={suggestion}
                iconMap={iconMap}
                aria-label="Product feature highlights"
              />
            </section>
          )}
        </main>
      )}
    </div>
  );
};

export default Suggestion;
