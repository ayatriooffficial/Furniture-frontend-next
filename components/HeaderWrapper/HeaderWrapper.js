"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Splashscreen from "../Splashscreen/Splashscreen";
import HomeSkeleton from "./../Skeleton/HomeSkeleton";
import Loader from "./../Cards/Loader";

import Header from "../Header";

const HeaderWrapper = () => {
  const [isHeaderMounted, setIsHeaderMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && <Header setIsHeaderMounted={setIsHeaderMounted} />}
      {/* <Header /> */}
      {/* {isHeaderMounted ? null : <Splashscreen />} */}
      {/* {isHeaderMounted ? null : <HomeSkeleton />} */}
    </>
  );
};

export default HeaderWrapper;
