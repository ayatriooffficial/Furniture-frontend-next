import React from "react";
import Link from "next/link";
import Image from "next/image";
import fixImgUrl from 'utils/modifyUrl.js'

const Card = ({ category, products, colors }) => {
  return (
    <div className="h-full">
      <div className="overflow-hidden border h-full flex flex-col">
        <div
          className={`px-4 py-5 text-white flex justify-between items-center`}
          style={{ backgroundColor: colors.header }}
        >
          <div>
            <h2 className="text-sm">Bestseller</h2>
            <Link href={`/${category}/collection/all`}>
              <h2 className="text-xl font-semibold">{category}</h2>
            </Link>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
              />
            </svg>
          </div>
        </div>
        <div className="p-4 flex-grow">
          {products.map((item, index) => (
            <div key={index} className="flex items-center mb-4 py-2 gap-4">
              <div className="text-2xl font-bold  text-center max-w-6 w-full">
                {index === 0 && (
                  <Image
                    src={`/batch/firstbatch.svg`}
                    width={20}
                    height={20}
                    alt="Rank"
                    className="w-6 h-6"
                  />
                )}
                {index === 1 && (
                  <Image
                    src={`/batch/secondbatch.svg`}
                    width={20}
                    height={20}
                    alt="Rank"
                    className="w-6 h-6"
                  />
                )}
                {index === 2 && (
                  <Image
                    src={`/batch/thirdbatch.svg`}
                    width={20}
                    height={20}
                    alt="Rank"
                    className="w-6c h-6"
                  />
                )}
              </div>
              <Link href={`/${item.productTitle.replace(/ /g, "-")}/${item.productId}`}>
                <img
                  src={fixImgUrl(item.images[0])}
                  alt={item.productTitle}
                  className="w-12 h-12 object-cover"
                />
              </Link>
              <div className="flex-grow">
                <Link
                  href={`/${item.productTitle.replace(/ /g, "-")}/${item?.productId}`}
                  className="text-[15px] font-medium"
                >
                  {item.productTitle}
                </Link>
                <div className="text-gray-600">
                  Rs.{" "}
                  {item.specialprice?.price ||
                    item.discountedprice?.price ||
                    item.perUnitPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
