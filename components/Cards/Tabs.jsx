"use client";
import { useEffect, useRef, useState } from "react";
import "../MainSlider/Mainslidestyle.css";
// import work from "@/public/images/work.webp";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabImage from "./TabImage";
import "./tabs.css";

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getTabsRoom`
      );
      setNewData(response.data);
    } catch (error) {
      console.log(error);
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
    category.toLowerCase()
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

  return (
    <>
      <section className="g mr-[12px] sm:mr-[22px] md:mr-[0px]  ml-[12px] sm:ml-[20px] md:ml-[0px] md:px-[52px] pb-20 pt-10 h-full ">
        <div className="text-2xl font-semibold mb-5">
          <h2 >Design inspiration and modern home ideas</h2>
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
      ? ' bg-gray-100 text-black border-2 border-black' 
    : ' bg-gray-100 text-black border-2 border-transparent'
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
        ? 'bg-gray-100 mr-2.5 text-black border-2 border-black'
        : 'bg-gray-100 mr-2.5 text-black border-2 border-transparent'
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
              <TabImage
                width={450}
                height={700}
                href={labelData[uniqueRoomCategories[0]]?.[0]?.productLink}
                src={tabImages[uniqueRoomCategories[0]]?.[0] || ""}
                alt="Room"
                handleTab={handleTab}
                labelData={labelData[uniqueRoomCategories[0]]?.[0] || []}
                onError={(e) => e.target.style.display = 'none'}
              />

              <div className="overflow-hidden relative ">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover "
                  src={tabImages[uniqueRoomCategories[1]]?.[0] || ""}
                  alt="Room"
                  width={450}
                  height={350}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>

              <TabImage
                src={tabImages[uniqueRoomCategories[2]]?.[0] || ""}
                href={labelData[uniqueRoomCategories[2]]?.[0]?.productLink}
                labelData={labelData[uniqueRoomCategories[2]]?.[0] || []}
                alt="Room"
                width={450}
                height={700}
                handleTab={handleTab}
                onError={(e) => e.target.style.display = 'none'}
              />
              

              <TabImage
               src={tabImages[uniqueRoomCategories[3]]?.[0] || ""}
                labelData={labelData[uniqueRoomCategories[3]]?.[0] || []}
                href={labelData[uniqueRoomCategories[3]]?.[0]?.productLink}
                alt="Room"
                handleTab={handleTab}
                width={450}
                height={700}
                onError={(e) => e.target.style.display = 'none'}
              />

              <div className="overflow-hidden ">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover 11"
                  src={tabImages[uniqueRoomCategories[4]]?.[0] || ""}
                  alt="Room"
                  width={450}
                  height={350}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div className=" overflow-hidden ">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={tabImages[uniqueRoomCategories[5]]?.[0] || ""}
                  alt="Room"
                  width={450}
                  onError={(e) => e.target.style.display = 'none'}
                  height={350}
                />
              </div>
              {loadMoreAll && (
                <TabImage
                  width={450}
                  height={700}
                  src={tabImages[uniqueRoomCategories[6]]?.[0] || ""}
                  alt="Room"
                  handleTab={handleTab}
                  labelData={labelData[uniqueRoomCategories[6]]?.[0] || []}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}

              {loadMoreAll && (
                <div className="overflow-hidden relative ">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover "
                    src={tabImages[uniqueRoomCategories[7]]?.[0] || ""}
                    alt="Room"
                    width={450}
                    height={350}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              {loadMoreAll && (
                <TabImage
                src={tabImages[uniqueRoomCategories[8]]?.[0] || ""}
                  labelData={labelData[uniqueRoomCategories[8]]?.[0] || []}
                  href={labelData[uniqueRoomCategories[8]]?.[0]?.productLink}
                  alt="Room"
                  width={450}
                  height={700}
                  handleTab={handleTab}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              {loadMoreAll && (
                <div className="overflow-hidden sm:hidden block">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover "
                    src="/images/temp.svg"
                    alt="Room"
                    width={200}
                    height={200}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              {loadMoreAll && (
                <TabImage
                src={tabImages[uniqueRoomCategories[9]]?.[0] || ""}
                  href={labelData[uniqueRoomCategories[9]]?.[0]?.productLink}
                  labelData={labelData[uniqueRoomCategories[9]]?.[0] || []}
                  alt="Room"
                  handleTab={handleTab}
                  width={450}
                  height={700}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}

              {loadMoreAll && (
                <div className="overflow-hidden">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover 11"
                    src={tabImages[uniqueRoomCategories[10]]?.[0] || ""}

                    alt="Room"
                    width={450}
                    height={350}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              {loadMoreAll && (
                <div className=" overflow-hidden ">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover"
                    src={tabImages[uniqueRoomCategories[11]]?.[0] || ""}
                    alt="Room"
                    width={450}
                    height={350}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
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
              <TabImage
                width={450}
                height={700}
                src={
                  tabImages[activeTab] ? tabImages[activeTab][0] :""
                }
                href={labelData[activeTab]?.[0]?.productLink}
                alt="Room"
                handleTab={handleTab}
                labelData={labelData[activeTab]?.[0] || []}
                onError={(e) => e.target.style.display = 'none'}
              />

              <div className="overflow-hidden relative">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover "
                  src={
                    tabImages[activeTab] ? tabImages[activeTab][1] : "" 
                  }
                  alt="Room"
                  width={450}
                  height={350}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>

              <TabImage
                src={
                  tabImages[activeTab] ? tabImages[activeTab][2] : ""
                }
                href={labelData[activeTab]?.[2]?.productLink}
                labelData={labelData[activeTab]?.[2] || []}
                alt="Room"
                width={450}
                height={700}
                handleTab={handleTab}
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="overflow-hidden sm:hidden block">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover "
                  src="/images/temp.svg"
                  alt="Room"
                  width={200}
                  height={200}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>

              <TabImage
                src={
                  tabImages[activeTab] ? tabImages[activeTab][3] : ""
                }
                href={labelData[activeTab]?.[3]?.productLink}
                labelData={labelData[activeTab]?.[3] || []}
                alt="Room"
                handleTab={handleTab}
                width={450}
                height={700}
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="overflow-hidden">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={
                    tabImages[activeTab] ? tabImages[activeTab][4] : "" 
                  }
                  alt="Room"
                  width={450}
                  height={350}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div className=" overflow-hidden ">
                <Image
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={
                    tabImages[activeTab] ? tabImages[activeTab][5] :"" 
                  }
                  alt="Room"
                  width={450}
                  height={350}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              {loadMore && (
                <TabImage
                  width={450}
                  height={700}
                  src={
                    tabImages[activeTab] ? tabImages[activeTab][6] :""
                  }
                  href={labelData[activeTab]?.[6]?.productLink}
                  alt="Room"
                  handleTab={handleTab}
                  labelData={labelData[activeTab]?.[6] || []}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}

              {loadMore && (
                <div className="overflow-hidden relative">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover "
                    src={
                      tabImages[activeTab] ? tabImages[activeTab][7] :"" 
                    }
                    alt="Room"
                    width={450}
                    height={350}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              {loadMore && (
                <TabImage
                src={
                  tabImages[activeTab] ? tabImages[activeTab][8] : "" 
                }
                  labelData={labelData[activeTab]?.[8] || []}
                  href={labelData[activeTab]?.[8]?.productLink}
                  alt="Room"
                  width={450}
                  height={700}
                  handleTab={handleTab}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              {loadMore && (
                <div className="overflow-hidden sm:hidden block">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover "
                    src="/images/temp.svg"
                    alt="Room"
                    width={200}
                    height={200}
                    
                  onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              {loadMore && (
                <TabImage
                src={
                  tabImages[activeTab] ? tabImages[activeTab][9] : "" 
                }
                  labelData={labelData[activeTab]?.[9] || []}
                  href={labelData[activeTab]?.[9]?.productLink}
                  alt="Room"
                  handleTab={handleTab}
                  width={450}
                  height={700}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              {loadMore && (
                <div className="overflow-hidden">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover"
                    src={
                      tabImages[activeTab] ? tabImages[activeTab][10] : "" 
                    }
                    alt="Room"
                    width={450}
                    height={350}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              {loadMore && (
                <div className=" overflow-hidden ">
                  <Image
                    loading="lazy"
                    className="h-full w-full object-cover"
                    src={
                      tabImages[activeTab] ? tabImages[activeTab][11] : ""
                    }
                    alt="Room"
                    width={450}
                    height={350}
                     onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
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

export default Tabs;
