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
  // "All" tab: one representative item per category (first image/label).
  const allItems = uniqueRoomCategories.map((category) => ({
    key: category,
    src: tabImages[category]?.[0] || FALLBACK_IMAGE,
    href: labelData[category]?.[0]?.productLink,
    labelData: labelData[category]?.[0] || [],
  }));

  // Specific tab: every image/label belonging to that category.
  const activeItems = (tabImages[activeTab] || []).map((src, i) => ({
    key: `${activeTab}-${i}`,
    src: src || FALLBACK_IMAGE,
    href: labelData[activeTab]?.[i]?.productLink,
    labelData: labelData[activeTab]?.[i] || [],
  }));

  const visibleAllItems = allItems.slice(0, loadMoreAll ? 12 : 6);
  const visibleActiveItems = activeItems.slice(0, loadMore ? 12 : 6);

  // Renders a single grid cell, alternating tile type based on GRID_PATTERN.
  const renderTile = (item, idx) => {
    const type = GRID_PATTERN[idx % GRID_PATTERN.length];

    if (type === "tab") {
      return (
        <TabImage
          key={item.key}
          width={450}
          height={700}
          src={item.src}
          href={item.href}
          labelData={item.labelData}
          alt="Room"
          handleTab={handleTab}
          onError={(e) => (e.target.style.display = "none")}
        />
      );
    }

    return (
      <div key={item.key} className="overflow-hidden relative">
        <Image
          loading="lazy"
          className="h-full w-full object-cover"
          src={item.src}
          alt="Room"
          width={450}
          height={350}
          onError={(e) => (e.target.style.display = "none")}
        />
      </div>
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
            // className={`px-5 py-2 tabS cursor-pointer ${
            //   activeTab === "all"
            //     ? "active-tabs border border-black mr-2.5 rounded-full flex items-center justify-center bg-gray-100 whitespace-nowrap"
            //     : "tabs border border-white mr-2.5 rounded-full flex items-center justify-center bg-gray-100 whitespace-nowrap"
            // }`}
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
            className={`classic-tabs  ${isSticky ? "mt-20" : ""}`}
          >
            <div className=" text-green-800 grid sm:grid-cols-3 grid-cols-2 gap-[1rem] grid-rows-3 ">
              {visibleAllItems.map((item, idx) => (
                <Fragment key={item.key}>
                  {renderTile(item, idx)}
                  {idx === 8 && loadMoreAll && (
                    <div className="overflow-hidden sm:hidden block">
                      <Image
                        loading="lazy"
                        className="h-full w-full object-cover "
                        src=""
                        alt="Room"
                        width={200}
                        height={200}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {!loadMoreAll && (
              <div className="flex items-center justify-center mt-[20px]">
                <p
                  onClick={handleLoadMoreAll}
                  className="text-center text-[14px] bg-[#f5f5f5] border-none font-semibold border max-w-fit p-2 px-4 rounded-full  cursor-pointer"
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
            <div className=" text-green-800 grid sm:grid-cols-3 grid-cols-2 gap-3 grid-rows-3">
              {visibleActiveItems.map((item, idx) => (
                <Fragment key={item.key}>
                  {renderTile(item, idx)}
                  {idx === 2 && (
                    <div className="overflow-hidden sm:hidden block">
                      <Image
                        loading="lazy"
                        className="h-full w-full object-cover "
                        src="/images/temp.svg"
                        alt="Room"
                        width={200}
                        height={200}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            {!loadMore && (
              <div className="flex items-center justify-center mt-[20px]">
                <p
                  onClick={handleLoadMore}
                  className="text-center border-none text-[14px] font-semibold border max-w-fit p-2 px-4 rounded-full bg-[#f5f5f5] cursor-pointer"
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