import Image from "next/image";
import React, { useEffect, useState } from "react";
import "./styles.css";
import { viewItemList } from "@/tag-manager/events/view_item_list";
import Link from "next/link";
import dynamic from "next/dynamic";
// const Swiper = dynamic(() => import("./DataSliderSwiper"), {
//   ssr: false,
//   loading: () => <CardsSkeleton />,
// });
import DataSliderSwiper from "./DataSliderSwiper";
import CardsSkeleton from "./CardsSkeleton"

const Dataslider = ({ category, data, sliderIndex }) => {
  const [productData, setProductData] = useState([]);
 useEffect(() => {
  if (data?.products?.length > 0) {
    // ✅ Create a map keyed by `_id` to remove duplicates
    const uniqueProducts = Array.from(
      new Map(data.products.map((product) => [product._id, product]))
        .values()
    );
    setProductData(uniqueProducts);
  }
}, [data?.products]);
  useEffect(() => {
    if (productData.length > 0) {
      viewItemList({
        items: productData.map((product) => ({
          item_id: product._id,
          item_name: product.productTitle,
          item_category: product.category,
          price: product.perUnitPrice,
          currency: "INR",
          quantity: 1,
        })),
        itemListId: "category-slider" + category,
        itemListName: category,
      });
    }
  }, [productData]);

  // if(productData.length === 0) {
  //   return <CardsSkeleton />
  // }

  const handleCategoryClick = (e) => {
    e.preventDefault();
    const formattedCategory = category.replace(/ /g, "-").toLowerCase();
    // console.log("Formatted category:", formattedCategory);
    router.push(`/${formattedCategory}/collection/all`);
  };

  return (
      <div className=" bg-white mt-[30px] lg:mt-0 md:px-[52px] ml-[12px] sm:ml-[20px] md:ml-[0px]">
        <div className="w-full flex justify-between items-center">
          <Link 
            href={`/${category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('-')}/collection/all`}
            className="flex items-center gap-2 group"
          >
            <h2 id="recommended product categories title" className="font-semibold text-2xl pb-[20px] pt-[60px] hover:underline">
              {category}
            </h2>
            <Image
              src="icons/top-arrow-black-background-gray.svg"
              width={27}
              height={27}
              alt="View all"
              className="pt-[60px] pb-[20px]"
            />
          </Link>
          
        </div>{" "}

        {
           productData.length > 0 ? (
             <DataSliderSwiper productData={productData} sliderIndex={sliderIndex} />
           ) : (
             <CardsSkeleton />
           )
        }
        
        {/* <DataSliderSwiper productData={productData} sliderIndex={sliderIndex} /> */}
        {/* <div className="">
          {itm1.map((item) => (
            <div key="item.label._id" className="flex flex-row gap-5">
              <p>Category: {item.parentCategory}</p>
              <p>Name: {item.label.name} </p>
              <img src={item.label.img} alt="" width={150} height={150} />
            </div>
          ))}
        </div> */}
      </div>
  );
};

export default Dataslider;
