"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import "../MainSlider/Mainslidestyle.css";
// import work from "@/public/images/work.webp";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabImage from "./TabImage";
import "./tabs.css";

const FALLBACK_IMAGE = "";

// Repeating layout pattern for the grid. "tab" renders a tall TabImage tile,
// "image" renders a plain Image tile. This repeats for every batch of 6 items,
// so the grid scales to however many items are actually returned by the API.
const GRID_PATTERN = ["tab", "image", "tab", "tab", "image", "image"];

const Tabs = ({ data }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  const [newdata, setNewData] = useState([]);

  // console.log(data)

  useEffect(() => {
    fetchAllRoom();
  }, []);

  const fetchAllRoom = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getTabsRoom`,
      );
      setNewData(response.data);
    } catch (error) {
      // console.log(error);
    }
  };

  // useEffect(() => {
  //   if (data) {
  //     const defaultActiveTab = data[0]?.roomCategory[0]?.toLowerCase();
  //     setActiveTab(defaultActiveTab);
  //   }
  // }, [data]);

  const navbarRef = useRef(null);

  useEffect(() => {
    let throttleTimeout = null;

    const handleScroll = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;

          const navbar = navbarRef.current; // Access the navbar element using the ref
          if (navbar) {
            const navbarTop = navbar.getBoundingClientRect().top;
            const elementVisible =
              navbarTop <= 0 && navbarTop + navbar.clientHeight > 0;
            setIsSticky(elementVisible);
          }
        }, 200); // Adjust throttle time interval (in milliseconds)
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const recommendedProducts = newdata.flatMap((product) => product.roomType);

  const tabsData = [];
  const tabImages = {};
  const labelData = {};

  let uniqueRoomCategories = [...new Set(recommendedProducts)];

  // console.log(uniqueRoomCategories)

  uniqueRoomCategories?.forEach((category) => {
    const products = newdata.filter((item) => item.roomType.includes(category));

    // console.log(products)

    // const sorted = products.sort((a, b) => b.popularity - a.popularity)
    // console.log(sorted)
    if (products.length > 0) {
      // products.sort((a, b) => parseInt(b.productObjectId.popularity) - parseInt(a.productObjectId.popularity));
      const images = products.map((product) => product.imgSrc);
      const labels = products.map((product) => {
        // const { productTitle, perUnitPrice } = product;
        const productTitle = product.children[0].productTitle;
        const perUnitPrice = product.children[0].productPrice;
        const topPosition = product.children[0].topPosition;
        const leftPosition = product.children[0].leftPosition;
        const productLink = product.children[0].productLink;
        const status = product.children[0].status;
        return {
          productTitle,
          productCategory: category,
          productPrice: perUnitPrice,
          topPosition,
          leftPosition,
          productLink,
          status,
        };
      });
      tabsData.push({
        key: category.toLowerCase(),
        label: category,
        img: images[0], // Assuming you want to use the first image as the main image
      });
      // Set tabImages and labelData for the current category
      tabImages[category.toLowerCase()] = images;
      // console.log("tabImages", tabImages);
      labelData[category.toLowerCase()] = labels;
    }
  });

  uniqueRoomCategories = uniqueRoomCategories.map((category) =>
    category.toLowerCase(),
  );

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTab = (productLink) => {
    // router.push(/${productLink});
    // console.log(productLink);
  };

  // console.log("tabsData", tabsData);
  // console.log("tabImages", tabImages);
  // console.log("labelDatazzz", labelData)
  const [loadMoreAll, setLoadMoreAll] = useState(false);
  const handleLoadMoreAll = () => {
    setLoadMoreAll(true);
  };
  const [loadMore, setLoadMore] = useState(false);
  const handleLoadMore = () => {
    setLoadMore(true);
  };

  // console.log(tabImages);
  // console.log(isSticky);

  // --- Dynamic data assembly -------------------------------------------
  // "All" tab: max 2 representative items per roomType category.
  const allItems = uniqueRoomCategories.flatMap((category) => {
    const images = tabImages[category] || [];
    const labels = labelData[category] || [];

    return images.slice(0, 2).map((src, i) => ({
      key: `${category}-all-${i}`,
      src: src || FALLBACK_IMAGE,
      href: labels[i]?.productLink,
      labelData: labels[i] || [],
    }));
  });

  // Specific tab: every image/label belonging to that category.
  const activeItems = (tabImages[activeTab] || []).map((src, i) => ({
    key: `${activeTab}-${i}`,
    src: src || FALLBACK_IMAGE,
    href: labelData[activeTab]?.[i]?.productLink,
    labelData: labelData[activeTab]?.[i] || [],
  }));

  const visibleAllItems = allItems.slice(0, loadMoreAll ? 12 : 3);
  const visibleActiveItems = activeItems.slice(0, loadMore ? 12 : 3);

  // Height / aspect rhythm matching IKEA design:
  // Card 0 (Col 0): tall portrait (h-[480px] lg:h-[600px])
  // Card 1 (Col 1): square/shorter (h-[360px] lg:h-[450px]) -> produces the middle gap
  // Card 2 (Col 2): tall portrait (h-[480px] lg:h-[600px])
  // Card 3 (Col 0): landscape/medium (h-[360px] lg:h-[450px])
  // Card 4 (Col 1): tall portrait (h-[480px] lg:h-[600px]) -> starts directly inside the gap
  // Card 5 (Col 2): square/medium (h-[360px] lg:h-[450px])
  const getCardHeightClass = (idx) => {
    const pattern = [
      "h-[450px] sm:h-[500px] lg:h-[620px]", // 0 (Col 0, row 1 - tall)
      "h-[340px] sm:h-[380px] lg:h-[460px]", // 1 (Col 1, row 1 - square/short -> leaves gap)
      "h-[450px] sm:h-[500px] lg:h-[620px]", // 2 (Col 2, row 1 - tall)
      "h-[340px] sm:h-[380px] lg:h-[460px]", // 3 (Col 0, row 2 - medium)
      "h-[450px] sm:h-[500px] lg:h-[620px]", // 4 (Col 1, row 2 - tall -> fills gap)
      "h-[340px] sm:h-[380px] lg:h-[460px]", // 5 (Col 2, row 2 - medium)
    ];
    return pattern[idx % pattern.length];
  };

  const renderItemCard = (item, idx) => {
    if (!item) return null;
    return (
      <div
        key={item.key || `card-${idx}`}
        className={`w-full ${getCardHeightClass(idx)} relative overflow-hidden bg-gray-100 transition-all duration-300`}
      >
        <TabImage
          width={600}
          height={700}
          src={item.src}
          labelData={item.labelData}
          alt="Room"
          handleTab={handleTab}
          showTitleOverlay={false}
          onError={(e) => {
            if (e?.target?.style) e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  const renderMasonryWaterfall = (items) => {
    if (!items || items.length === 0) return null;

    // Desktop 3 columns (Round-robin column distribution)
    const col0 = [];
    const col1 = [];
    const col2 = [];

    items.forEach((item, idx) => {
      if (idx % 3 === 0) col0.push({ item, idx });
      else if (idx % 3 === 1) col1.push({ item, idx });
      else col2.push({ item, idx });
    });

    // Mobile 2 columns
    const mobCol0 = [];
    const mobCol1 = [];
    items.forEach((item, idx) => {
      if (idx % 2 === 0) mobCol0.push({ item, idx });
      else mobCol1.push({ item, idx });
    });

    return (
      <>
        {/* Desktop 3-Column Waterfall (md and above) */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 items-start">
          <div className="flex flex-col gap-4 lg:gap-6">
            {col0.map(({ item, idx }) => renderItemCard(item, idx))}
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            {col1.map(({ item, idx }) => renderItemCard(item, idx))}
          </div>
          <div className="flex flex-col gap-4 lg:gap-6">
            {col2.map(({ item, idx }) => renderItemCard(item, idx))}
          </div>
        </div>

        {/* Mobile 2-Column Waterfall (< md screens) */}
        <div className="grid grid-cols-2 md:hidden gap-3 items-start">
          <div className="flex flex-col gap-3">
            {mobCol0.map(({ item, idx }) => renderItemCard(item, idx))}
          </div>
          <div className="flex flex-col gap-3">
            {mobCol1.map(({ item, idx }) => renderItemCard(item, idx))}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <section className="g mr-[12px] sm:mr-[22px] md:mr-[0px]  ml-[12px] sm:ml-[20px] md:ml-[0px] md:px-[52px] pb-20 pt-10 h-full ">
        <div className="text-2xl font-semibold mb-5">
          <h2>Design inspiration and modern home ideas</h2>
        </div>
        <div
          className={`pt-2.5 pb-4 bloc-tabsnone flex flex-row  ${
            isSticky ? "sticky-tabcategory " : ""
          }`}
          style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
        >
          <div
            className={`px-5 py-2 tabS mr-2.5 cursor-pointer font-extrabold text-sm rounded-full whitespace-nowrap ${
              activeTab === "all"
                ? " bg-gray-100 text-black border-2 border-black"
                : " bg-gray-100 text-black border-2 border-transparent"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </div>
          {tabsData.map((tab, i) => (
            <div
              key={i}
              className={`px-5 py-2 tabS cursor-pointer font-extrabold text-sm rounded-full whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-gray-100 mr-2.5 text-black border-2 border-black"
                  : "bg-gray-100 mr-2.5 text-black border-2 border-transparent"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {activeTab === "all" ? (
          <div
            ref={navbarRef}
            className={`classic-tabs ${isSticky ? "mt-20" : ""}`}
          >
            {renderMasonryWaterfall(visibleAllItems)}

            {!loadMoreAll && (
              <div className="flex items-center justify-center mt-[24px]">
                <p
                  onClick={handleLoadMoreAll}
                  className="text-center text-[14px] bg-[#f5f5f5] border-none font-semibold border max-w-fit p-2 px-6 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  More
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            ref={navbarRef}
            className={`classic-tabs ${isSticky ? "mt-20" : ""}`}
          >
            {renderMasonryWaterfall(visibleActiveItems)}

            {!loadMore && (
              <div className="flex items-center justify-center mt-[24px]">
                <p
                  onClick={handleLoadMore}
                  className="text-center border-none text-[14px] font-semibold border max-w-fit p-2 px-6 rounded-full bg-[#f5f5f5] cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  More
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default Tabs;