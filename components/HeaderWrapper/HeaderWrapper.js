"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import Splashscreen from "../Splashscreen/Splashscreen";
import HomeSkeleton from "./../Skeleton/HomeSkeleton";
import Loader from "./../Cards/Loader";

// const Header = dynamic(() => import("../Header"), { ssr: false });
import Header from "../Header";

const HeaderWrapper = () => {
  const [isHeaderMounted, setIsHeaderMounted] = useState(false);

  return (
    <>
      <Header setIsHeaderMounted={setIsHeaderMounted} />
      {/* <Header /> */}
      {/* {isHeaderMounted ? null : <Splashscreen />} */}
      {/* {isHeaderMounted ? null : <HomeSkeleton />} */}
    </>
  );
};

export default HeaderWrapper;
