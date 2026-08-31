"use client";
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
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 font-medium overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1">
      {navigationItemData ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <Link href={`${navigationItemData.href}`} className="hover:text-black transition-colors">
            {navigationItemData.label}
          </Link>
          <span className="text-gray-400 select-none">/</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="text-gray-400 select-none">/</span>
        </div>
      )}

      {data?.category && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/${data?.category?.replace(/ /g, "-")}/collection/all`}
            className="hover:text-black transition-colors"
          >
            {data?.category}
          </Link>
          {(data?.subcategory || data?.productTitle) && (
            <span className="text-gray-400 select-none">/</span>
          )}
        </div>
      )}

      {data?.subcategory && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href={`/${data?.subcategory?.replace(
              / /g,
              "-"
            )}/subcollection/${data?.category?.replace(/ /g, "-")}`}
            className="hover:text-black transition-colors"
          >
            {data?.subcategory}
          </Link>
          {data?.productTitle && (
            <span className="text-gray-400 select-none">/</span>
          )}
        </div>
      )}

      {data?.productTitle && (
        <span className="text-gray-800 font-semibold truncate max-w-[160px] sm:max-w-[240px]">
          {data?.productTitle}
        </span>
      )}
    </nav>
  );
};

export default NavigationItem;
