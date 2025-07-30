import React, { useEffect, useState } from "react";
import Link from "next/link";
import Displaybox from "./Displaybox";
import axios from "axios";
import SwiperComponent from "./SwiperComponent";
import AsideboxSkeleton from "./AsideboxSkeleton";

const Asidebox = (props) => {
  const [asideCategory, setAsideCategory] = useState(null);
  const [defaultLinkIndex, setDefaultLinkIndex] = useState(0);
  const [selectedData, setSelectedData] = useState("");
  const [innerData, setInnerData] = useState(false);

  let parentCategory;
  switch (props.hoveredIndex) {
    case 0:
      parentCategory = "homedecor";
      break;
    case 1:
      parentCategory = "walldecor";
      break;
    case 2:
      parentCategory = "flooring";
      break;
    default:
      parentCategory = "";
  }

  useEffect(() => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getCategoriesByTypeLimtedData/${parentCategory}`;
    // const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getCategoriesByType/${parentCategory}`;
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { "Content-Type": "application/json" },
        });

        let data = response.data || [];

        // ✅ Add AYATRIO Offer dynamically only for index 5
        if (props.hoveredIndex === 5) {
          const ayatrioOffer = {
            name: "AYATRIO Offer*",
            subcategories: [],
          };
          data = [ayatrioOffer, ...data];
        }

        setAsideCategory(data);
        setSelectedData(data[0]);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    if (parentCategory || props.hoveredIndex === 5) {
      fetchCategoryData();
    }
  }, [parentCategory, props.hoveredIndex]);

  const handleMouseEnter = (index, data) => {
    setDefaultLinkIndex(index);
    setSelectedData(data);
  };

  const handleItemClick = (data) => {
    setInnerData(true);
    if (window.innerWidth > 800) {
      props.handleChange(false);
    }
    handleClick(false);
  };

  const handleClick = (item) => {
    if (window.innerWidth > 800) {
      props.setHoveredIndex(item);
    }
  };

  if (
    props.hoveredIndex === 0 ||
    props.hoveredIndex === 1 ||
    props.hoveredIndex === 2
  ) {
    if (!asideCategory) {
      return <AsideboxSkeleton innerData={innerData} />;
    }
  }

  return (
    <>
      {asideCategory && (
        <div className="absolute top-[2.7rem] bg-white flex flex-col mt-[15px] md:flex-row noto-sans-200 w-full md:left-0 min-h-[90%] lg:min-h-[20rem] md:h-auto md:px-10 border-t border-solid border-[#f5f5f5] sm:max-h-[72vh]">
          <aside className="w-full md:w-[20%] md:sticky md:top-0 h-full overflow-y-auto py-4 px-2 pr-2">
            {asideCategory.map((value, idx) => (
              <Link
                key={idx}
                onMouseEnter={() => handleMouseEnter(idx, value)}
                className={`lg:block flex items-center justify-between w-full lg:text-[14px] text-[18px] font-semibold ${defaultLinkIndex === idx ? "text-blue-600" : ""
                  } p-2 pt-0 hover:underline mb-2`}
                href={`/${value.name.replace(/ /g, "-")}/collection/all`}
                onClick={() => handleItemClick(value)}
              >
                <span>{value.name}</span>
              </Link>
            ))}
          </aside>
          <div className="inline-block h-full w-[0.5px] self-stretch bg-[#e5e7eb]"></div>
          <div
            className={`${innerData ? "block" : "hidden"
              } md:block absolute md:h-auto md:w-[80%] md:static w-full z-[99]`}
          >
            <Displaybox
              toggleMobileMenu={props.toggleMobileMenu}
              parentCategory={parentCategory}
              defaultLinkIndex={defaultLinkIndex}
              data={selectedData}
              setAsideCategory={setAsideCategory}
              HandleClick={handleClick}
              handleChange={props.handleChange}
            />
          </div>
        </div>
      )}
      {(props.hoveredIndex === 3 || props.hoveredIndex === 4 || props.hoveredIndex === 5) && (
        <div className="absolute top-[2.7rem] bg-white flex flex-col mt-[15px] md:flex-row noto-sans-200 transition-all duration-300 ease-linear w-full md:left-0 min-h-[10rem] md:h-auto px-6 py-4">
          <SwiperComponent
            handleChange={props.handleChange}
            setHoveredIndex={props.setHoveredIndex}
            hoveredIndex={props.hoveredIndex}
            toggleMobileMenu={props.toggleMobileMenu}
            handleClick={props.HandleClick}
          />
        </div>
      )}
    </>
  );
};

export default Asidebox;
