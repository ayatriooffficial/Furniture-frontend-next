import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NavigationItem = ({ product: data }) => {
  const [navigationItemData, setNavigationItemData] = useState(null);

  useEffect(() => {
    if (window !== undefined) {
      const navigationItem = JSON.parse(
        window.sessionStorage.getItem("navigationItem")
      );
      if (navigationItem) {
        setNavigationItemData(navigationItem);
        sessionStorage.removeItem("navigationItem");
      }
    }
  }, []);
  return (
    <div className="flex items-center gap-1 ">
      {navigationItemData ? (
        <>
          <div className="flex items-center justify-center">
            <Link href={`${navigationItemData.href}`}>
              <span className="hover:text-gray-600 cursor-pointer ">
                {navigationItemData.label}
              </span>
            </Link>
            <Image
              src="/icons/backarrowRevarce.svg"
              alt="tick"
              width={10}
              height={10}
              className="opacity-100 h-[8px]"
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-1">
            <Link href="/">
              <span className="hover:text-gray-600 cursor-pointer">Home</span>
            </Link>
            <Image
              src="/icons/backarrowRevarce.svg"
              alt="tick"
              width={10}
              height={10}
              className="opacity-100 h-[8px] mt-[2px]"
            />
          </div>
        </>
      )}
      <div className="flex items-center gap-1">
        <Link href={`/${data?.category?.replace(/ /g, "-")}/collection/all`}>
          <span className="hover:text-gray-500 cursor-pointer line-clamp-1">
            {data?.category}
          </span>
        </Link>
        {/* Only show tick after category if there's a subcategory or product title */}
        {(data?.subcategory || data?.productTitle) && (
          <Image
            src="/icons/backarrowRevarce.svg"
            alt="tick"
            width={10}
            height={10}
            className="opacity-100 h-[8px] mt-[2px]"
          />
        )}
      </div>
      {/* Only render subcategory section if subcategory exists */}
      {data?.subcategory && (
        <div className="flex items-center gap-1">
          <Link
            href={`/${data?.subcategory?.replace(
              / /g,
              "-"
            )}/subcollection/${data?.category?.replace(/ /g, "-")}`}
          >
            <span className="hover:text-gray-500 cursor-pointer line-clamp-1">
              {data?.subcategory}
            </span>
          </Link>
          {/* Only show tick after subcategory if there's a product title */}
          {data?.productTitle && (
            <Image
              src="/icons/backarrowRevarce.svg"
              alt="tick"
              width={10}
              height={10}
              className="opacity-100 h-[8px] mt-[2px]"
            />
          )}
        </div>
      )}
      {/* Only show product title if it exists */}
      {data?.productTitle && (
        <span className="text-gray-500 cursor-pointer line-clamp-1">
          {data?.productTitle}
        </span>
      )}
    </div>
  );
};

export default NavigationItem;
