"use client";
import { Award, Coffee, Heart, Shield, Star } from "lucide-react";
import { FAQPageJsonLd } from "next-seo";
import Image from "next/image";
import { useEffect, useState } from "react";

const iconMap = {
  heart: Heart,
  star: Star,
  shield: Shield,
  award: Award,
  coffee: Coffee,
};

import Multicard from "@/components/Imagechanger/Multicard";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import BlogRelatedProducts from "../Cards/BlogRelatedProducts";
import TabImage from "../Cards/TabImage";
import Tabs from "../Cards/Tabs";
import {
  selectProductData,
  selectRoomData,
  selectRoomMain,
} from "../Features/Slices/roomMainSlice";
import "./styles.css";

import RankedProducts from "@/components/Cards/RankedProducts";
import ProductPageSkeleton from "../Skeleton/ProductPageSkeleton";

export const RoomsPage = ({ params }) => {

  const pathname = usePathname();

  const [productData, setProductData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [roomMain, setRoomMain] = useState({});
  const dispatch = useDispatch();
  const roomSelect = useSelector(selectRoomData);
  const productSelect = useSelector(selectProductData);
  const roomMainSelect = useSelector(selectRoomMain);
  const KITCHEN_FAQ_FALLBACK = [
  {
    questionName: "What are the essential elements of a functional kitchen design?",
    acceptedAnswerText: "A functional kitchen design typically includes the work triangle concept (connecting sink, stove, and refrigerator), adequate storage solutions, proper lighting, and ergonomic workflow considerations."
  },
  {
    questionName: "How often should I renovate my kitchen?",
    acceptedAnswerText: "Kitchens typically need renovation every 10-15 years, depending on usage and quality of materials. Regular maintenance can extend this timeframe."
  },
  {
    questionName: "What are the best materials for kitchen countertops?",
    acceptedAnswerText: "Popular options include quartz, granite, marble, and solid surface materials. Choice depends on budget, usage patterns, and aesthetic preferences."
  },
  {
    questionName: "How can I maximize storage in a small kitchen?",
    acceptedAnswerText: "Use vertical storage solutions, install pull-out cabinets, utilize corner spaces with rotating shelves, and consider multi-functional furniture."
  }
];

  const [reviewRoom, setReviewRoom] = useState({});
  const [reviewData, setReviewData] = useState([]);

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRoommain`,
        {
          params: {
            roomType: params.replace(/-/g, " "),
          },
        }
      );
      setReviewRoom(response.data);
      
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };

  const getFaqData = () => {
    if (roomMain?.faqs?.length > 0) {
      return roomMain.faqs.map(faq => ({
        questionName: faq.question || "Kitchen design question",
        acceptedAnswerText: faq.answer || "Professional kitchen design considerations..."
      }));
    }
    return KITCHEN_FAQ_FALLBACK;
  };

  const renderFAQSchema = () => {
    if (!roomMain) return null;
    
    return (
      <FAQPageJsonLd
        mainEntity={getFaqData()}
        keyOverride="faq-structured-data"
      />
    );
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

  const handleSetItem = () => {
    const newItem = { label: params.replace(/-/g, " "), href: pathname };
    sessionStorage.setItem("navigationItem", JSON.stringify(newItem));
  };

  useEffect(() => {
    handleSetItem();
    fetchRoomData();
    fetchReviewData();
  }, [params]);

  useEffect(() => {
    if (!dataFetched) {
      dispatch({ type: "FETCH_ROOM_MAIN_DATA_REQUEST", payload: { params } });
      setDataFetched(true);
    }
    setRoomData(roomSelect);
    setProductData(productSelect);
    setRoomMain(roomMainSelect);
  }, [
    dispatch,
    params,
    dataFetched,
    roomSelect,
    productSelect,
    roomMainSelect,
  ]);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // add new

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

  // end new

 
  if (!roomMain || !roomMain.position || roomMain.position.length === 0) {
    return <ProductPageSkeleton />;
  }

  return (
    <main  className="w-full min-h-screen" role="document">
      {renderFAQSchema()}
      {roomMain && roomMain.position && roomMain.position.length > 0  ? (
        <div className="md:pt-10">
          {roomMain.position.map((sectionName, idx) => (
            <section
              key={idx}
              className="px-[20px] sm:px-[50px]"
              aria-labelledby={`section-${sectionName}`}
            >
              {sectionName === "heading" && (
                <div>
                  <div className="mt-40">
                    <h1
                      id={`section-${sectionName}`}
                      className="lg:text-[30px] lg:w-[70%] text-[24px] font-semibold"
                    >
                      {roomMain.heading}
                    </h1>
                    <p className="mt-5 line-clamp-3 lg:line-clamp-none lg:w-[90%]">
                      {roomMain.summary}
                    </p>
                    {roomMain?.author && (
  <div className="flex items-center gap-4 mt-5">
    {roomMain.author.image && (
      <Image
        src={roomMain.author.image}
        alt={roomMain.author.displayName}
        width={50}
        height={50}
        className="rounded-full object-cover"
      />
    )}
    <div>
      <p className="font-semibold text-lg">{roomMain.author.displayName}</p>
      {roomMain.author.role && (
        <p className="text-gray-500 text-sm">{roomMain.author.role}</p>
      )}
      {roomMain.author.authorDetails?.experience && (
        <p className="text-gray-500 text-sm">
          {roomMain.author.authorDetails.experience} years experience
        </p>
      )}
      {roomMain.author.authorDetails?.award && (
        <p className="text-gray-500 text-sm">
          Award: {roomMain.author.authorDetails.award}
        </p>
      )}
    </div>
  </div>
)}

                  </div>
                </div>
              )}
              {sectionName === "mainImage" && (
                <figure
                  className="mt-10 relative w-full h-[550px]"
                  aria-labelledby={`section-${sectionName}`}
                >
                  <TabImage
                    href={`/${roomMain.mainImage.productCategory.replace(
                      / /g,
                      "-"
                    )}/collection/all`}
                    src={roomMain.mainImage.imgSrc}
                    alt={`Main room image showing ${roomMain.mainImage.productCategory}`}
                    fill
                    width={1000}
                    height={1000}
                    style={{ objectFit: "cover" }}
                    labelData={roomMain.mainImage.children}
                    aria-describedby="main-image-description"
                  />
                  <span id="main-image-description" className="sr-only">
                    Interactive image showing products in a{" "}
                    {roomMain.mainImage.productCategory} setting
                  </span>
                </figure>
              )}
              {sectionName === "twoGrid" && (
                <section
                  className="mt-20"
                  aria-labelledby={`section-${sectionName}`}
                >
                  <h2
                    id={`section-${sectionName}`}
                    className="text-2xl font-semibold"
                  >
                    {roomMain.twoGrid.twoGridHeader}
                  </h2>
                  <p className="text-gray-700 mt-5 lg:w-[70%] line-clamp-3 lg:line-clamp-none">
                    {roomMain.twoGrid.twoGridDescription}
                  </p>
                  <div
                    className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between mx-auto"
                    role="list"
                    aria-label="Two room display grid"
                  >
                    {roomMain.twoGrid.twoGridRooms.map((room, index) => (
                      <figure
                        key={index}
                        className="relative h-[449px] lg:min-h-[730px] w-full"
                        role="listitem"
                      >
                        <TabImage
                          src={room.imgSrc}
                          href={`/${room.productCategory.replace(
                            / /g,
                            "-"
                          )}/collection/all`}
                          alt={`Room image for ${room.productCategory}`}
                          fill
                          width={1000}
                          height={1000}
                          style={{ objectFit: "cover" }}
                          labelData={room.children}
                          aria-label={`${room.productCategory} display`}
                        />
                      </figure>
                    ))}
                  </div>
                </section>
              )}
              {sectionName === "fiveGrid" && (
                <section
                  className="mt-20"
                  aria-labelledby={`section-${sectionName}`}
                >
                  <h2
                    id={`section-${sectionName}`}
                    className="text-2xl font-semibold"
                  >
                    {roomMain.fiveGrid.fiveGridHeader}
                  </h2>
                  <p className="text-gray-700 my-5 lg:w-[70%] line-clamp-3 lg:line-clamp-none">
                    {roomMain.fiveGrid.fiveGridDescription}
                  </p>
                  <div className="flex justify-between mb-10">
                    <div className="w-full flex justify-center max-h-[915px] screens">
                      <div
                        className="w-full lg:h-[730px] grid grid-cols-2 lg:grid-cols-12 gap-y-4 gap-x-4 auto-rows-fr"
                        role="list"
                        aria-label="Five room display grid"
                      >
                        {roomMain.fiveGrid.fiveGridRooms.map((room, index) => (
                          <div
                            key={index}
                            className={`parent ${
                              index === 0
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
                            role="listitem"
                            aria-label={`Room display ${index + 1}`}
                          >
                            <figure className="relative w-full h-full">
                              <TabImage
                                href={`/${room?.productCategory.replace(
                                  / /g,
                                  "-"
                                )}/collection/all`}
                                src={room.imgSrc}
                                alt={`Room image for ${room.productCategory}`}
                                width={1000}
                                height={338}
                                labelData={room.children}
                                hovered={hoveredIndex === index}
                                aria-label={`${room.productCategory} display`}
                                
                              />
                            </figure>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
              {sectionName === "firstSlider" && (
                <section aria-labelledby="first-slider-heading">
                  {roomMain.firstSlider && roomMain.firstSlider.length > 0 ? (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.firstSlider}
                      aria-label="Related products slider"
                    />
                  ) : (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.sliders.firstSlider.products}
                      title={roomMain.sliders.firstSlider.header}
                      description={roomMain.sliders.firstSlider.description}
                      descriptionLinks={
                        roomMain.sliders.firstSlider.descriptionLinks
                      }
                      aria-label="Related products slider"
                      id="first-slider-heading"
                    />
                  )}
                </section>
              )}
              {sectionName === "secondSlider" && (
                <section aria-labelledby="second-slider-heading">
                  {roomMain.secondSlider && roomMain.secondSlider.length > 0 ? (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.secondSlider}
                      aria-label="Second product collection"
                    />
                  ) : (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.sliders.secondSlider.products}
                      title={roomMain.sliders.secondSlider.header}
                      description={roomMain.sliders.secondSlider.description}
                      descriptionLinks={
                        roomMain.sliders.secondSlider.descriptionLinks
                      }
                      aria-label="Second product collection"
                      id="second-slider-heading"
                    />
                  )}
                </section>
              )}
              {sectionName === "thirdSlider" && (
                <section aria-labelledby="third-slider-heading">
                  {roomMain.thirdSlider && roomMain.thirdSlider.length > 0 ? (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.thirdSlider}
                      aria-label="Third product collection"
                    />
                  ) : (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.sliders.thirdSlider.products}
                      title={roomMain.sliders.thirdSlider.header}
                      description={roomMain.sliders.thirdSlider.description}
                      descriptionLinks={
                        roomMain.sliders.thirdSlider.descriptionLinks
                      }
                      aria-label="Third product collection"
                      id="third-slider-heading"
                    />
                  )}
                </section>
              )}
              {sectionName === "forthSlider" && (
                <section aria-labelledby="fourth-slider-heading">
                  {roomMain.forthSlider && roomMain.forthSlider.length > 0 ? (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.forthSlider}
                      aria-label="Fourth product collection"
                    />
                  ) : (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.sliders.forthSlider.products}
                      title={roomMain.sliders.forthSlider.header}
                      description={roomMain.sliders.forthSlider.description}
                      descriptionLinks={
                        roomMain.sliders.forthSlider.descriptionLinks
                      }
                      aria-label="Fourth product collection"
                      id="fourth-slider-heading"
                    />
                  )}
                </section>
              )}
              {sectionName === "fifthSlider" && (
                <section aria-labelledby="fifth-slider-heading">
                  {roomMain.fifthSlider && roomMain.fifthSlider.length > 0 ? (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.fifthSlider}
                      aria-label="Fifth product collection"
                    />
                  ) : (
                    <BlogRelatedProducts
                      relatedProducts={roomMain.sliders.fifthSlider.products}
                      title={roomMain.sliders.fifthSlider.header}
                      description={roomMain.sliders.fifthSlider.description}
                      descriptionLinks={
                        roomMain.sliders.fifthSlider.descriptionLinks
                      }
                      aria-label="Fifth product collection"
                      id="fifth-slider-heading"
                    />
                  )}
                </section>
              )}
            </section>
          ))}

          <section aria-label="Featured products">
            <RankedProducts />
          </section>

          {reviewData && (
            <section
              className="flex mt-20 lg:max-h-[490px] lg:flex-row w-full flex-col"
              aria-label="Customer review"
            >
              <figure className="lg:w-2/3 h-[446px]">
                {reviewRoom && (
                  <TabImage
                    src={reviewRoom.imgSrc}
                    alt={`Room setting showing ${
                      reviewRoom.productCategory || "featured products"
                    }`}
                    width={1000}
                    height={446}
                    labelData={reviewRoom.children}
                  />
                )}
              </figure>
              <aside
                className="lg:w-1/3 min-h-[363px] bg-zinc-100 p-10 lg:p-12"
                aria-label="Customer testimonial"
              >
                <div className="flex flex-col">
                  <blockquote>
                    <p>{reviewData && reviewData.comment}</p>
                  </blockquote>
                  <div className="flex mt-5 flex-row items-center gap-2">
                    <Image
                      loading="lazy"
                      src={reviewData && reviewData.image}
                      width={45}
                      height={45}
                      alt={`Profile photo of ${reviewData && reviewData.name}`}
                      className="aspect-square object-cover rounded-full"
                    />
                    <p>{reviewData && reviewData.name}</p>
                  </div>
                </div>
              </aside>
            </section>
          )}

          <section aria-label="Featured collections">
            <Multicard forhomePage={false} />
          </section>

          {productSelect && productSelect.length > 0 && (
            <section aria-label="Product selection tabs">
              <Tabs data={productSelect} />
            </section>
          )}

          {roomMain?.features && roomMain.features.length > 0 && (
            <section
              className="mt-20 px-5 sm:px-12"
              aria-labelledby="features-heading"
            >
              <h2 id="features-heading" className="text-2xl font-semibold">
                Features
              </h2>

              <article className="sm:w-3/4 py-3 w-full ">
          {roomMain?.features?.length > 0
            ? 
                <div  className="">
                  <div className="flex flex-col ">
                    <div>
                      <h2 className="text-[14px] font-medium text-[#6e6e73] mt-10">
                        {roomMain?.features[0]?.name || "Feature"}:
                      </h2>
                      <div className="text-[13px] text-[#6e6e73] pt-[3px] pb-[15px]">
                        {/* {roomMain?.features[0]?.description} */}
                        {renderFeatureDescription(roomMain?.features[0])}
                      </div>
                    </div>
                    <div className="w-full h-auto flex justify-start gap-6 flex-nowrap overflow-auto scrollbar-hidden bg-white" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {roomMain?.features[0]?.cards &&
  roomMain?.features[0]?.cards.map((card, cardIdx) => {
    let parsedCard;
    try {
      parsedCard = JSON.parse(card);
    } catch {
      parsedCard = { description: 'Invalid card', svgUrl: '' };
    }

    return (
      <div
        key={cardIdx}
        className="bg-white border-[1px] border-gray-200 text-[12px] text-black font-semibold pt-[3px] max-h-full min-w-[240px] max-w-[240px] aspect-square overflow-auto p-2 rounded-xl px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {parsedCard.svgUrl && (
          <img
            className="size-20 text-center mx-auto mt-6"
            src={parsedCard.svgUrl}
            alt=""
          />
        )}
        {cardDescriptionRenderer(parsedCard)}
      </div>
    );
  })}

                    </div>

                    {roomMain?.features[0]?.tip && (
                      <div className="bg-green-200 text-[12px] text-green-700 w-full mt-10 p-4">
                        <span className="font-bold">{roomMain.features[0].name} Tip :</span> {roomMain?.features[0]?.tip}
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
                            {card.svgUrl && (<img className="size-20 text-center mx-auto mt-6" src={card.svgUrl} alt=""/>)}
                            {cardDescriptionRenderer(card)}
                            {/* {Array.isArray(card.description)
        ? card.description.map((desc, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: desc }} />
          ))
        : <div dangerouslySetInnerHTML={{ __html: card.description }} />} */}
                          </div>
                        ))}
                    </div>

                    {feature.tip && (
                      <div className="bg-blue-400 text-[12px] text-white w-full mt-10 p-4">
                        <span className="font-bold">{feature.title} Tip :</span> {feature.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </article>

              {/* {roomMain.features.filter(
                (feature) => feature?.displayType === "card1"
              ).length > 0 && (
                <div
                  className="mt-6 w-full flex gap-4 overflow-x-auto pb-4"
                  role="list"
                  aria-label="Feature highlights with icons"
                >
                  {roomMain.features
                    .filter((feature) => feature?.displayType === "card1")
                    .map((feature, index) => {
                      const Icon =
                        feature?.icon && iconMap[feature.icon]
                          ? iconMap[feature.icon]
                          : null;
                      return (
                        <article key={index} className="h-full" role="listitem">
                          <div className="bg-white min-h-[200px] md:min-w-[20vw] min-w-[90vw] md:max-w-[30vw] max-w-[90vw] p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                            {Icon && (
                              <Icon
                                size={36}
                                className="mb-4 text-indigo-600"
                                aria-hidden="true"
                              />
                            )}
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {feature.name}
                            </h3>
                            <p className="text-gray-600 mt-2 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                </div>
              )}

              {roomMain.features.filter(
                (feature) => feature.displayType === "card2"
              ).length > 0 && (
                <div
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full"
                  role="list"
                  aria-label="Detailed feature cards"
                >
                  {roomMain.features
                    .filter((feature) => feature.displayType === "card2")
                    .map((feature, index) => (
                      <article key={index} className="h-full" role="listitem">
                        <div className="bg-white min-h-[350px] p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {feature.name}
                          </h3>
                          <p className="text-gray-600 mt-2 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </article>
                    ))}
                </div>
              )}

              {roomMain.features.filter(
                (feature) => feature.displayType === "tips"
              ).length > 0 && (
                <div
                  className="mt-8"
                  role="list"
                  aria-label="Helpful tips and recommendations"
                >
                  {roomMain.features
                    .filter((feature) => feature.displayType === "tips")
                    .map((feature, index) => (
                      <div
                        key={index}
                        className="w-full my-4 text-green-800 bg-green-500/25 p-4 border-l-4 border-green-800"
                        role="listitem"
                        aria-label={`Tip: ${feature.name}`}
                      >
                        <strong>{feature.name}:</strong> {feature.description}
                      </div>
                    ))}
                </div>
              )} */}


            </section>
          )}
        </div>
      ) : (
        <ProductPageSkeleton
          role="alert"
          aria-label="Loading product content"
        />
      )}
    </main>
  );
};

export default RoomsPage;
