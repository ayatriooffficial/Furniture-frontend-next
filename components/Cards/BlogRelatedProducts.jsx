"use client"
import { useRef, useState } from "react";
import "./styles.css";
import BlogRelatedProductsSlider from "./BlogRelatedProductsSlider";

const BlogRecommendedProducts = ({
  relatedProducts,
  title,
  description,
  descriptionLinks,
}) => {
  const swiper1Ref = useRef(null);


  const filteredProducts = relatedProducts?.filter(
    (product) => product.subcategory !== "Accessories"
  );

  return (
    <div>
      <div className=" mt-20  bg-white ">
        <div className="mb-8 w-full flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl">
              {relatedProducts && relatedProducts.length === 0 ? "" : title}
            </h2>
            <p className="font-medium">
              {relatedProducts && relatedProducts.length === 0 ? (
                ""
              ) : descriptionLinks && descriptionLinks.length !== 0 ? (
                <p>
                  {description?.split(" ").map((word, index) => {
                    const matchedText = descriptionLinks?.find(
                      (item) => item.text === word
                    );
                    return matchedText?.link ? (
                      <>
                        <a
                          key={index}
                          href={matchedText.link}
                          style={{ color: "blue", textDecoration: "underline" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {word}
                        </a>
                        <span> </span>
                      </>
                    ) : (
                      word + " "
                    );
                  })}
                </p>
              ) : (
                description
              )}
            </p>
          </div>
          <div className="Slidenav flex  bg-white text-2xl cursor-pointer  text-white rounded-full gap-2">
            <div
              onClick={() => swiper1Ref.current.swiper.slidePrev()}
              className="custom-prev-button bg-slate-500  rounded-full  hover:bg-400 hover:scale-110 hover:text-slate-100"
            ></div>
            <div
              onClick={() => swiper1Ref.current.swiper.slideNext()}
              className="custom-next-button bg-slate-500  rounded-full hover:bg-400 hover:scale-110 hover:text-slate-100"
            ></div>
          </div>
        </div>
        <BlogRelatedProductsSlider data={filteredProducts} />
      </div>
    </div>
  );
};

export default BlogRecommendedProducts;
