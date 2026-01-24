"use client";
import React, { useState, useEffect } from "react";
import NavigationItem from "../ProductPage/NavigationItem";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./styles.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { setselectedproduct } from "../Features/Slices/compareSlice";
import {
  srtarr,
  categoryarr,
  wallpaperCollectionArr,
  flooringCollectionArr,
} from "./tabsArray";
import {
  renderSortItem,
  renderColor,
  renderOffer,
  renderDemand,
  renderSubCategory,
  renderPrice,
} from "./tabsRender";
import TabsProductContent from "../compounds/TabsProductContent";
import Measure from "./meausrement";
import axios from "axios";
import TabsProductCard from "./TabsProductCard";
import CategoryGrid from "./CategoryGrid";
import { selecteddbItems } from "../Features/Slices/cartSlice";
import { viewItemList } from "@/tag-manager/events/view_item_list";
import SubcategorySlider from "./SubcategorySlider";
import OfferSlider from "./OfferSlider";
import CardSkeleton from "../Cards/CardSkeleton";
import { FEATURES } from "@/constants/features";
import { CORE_VALUES } from "@/constants/coreValues";
import {
  smartConvertFeatures,
  smartConvertCoreValues,
} from "@/utils/convertIdsToData";

const Tabs = ({
  filteredProductData,
  heading,
  allTypes,
  subCategory,
  categoryName,
  h1title,
  pdesc,
  features,
  faq,
  description,
  setType,
  offerCategory,
  parentCategory,
  setSelectedOfferCategory,
  onPageChange,
  totalPages,
  currentPage,
  firstGrid,
  secondGrid,
  type,
  isSubcategoryPage,
  data,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  // Combined map state
  const [map, setMap] = useState([
    { title: "Flooring", rating: 4.9, members: 10570 },
    { title: "Wallpaper", rating: 4.7, members: 5500 },
    { title: "Curtains", rating: 4.6, members: 3000 },
    { title: "Window%20Blinds", rating: 4.8, members: 5000 },
    { title: "Carpet%20&%20Rugs", rating: 4.4, members: 3000 },
    { title: "Artificial%20Green", rating: 4.9, members: 13000 },
    { title: "Home%20furnishing", rating: 4.5, members: 15000 },
    { title: "Home%20Décor", rating: 4.5, members: 12000 },
    { title: "Dinnerware", rating: 4.1, members: 2500 },
    { title: "Kitchenware", rating: 4.3, members: 2700 },
    { title: "Floral-wallpapers", rating: 3.0, members: 4000 },
    { title: "Dining-room", rating: 4.5, members: 5000 },
    { title: "Vinyl-flooring", rating: 4.0, members: 6000 },
  ]);

  // State to hold the dynamically computed values
  const [firstPathPart, setFirstPathPart] = useState("");
  const [matchedItem, setMatchedItem] = useState(map[0]);

  // Initialize pathname and matchedItem on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path =
        window.location.pathname.split("/").filter((part) => part !== "")[0] ||
        "";
      setFirstPathPart(path);
      setMatchedItem(map.find((item) => item.title === path) || map[0]);
    } else {
      const path = pathname?.split("/").filter((part) => part !== "")[0] || "";
      setFirstPathPart(path);
      setMatchedItem(map.find((item) => item.title === path) || map[0]);
    }
  }, [pathname, map]);

  // Function to render star rating based on rating value
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Image
          key={`full-${i}`}
          src="/icons/star full black.svg"
          width={17}
          height={17}
          alt="Full star"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Image
          key="half"
          src="/icons/half black half white.svg"
          width={17}
          height={17}
          alt="Half star"
        />,
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Image
          key={`empty-${i}`}
          src="/icons/star full white.svg"
          width={17}
          height={17}
          alt="Empty star"
        />,
      );
    }

    return stars;
  };

  const formatMembers = (count) => {
    if (count >= 1000) {
      return `${Math.round(count / 1000)}k+ Happy Ayatrio Member`;
    }
    return `${count} Happy Ayatrio Member`;
  };

  const [filterData, setFilterdata] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allProductTypes, setAllProductTypes] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [allDemandType, setAllDemandType] = useState([]);
  const [allSubCategory, setAllSubcategory] = useState([]);
  const allPrices = [
    { name: "Less than 1000", value: 1000 },
    { name: "Less than 5000", value: 5000 },
    { name: "Less than 10000", value: 10000 },
    { name: "Less than 20000", value: 20000 },
    { name: "Less than 50000", value: 50000 },
    { name: "Less than 100000", value: 100000 },
  ];

  const [selectedResult, setselectedResult] = useState(0);
  const [clearSelectedResult, setClearSelectedResult] = useState(false);

  useEffect(() => {
    setFilterdata(filteredProductData || []);
    if (filteredProductData && filteredProductData.length > 0) {
      const colors = filteredProductData.flatMap(
        (product) => product.colors || [],
      );
      const uniqueColors = [...new Set(colors)];
      setAllColors(uniqueColors);

      const types = filteredProductData
        .map((product) => product.types)
        .filter((type) => type);
      const uniqueTypes = [...new Set(types)];
      setAllProductTypes(uniqueTypes);

      const offers = filteredProductData
        .map((product) => product.offer)
        .filter((offer) => offer);
      const uniqueOffers = [...new Set(offers)];
      setAllOffers(uniqueOffers);

      const demandTypes = filteredProductData
        .map((product) => product.demandtype)
        .filter((demandType) => demandType);
      const uniqueDemandTypes = [...new Set(demandTypes)];
      setAllDemandType(uniqueDemandTypes);

      const subcategory = filteredProductData
        .map((product) => product.subcategory)
        .filter((subcategory) => subcategory);
      const uniqueSubcategory = [...new Set(subcategory)];
      setAllSubcategory(uniqueSubcategory);
    }
  }, [filteredProductData]);

  const handleColorChange = (color) => {
    let filteredProducts = [];
    if (color === "all") {
      filteredProducts = filteredProductData || [];
    } else {
      filteredProducts = (filteredProductData || []).filter((product) =>
        product.colors?.includes(color),
      );
    }
    setFilterdata(filteredProducts);
    setClearSelectedResult(true);
    setselectedResult(filteredProducts?.length);
  };

  const handleSubCategoryChange = (selectedSubCategory) => {
    let filteredProducts = [];
    if (selectedSubCategory === "all") {
      filteredProducts = filteredProductData || [];
    } else {
      filteredProducts = (filteredProductData || []).filter(
        (product) => product.subcategory === selectedSubCategory,
      );
    }
    setFilterdata(filteredProducts);
    setClearSelectedResult(true);
    setselectedResult(filteredProducts?.length);
  };

  const handleTypeChange = (type) => {
    const filteredProducts = (filteredProductData || []).filter(
      (product) => product.type === type,
    );
    setFilterdata(filteredProducts);
  };

  const handleOfferChange = (offer) => {
    let filteredProducts = [];
    if (offer === "all") {
      filteredProducts = filteredProductData || [];
    } else {
      filteredProducts = (filteredProductData || []).filter(
        (product) => product.offer === offer,
      );
    }
    setFilterdata(filteredProducts);
    setClearSelectedResult(true);
    setselectedResult(filteredProducts?.length);
  };

  const handleDemandTypeChange = (demandType) => {
    let filteredProducts = [];
    if (demandType === "all") {
      filteredProducts = filteredProductData || [];
    } else {
      filteredProducts = (filteredProductData || []).filter(
        (product) => product.demandtype === demandType,
      );
    }
    setFilterdata(filteredProducts);
    setClearSelectedResult(true);
    setselectedResult(filteredProducts?.length);
  };

  const handlePriceChange = (price) => {
    let filteredProducts = [];
    if (price === "all") {
      filteredProducts = filteredProductData || [];
    } else {
      filteredProducts = (filteredProductData || []).filter((product) => {
        const priceToCompare =
          product.specialprice?.price ||
          product.discountedprice?.price ||
          product.perUnitPrice ||
          0;
        return priceToCompare <= price;
      });
    }
    setFilterdata(filteredProducts);
    setClearSelectedResult(true);
    setselectedResult(filteredProducts?.length);
  };

  const [activeTab, setActiveTab] = useState("all");
  const [openSort, setOpenSort] = useState(false);
  const [openSize, setOpenSize] = useState(false);
  const [openDemandType, setOpenDemandType] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openAll, setOpenAll] = useState(false);
  const [openOffer, setOpenOffer] = useState(false);
  const [openSubcategory, setOpenSubcategory] = useState(false);
  const [openAllSort, setOpenAllSort] = useState(false);
  const [openAllSize, setOpenAllSize] = useState(false);
  const [openAllDemandType, setOpenAllDemandType] = useState(false);
  const [openAllPrice, setOpenAllPrice] = useState(false);
  const [openAllOfferType, setOpenAllOfferType] = useState(false);
  const [openAllColor, setOpenAllColor] = useState(false);
  const [openAllCategory, setOpenAllCategory] = useState(false);
  const [openAllType, setOpenAllType] = useState(false);
  const [openAllSubCategory, setOpenAllSubCategory] = useState(false);
  const [openContent, setOpenContent] = useState(false);
  const [openWidth, setOpenWidth] = useState(false);
  const [openHeight, setOpenHeight] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState([]);
  const [selectedpdt, setSelectedpdt] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [activeCompare, setActiveCompare] = useState(true);
  const [filteredSubCategory, setFilteredSubCategory] = useState(null);
  const [offerCategoryData, setOfferCategoryData] = useState([]);

  const handleOpen = () => {
    if (
      !openSize &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openAll &&
      !openCategory &&
      !openOffer &&
      !openPrice
    ) {
      setOpenSort(!openSort);
    }
  };

  const handleSize = () => {
    if (
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openAll &&
      !openCategory &&
      !openOffer &&
      !openPrice
    ) {
      setOpenSize(!openSize);
    }
  };

  const handleDemandType = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openType &&
      !openAll &&
      !openCategory &&
      !openOffer &&
      !openPrice
    ) {
      setOpenDemandType(!openDemandType);
    }
  };

  const handlePrice = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openAll &&
      !openOffer
    ) {
      setOpenPrice(!openPrice);
    }
  };

  const handleColor = () => {
    if (
      !openSize &&
      !openSort &&
      !openDemandType &&
      !openType &&
      !openAll &&
      !openCategory &&
      !openOffer &&
      !openPrice
    ) {
      setOpenColor(!openColor);
    }
  };

  const handleCategory = () => {
    if (
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openAll &&
      !openSize &&
      !openOffer &&
      !openSubcategory &&
      !openPrice
    ) {
      setOpenCategory(!openCategory);
    }
  };

  const handleType = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openAll &&
      !openCategory &&
      !openOffer &&
      !openSubcategory &&
      !openPrice
    ) {
      setOpenType(!openType);
    }
  };

  const handleAll = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openCategory &&
      !openOffer &&
      !openSubcategory &&
      !openPrice
    ) {
      setOpenAll(true);
    }
  };

  const handleOffer = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openCategory &&
      !openAll &&
      !openSubcategory &&
      !openPrice
    ) {
      setOpenOffer(!openOffer);
    }
  };

  const handleSubCategory = () => {
    if (
      !openSize &&
      !openSort &&
      !openColor &&
      !openDemandType &&
      !openType &&
      !openCategory &&
      !openAll &&
      !openOffer &&
      !openPrice
    ) {
      setOpenSubcategory(!openSubcategory);
    }
  };

  const closeAll = () => {
    setOpenAll(false);
    setOpenAllType(false);
    setOpenAllCategory(false);
    setOpenAllColor(false);
    setOpenAllSize(false);
    setOpenAllSort(false);
    setOpenOffer(false);
  };

  const handleAllSort = () => setOpenAllSort(!openAllSort);
  const handleAllSize = () => setOpenAllSize(!openAllSize);
  const handleAllDemandType = () => setOpenAllDemandType(!openAllDemandType);
  const handleAllPrice = () => setOpenAllPrice(!openAllPrice);
  const handleAllOfferType = () => setOpenAllOfferType(!openAllOfferType);
  const handleAllColor = () => setOpenAllColor(!openAllColor);
  const handleAllCategory = () => setOpenAllCategory(!openAllCategory);
  const handleAllType = () => setOpenAllType(!openAllType);
  const handleAllSubCategory = () => setOpenAllSubCategory(!openAllSubCategory);
  const handleContent = () => setOpenContent(!openContent);
  const handleWidth = () => setOpenWidth(!openWidth);
  const handleHeight = () => setOpenHeight(!openHeight);

  const handleClick = (idx) => {
    setSelectedCircle((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx],
    );
  };

  const handleCheckbox = (item, isChecked) => {
    setSelectedpdt((prev) =>
      isChecked ? [...prev, item] : prev.filter((i) => i._id !== item._id),
    );
  };

  const handleCompareClick = () => {
    if (selectedpdt.length >= 2) {
      dispatch(setselectedproduct(selectedpdt));
      router.push(pathname + "/compare2");
      setShowCompare(true);
      setActiveCompare(false);
    } else {
      alert("Please select minimum two items");
    }
  };

  const cartData = useSelector(selecteddbItems);
  const isProductInCart = (productId) =>
    cartData?.items?.some((cartItem) => cartItem?.productId?._id === productId);

  const handleFilterColor = (text) => {
    const newFilteredData = (filterData || []).filter((data) =>
      data.productImages?.some((imageSet) => imageSet.color === text),
    );
    setFilterdata(newFilteredData);
  };

  const handleRemoveAllFilters = () => {
    setFilterdata(filteredProductData || []);
    setOpenAll(false);
    setSelectedResult(0);
    setClearSelectedResult(false);
  };

  const handleViewResult = () => {
    setOpenAll(false);
    setSelectedResult(0);
  };

  const handleSorting = (selectedOption) => {
    let filterer = [...(filterData || [])];

    if (selectedOption.name === "Best match") {
      filterer = [...(filteredProductData || [])];
    } else if (selectedOption.name === "Price: high to low") {
      filterer.sort((a, b) => (a.perUnitPrice || 0) - (b.perUnitPrice || 0));
    } else if (selectedOption.name === "Price: low to high") {
      filterer.sort((a, b) => (b.perUnitPrice || 0) - (a.perUnitPrice || 0));
    } else if (selectedOption.name === "Newest") {
      filterer.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (selectedOption.name === "Name") {
      filterer.sort((a, b) =>
        (a.productTitle || "").localeCompare(b.productTitle || ""),
      );
    }
    setFilterdata(filterer);
    setSelectedResult(filterer?.length);
  };

  const collectionArr =
    heading === "Wallpaper" ? wallpaperCollectionArr : flooringCollectionArr;

  useEffect(() => {
    if (filterData && filterData.length > 0) {
      viewItemList({
        items: filterData.map((product) => ({
          item_id: product._id,
          item_name: product.productTitle || "",
          item_category: product.category || "",
          price: product.perUnitPrice || 0,
          currency: "INR",
          quantity: 1,
        })),
        itemListId: `category-${parentCategory || ""}`,
        itemListName: parentCategory || "",
      });
    }
  }, [filterData]);

  useEffect(() => {
    if (isSubcategoryPage) {
      const filtered = subCategory?.filter(
        (sub) => sub.name === pathname?.split("/")[1]?.replace(/-/g, " "),
      );
      setFilteredSubCategory(filtered || null);
    } else if (pathname?.split("/")[3] !== "all") {
      const filtered = subCategory?.filter(
        (data) => data.name === pathname?.split("/")[3]?.replace(/-/g, " "),
      );
      setFilteredSubCategory(filtered || null);
    }
  }, [subCategory, pathname]);

  useEffect(() => {
    const fetchOfferCategory = async () => {
      try {
        const apiUrl = `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/api/getAllCategoryByOffer/${encodeURI(type || "")}`;
        const response = await axios.get(apiUrl);
        setOfferCategoryData(response.data || []);
      } catch (error) {
        console.error("Error fetching offer category:", error.message);
        setOfferCategoryData([]);
      }
    };
    if (parentCategory === "offers") {
      fetchOfferCategory();
    }
  }, [type]);

  const renderDescription = (description) => {
    if (!description) return null;
    if (Array.isArray(description)) {
      return description.map((desc, index) => desc || "");
    }
    return description;
  };

  const renderPdescDescription = (pdesc) => {
    if (!pdesc?.description) return null;
    return pdesc.description || "";
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

    const descriptionText = feature.description?.[0]
      ? stripHtmlTags(feature.description[0])
      : "";

    switch (feature.displayType) {
      case "Tip":
        // Only render as Tip if explicitly marked as Tip and no HTML table
        if (!hasHtml(feature.description?.[0])) {
          return (
            <div
              key={feature._id}
              style={{
                padding: "20px",
                margin: "10px",
                borderLeft: "4px solid #0152be",
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
        if (hasHtml(feature.description?.[0])) {
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
                  __html: feature.description?.[0] || "",
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
              width: "100%",

              borderRadius: "10px",
              textAlign: "left",
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
                  marginLeft: "0",
                }}
              />
            )}
            {/* <h3
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#333",
                textAlign: "left",
              }}
            >
              {feature.title}
            </h3> */}
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.5",
                textAlign: "left",
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
        className="card-description text-[12px] text-gray-700 w-full"
        style={{
          width: "100%",
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

  const handleSubcategorySelect = (subcategory) => {
    setFilteredSubCategory([subcategory]);
  };

  const renderPaginationControls = () => {
    const pages = [];
    if (totalPages > 1) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        pages.push(
          <button
            key={i}
            className={`text-center text-[14px] font-semibold border max-w-fit bg-gray-100 cursor-pointer px-[24px] py-[0.65rem] mr-2.5 rounded-full ${
              currentPage === i ? "bg-gray-200" : ""
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>,
        );
      }
    }
    return pages;
  };

  const commonClasses =
    "px-[24px] py-[0.65rem] mr-2.5 rounded-full flex whitespace-nowrap";

  return (
    <main>
      <div className="md:px-[52px] sm:px-[20px] px-[12px]">
        <section className="flex flex-col overflow-hidden">
          <div className="md:mt-36 mt-10" />
          <h1 className="Blinds font-semibold text-2xl lg:pt-[30px] capitalize">
            {!isSubcategoryPage
              ? h1title || heading
              : filteredSubCategory?.length > 0
                ? filteredSubCategory[0]?.h1title
                : h1title || heading}
          </h1>
          <div className="mt-1 flex items-center pb-[30px]">
            <div className="star-rating flex gap-1">
              {renderStars(matchedItem.rating)}
              <p className="ml-1 font-bold text-lg">
                {matchedItem.rating.toFixed(1)}
              </p>
            </div>
            <span className="text-sm ml-1 font-medium text-gray-500">
              ({formatMembers(matchedItem.members)})
            </span>
          </div>

          <div className="flex items-center">
            {!subCategory &&
              offerCategoryData.length === 0 &&
              allTypes.length === 0 && (
                <div className="group flex flex-col justify-start gap-6 mb-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-32 bg-gray-100"></div>
                    <div className="h-20 w-32 bg-gray-100"></div>
                    <div className="h-20 w-32 bg-gray-100"></div>
                    <div className="h-20 w-32 bg-gray-100"></div>
                  </div>
                </div>
              )}
            {subCategory ? (
              <div className="group flex flex-row items-center justify-start gap-2 mb-4">
                <SubcategorySlider
                  pathname={pathname}
                  subCategory={subCategory}
                  filteredSubCategory={filteredSubCategory}
                  setType={setType}
                  onSubcategoryClick={() => {}}
                  onSubcategorySelect={handleSubcategorySelect}
                  title={heading}
                  isSubcategoryPage={isSubcategoryPage}
                  parentCategory={parentCategory}
                />
              </div>
            ) : parentCategory === "offers" && offerCategoryData.length > 0 ? (
              <div className="group flex flex-row items-center justify-start gap-2 mb-4 w-full">
                <OfferSlider
                  offerCategoryData={offerCategoryData}
                  setSelectedOfferCategory={setSelectedOfferCategory}
                  subCategory={subCategory}
                />
              </div>
            ) : parentCategory === "demandtype" && allTypes.length > 0 ? (
              <div className="mt-2 grid mb-4 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 gap-y-4">
                {allTypes.map((type, idx) => (
                  <div key={idx} className="gap-2">
                    <div className="flex items-center gap-4 cursor-pointer">
                      <h1
                        onClick={() => setType(type)}
                        className="text-black bg-zinc-200 hover:bg-zinc-100 px-4 py-2"
                      >
                        {type}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <p className="leading-2 mb-4 text-[14px] pt-[5px] lg:w-[90%] line-clamp-3">
          {!isSubcategoryPage
            ? renderPdescDescription(pdesc)
            : filteredSubCategory?.length > 0
              ? renderPdescDescription(filteredSubCategory[0]?.pdesc)
              : renderPdescDescription(pdesc)}
        </p>

        {openAll && <div className="background-overlay open"></div>}

        <section className="flex sticky top-0 z-[9996] bg-white py-2 sm:py-4 overflow-x-auto md:overflow-x-visible mb-[5px] md:mb-0">
          {filteredProductData?.length === 0 || !filteredProductData ? (
            <div className="overflow-x-auto flex items-center gap-4 w-full">
              <div className="w-24 h-10 rounded-full bg-gray-100"></div>
              <div className="w-24 h-10 rounded-full bg-gray-100"></div>
              <div className="w-24 h-10 rounded-full bg-gray-100"></div>
              <div className="w-24 h-10 rounded-full bg-gray-100"></div>
            </div>
          ) : (
            <>
              <TabsProductContent
                filterName={"Sort"}
                commonClasses={commonClasses}
                isFilterOpen={openSort}
                handleAll={handleAll}
                handleTabClick={setActiveTab}
                handleFilter={handleOpen}
                handleAllFilter={handleAllSort}
                filterArr={srtarr}
                renderFilter={(text, idx) =>
                  renderSortItem(text, idx, handleSorting)
                }
              />
              {allSubCategory.length > 0 && (
                <TabsProductContent
                  filterName={"Styles"}
                  commonClasses={commonClasses}
                  isFilterOpen={openSubcategory}
                  handleAll={handleAll}
                  handleTabClick={setActiveTab}
                  handleFilter={handleSubCategory}
                  handleAllFilter={handleAllSubCategory}
                  filterArr={allSubCategory}
                  renderFilter={(text, idx) =>
                    renderSubCategory(
                      text,
                      idx,
                      handleSubCategoryChange,
                      allSubCategory.length,
                    )
                  }
                />
              )}
              {allColors.length > 0 && (
                <TabsProductContent
                  filterName={"Colors"}
                  commonClasses={commonClasses}
                  isFilterOpen={openColor}
                  handleAll={handleAll}
                  handleTabClick={setActiveTab}
                  handleFilter={handleColor}
                  handleAllFilter={handleAllColor}
                  filterArr={allColors}
                  renderFilter={(text, idx) =>
                    renderColor(text, idx, handleColorChange, allColors.length)
                  }
                />
              )}
              {allOffers.length > 0 && (
                <TabsProductContent
                  filterName={"Offers"}
                  commonClasses={commonClasses}
                  isFilterOpen={openOffer}
                  handleAll={handleAll}
                  handleTabClick={setActiveTab}
                  handleFilter={handleOffer}
                  handleAllFilter={handleAllOfferType}
                  filterArr={allOffers}
                  renderFilter={(text, idx) =>
                    renderOffer(text, idx, handleOfferChange, allOffers.length)
                  }
                  openContent={openContent}
                  handleContent={handleContent}
                />
              )}
              {allDemandType.length > 0 && (
                <TabsProductContent
                  filterName={"New"}
                  commonClasses={commonClasses}
                  isFilterOpen={openDemandType}
                  handleAll={handleAll}
                  handleTabClick={setActiveTab}
                  handleFilter={handleDemandType}
                  handleAllFilter={handleAllDemandType}
                  filterArr={allDemandType}
                  renderFilter={(text, idx) =>
                    renderDemand(
                      text,
                      idx,
                      handleDemandTypeChange,
                      allDemandType.length,
                    )
                  }
                />
              )}
              {allPrices.length > 0 && (
                <TabsProductContent
                  filterName={"Price"}
                  commonClasses={commonClasses}
                  isFilterOpen={openPrice}
                  handleAll={handleAll}
                  handleTabClick={setActiveTab}
                  handleFilter={handlePrice}
                  handleAllFilter={handleAllPrice}
                  filterArr={allPrices}
                  renderFilter={(text, idx) =>
                    renderPrice(text, idx, handlePriceChange, allPrices.length)
                  }
                />
              )}
              <div>
                <button
                  onClick={() => {
                    handleAll();
                    setActiveTab("");
                  }}
                  className={`Tabbtn z-0 gap-[10px]  bg-gray-100 ${
                    openAll
                      ? "active-tabs border border-black px-[24px]  text-[14px] font-medium"
                      : "tabS border border-white px-[24px] text-[14px] font-medium"
                  } ${commonClasses}`}
                >
                  All Filters
                  <Image
                    loading="lazy"
                    src="/icons/filter.svg"
                    width={20}
                    height={20}
                    className="w-4 h-4 mt-1 sm:block hidden"
                    alt="icon"
                  />
                </button>
              </div>
            </>
          )}
        </section>

        {openAll && (
          <div className="menu-overlay z-[9999] bg-white border-2 fixed sm:w-[30vw] w-[100vw] sm:h-[100vh] h-[80vh] right-0 bottom-0">
            <div className="flex border-b py-4 mb-10 w-full items-center justify-center">
              <p className="text-center text-[16px] text-[#111111] font-semibold">
                Filter and sort
              </p>
              <Image
                loading="lazy"
                className="absolute right-3 px-[2px]"
                src="/icons/cancel.svg"
                width={20}
                height={20}
                onClick={closeAll}
                alt="close icon"
              />
            </div>
            <div className="menu-option bg-white overflow-y-scroll mb-[20rem] min-h-fit max-h-[50vh] md:max-h-[70vh] pt-5 w-[100%] border-slate-600 z-50">
              <div className="flex flex-col gap-6 px-4">
                <div className="flex flex-col gap-7">
                  <div
                    onClick={handleAllSort}
                    className="flex justify-between text-left text-[14px] font-semibold"
                  >
                    Sort
                    <Image
                      loading="lazy"
                      src="/icons/downarrow.svg"
                      width={20}
                      height={20}
                      className={`w-5 h-5 mt-1 ${
                        openAllSort ? "rotate-90" : "-rotate-90"
                      }`}
                      alt="arrow icon"
                    />
                  </div>
                  {openAllSort && (
                    <div className="flex flex-col gap-7">
                      {srtarr.map((text, idx) =>
                        renderSortItem(text, idx, handleSorting),
                      )}
                    </div>
                  )}
                </div>
                <hr />
                {heading === "Wallpaper" && (
                  <>
                    <div className="flex flex-col gap-7">
                      <div
                        onClick={handleAllCategory}
                        className="flex justify-between text-left"
                      >
                        Design style
                        <Image
                          loading="lazy"
                          src="/icons/downarrow.svg"
                          width={20}
                          height={20}
                          className={`w-5 h-5 mt-1 ${
                            openAllCategory ? "rotate-45" : "-rotate-180"
                          }`}
                          alt="arrow icon"
                        />
                      </div>
                      {openAllCategory && (
                        <div className="flex flex-col gap-7">
                          {categoryarr.map((item, idx) => (
                            <div key={idx}>{item}</div>
                          ))}
                        </div>
                      )}
                    </div>
                    <hr />
                  </>
                )}
                {allColors.length > 0 && (
                  <div className="flex flex-col gap-7">
                    <div
                      onClick={handleAllColor}
                      className="flex justify-between text-left text-[14px] font-semibold"
                    >
                      Color
                      <Image
                        loading="lazy"
                        src="/icons/downarrow.svg"
                        width={40}
                        height={40}
                        className={`w-5 h-5 mt-1 ${
                          openAllColor ? "rotate-90" : "-rotate-90"
                        }`}
                        alt="arrow icon"
                      />
                    </div>
                    {openAllColor && (
                      <div className="flex flex-col gap-7">
                        {allColors.map((text, idx) =>
                          renderColor(text, idx, handleColorChange),
                        )}
                      </div>
                    )}
                  </div>
                )}
                <hr />
                {allDemandType.length > 0 && (
                  <div className="flex flex-col gap-7">
                    <div
                      onClick={handleAllDemandType}
                      className="flex justify-between text-left text-[14px] font-semibold"
                    >
                      Latest
                      <Image
                        loading="lazy"
                        src="/icons/downarrow.svg"
                        width={40}
                        height={40}
                        className={`w-5 h-5 mt-1 ${
                          openAllDemandType ? "rotate-90" : "-rotate-90"
                        }`}
                        alt="arrow icon"
                      />
                    </div>
                    {openAllDemandType && (
                      <div className="flex flex-col gap-7">
                        {allDemandType.map((text, idx) =>
                          renderDemand(text, idx, handleDemandTypeChange),
                        )}
                      </div>
                    )}
                  </div>
                )}
                <hr />
                {allOffers.length > 0 && (
                  <div className="flex flex-col gap-7">
                    <div
                      onClick={handleAllOfferType}
                      className="flex justify-between text-left text-[14px] font-semibold"
                    >
                      Offer
                      <Image
                        loading="lazy"
                        src="/icons/downarrow.svg"
                        width={40}
                        height={40}
                        className={`w-5 h-5 mt-1 ${
                          openAllOfferType ? "rotate-90" : "-rotate-90"
                        }`}
                        alt="arrow icon"
                      />
                    </div>
                    {openAllOfferType && (
                      <div className="flex flex-col gap-7">
                        {allOffers.map((text, idx) =>
                          renderOffer(text, idx, handleOfferChange),
                        )}
                      </div>
                    )}
                  </div>
                )}
                <hr />
                {allPrices.length > 0 && (
                  <div className="flex flex-col gap-7">
                    <div
                      onClick={handleAllPrice}
                      className="flex justify-between text-left text-[14px] font-semibold"
                    >
                      Price
                      <Image
                        loading="lazy"
                        src="/icons/downarrow.svg"
                        width={40}
                        height={40}
                        className={`w-5 h-5 mt-1 ${
                          openAllPrice ? "rotate-90" : "-rotate-90"
                        }`}
                        alt="arrow icon"
                      />
                    </div>
                    {openAllPrice && (
                      <div className="flex flex-col gap-7">
                        {allPrices.map((text, idx) =>
                          renderPrice(
                            text,
                            idx,
                            handlePriceChange,
                            allPrices.length,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
                <hr />
              </div>
            </div>
            <div className="flex bg-white z-50 flex-col absolute bottom-0 left-0 right-0 items-center justify-center gap-3 pt-3 px-4 pb-2">
              <button
                onClick={handleViewResult}
                className="bg-black text-white w-full h-9 text-[14px] font-semibold rounded-full"
              >
                View {selectedResult}
              </button>
              <button
                onClick={handleRemoveAllFilters}
                className={`${
                  clearSelectedResult
                    ? "bg-white border-[1.5px] border-black"
                    : "bg-[#929292] opacity-50"
                } text-[14px] font-semibold text-black w-full h-9 rounded-full`}
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <section className="flex flex-col image-product">
          <div className="text-right">
            {showCompare && (
              <button
                onClick={handleCompareClick}
                disabled={selectedpdt.length < 2}
                className={`bg-black text-white px-3 py-2 whitespace-nowrap rounded-full ${
                  selectedpdt.length < 2 ? "bg-gray-300" : ""
                }`}
              >
                Compare Products
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 cursor-pointer gap-x-4 py-1 sm:py-3 gap-y-8">
            {filterData && filterData.length > 0 ? (
              filterData.map((text, idx) => {
                const inCart = isProductInCart(text?._id);
                return (
                  <>
                    <TabsProductCard
                      key={text._id}
                      id={text._id}
                      text={text}
                      totalPrice={text.totalPrice}
                      discountedprice={text.discountedprice}
                      specialprice={text.specialprice}
                      productDescription={text.productDescription}
                      productTitle={text.productTitle}
                      productImages={text.productImages}
                      images={text.images}
                      productId={text.productId}
                      idx={idx}
                      handlenav={() => {}}
                      selectedpdt={selectedpdt}
                      handleCheckbox={handleCheckbox}
                      setShowcompare={setShowCompare}
                      demandtype={text.demandtype}
                      ratings={text.ratings}
                      stars={renderStars(matchedItem.rating)}
                      parentCategory={parentCategory}
                      offer={text.offer}
                      inCart={inCart}
                      shortDescription={text.shortDescription}
                      perUnitPrice={text.perUnitPrice}
                      productType={text.productType}
                      urgency={text.urgency}
                      unitType={text.unitType}
                      expectedDelivery={text.expectedDelivery}
                      faqs={text.faqs}
                    />
                    {/* {firstGrid && idx === 2 && <CategoryGrid grid={firstGrid} />}
                    {secondGrid && idx === 6 && (
                      <CategoryGrid grid={secondGrid} />
                    )} */}
                    {firstGrid &&
                      Object.keys(firstGrid).length > 0 &&
                      idx === 2 && <CategoryGrid grid={firstGrid} />}
                    {secondGrid &&
                      Object.keys(secondGrid).length > 0 &&
                      idx === 6 && <CategoryGrid grid={secondGrid} />}
                  </>
                );
              })
            ) : (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            )}
          </div>

          {filteredProductData?.length > 0 && (
            <Measure category={filteredProductData[0].category} />
          )}

          <div className="self-center flex items-center gap-2 mt-20">
            {renderPaginationControls()}
          </div>
        </section>
      </div>

      <div className="md:px-[52px] sm:ml-[12px] ml-[12px] md:ml-[0px] bg-[#ffffff]">
        <div className="md:mt-[100px] mt-[80px]">
          <NavigationItem
            product={
              filteredProductData && filteredProductData.length > 0
                ? {
                    category:
                      parentCategory || filteredProductData[0]?.category || "",
                    subcategory: isSubcategoryPage
                      ? pathname?.split("/")[1]?.replace(/-/g, " ") || ""
                      : "",
                    productTitle: "",
                  }
                : {
                    category: parentCategory || "",
                    subcategory: "",
                    productTitle: "",
                  }
            }
          />
        </div>

        <div>
          {Array.isArray(subCategory) && subCategory.length > 0 ? (
            subCategory.map((sub) => {
              const pageUrl = `/${sub.name?.replace(
                / /g,
                "-",
              )}/subcollection/${parentCategory?.replace(/ /g, "-")}`;
              return (
                <a
                  key={sub._id}
                  href={pageUrl}
                  className="text-[#0152be] font-medium text-[14px] py-3"
                >
                  {sub.name}
                </a>
              );
            })
          ) : (
            <p className="text-[#2874f0] py-3"></p>
          )}
        </div>
      </div>

      <section className="md:mx-[52px] sm:mx-[20px] mx-[10px] bg-[#ffffff] sm:flex-row flex flex-col gap-7 mt-6">
        <article className="sm:w-3/4  w-full ">
          {!isSubcategoryPage && features?.length > 0
            ? features.map((feature, featureIdx) => (
                <div key={featureIdx} className="">
                  <div className="flex flex-col ">
                    <div>
                      <h2 className="text-[14px] font-bold text-[#414040] mt-2">
                        {feature.title || "Feature"}:
                      </h2>
                      <div className="text-[13px] text-[#6e6e73]">
                        {renderFeatureDescription(feature)}
                      </div>
                    </div>
                    <div
                      className="w-full h-auto flex justify-start gap-6 flex-nowrap overflow-auto scrollbar-hidden bg-white"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {feature.cards &&
                        feature.cards.map((card, cardIdx) => (
                          <div
                            key={cardIdx}
                            className={`bg-white border-[1px] border-gray-200  text-[12px] text-black font-semibold pt-[3px] max-h-[300px] ${feature.cards.length === 1 ? "w-full" : "min-w-[240px] max-w-[240px]"} overflow-auto rounded-xl `}
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {card.svgUrl && (
                              <img
                                className="size-20 text-center mx-auto mt-6"
                                src={card.svgUrl}
                                alt=""
                              />
                            )}
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
                        <span className="font-bold">{feature.title} Tip :</span>{" "}
                        {feature.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))
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
                    <div
                      className="w-full h-auto flex justify-start gap-6 flex-nowrap overflow-auto scrollbar-hidden bg-white"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {feature.cards &&
                        feature.cards.map((card, cardIdx) => (
                          <div
                            key={cardIdx}
                            className={`bg-white border-[1px] border-gray-200  text-[12px] text-black font-semibold pt-[3px] max-h-[300px] ${feature.cards.length === 1 ? "w-full" : "min-w-[240px] max-w-[240px]"} overflow-auto p-2 rounded-xl px-8`}
                            style={{
                              scrollbarWidth: "none",
                              msOverflowStyle: "none",
                            }}
                          >
                            {card.svgUrl && (
                              <img
                                className="size-20 text-center mx-auto mt-6"
                                src={card.svgUrl}
                                alt=""
                              />
                            )}
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
                        <span className="font-bold">{feature.title} Tip :</span>{" "}
                        {feature.tip}
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </article>

        <article className="sm:w-1/4 py-3 w-full">
          <h2 className="mb-[10px] text-[#707072] font-medium  text-[14px]">
            {filterData && filterData.length > 0 && filterData[0].category
              ? `${filterData[0].category} Price List`
              : "Wallpapers Price List"}
          </h2>
          <hr />

          {filterData && filterData.length > 0 && filterData[0].category && (
            <div className="border-gray-950 flex justify-between py-3 pr-3">
              <p className="text-[#707072]  text-[14px]">
                {filterData[0].category}
              </p>
              <p className="text-[#707072]  text-[14px]">Price</p>
            </div>
          )}
          <hr />

          {filterData && filterData.length > 0 ? (
            filterData.slice(0, 10).map((text, idx) => {
              const pageUrl = `/${text.productTitle?.replace(/ /g, "-")}/${
                text.productId
              }`;
              return (
                <div
                  key={text._id}
                  className="border-gray-950 flex justify-between py-3 pr-3"
                >
                  <p className="text-[#878787]  text-[14px]">
                    {idx + 1}.{" "}
                    <span className="text-[#0152be]">
                      <a href={pageUrl}>{text.productTitle || "Product"}</a>
                    </span>
                  </p>
                  <p className="text-[#878787]  text-[14px]">
                    Rs.{" "}
                    {text.discountedprice?.price || text.perUnitPrice || "N/A"}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-[50vh] w-full">
              <h3 className="text-2xl">No products available</h3>
            </div>
          )}
        </article>
      </section>

      <div className="md:px-[52px] sm:ml-[12px] ml-[12px] md:ml-[0px] bg-[#ffffff]">
        {(faq?.length > 0 ||
          (filteredSubCategory && filteredSubCategory[0]?.faq?.length > 0)) && (
          <h2 className="text-[#000000] font-semibold text-[16px] lg:pt-[30px] capitalize">
            Question and Answers
          </h2>
        )}

        {!isSubcategoryPage && faq?.length > 0
          ? faq.map((item, index) => (
              <div key={`${item._id}_${index}`} className="mt-2">
                <div className="text-[14px] tracking-normal text-[#000000] py-2">
                  <h2 className="font-medium text-[#6e6e73]">
                    Q. {item.question || item.heading || "Question"}?
                  </h2>
                  <h3 className="w-4/5 pt-[5px] text-[#6e6e73]">
                    A. {item.answer || item.description || "Answer"}.
                  </h3>
                </div>
              </div>
            ))
          : filteredSubCategory &&
            filteredSubCategory[0]?.faq?.length > 0 &&
            filteredSubCategory[0]?.faq.map((faqItem) => (
              <div key={faqItem._id} className="mt-4">
                <div className="text-[14px] text-[#000000]">
                  <h2 className="text-[14px] font-medium text-[#6e6e73]">
                    Q. {faqItem.question || faqItem.heading || "Question"}
                  </h2>
                  <h3 className="text-[#6e6e73]">
                    A. {faqItem.answer || faqItem.description || "Answer"}
                  </h3>
                </div>
              </div>
            ))}
      </div>
    </main>
  );
};

export default Tabs;
