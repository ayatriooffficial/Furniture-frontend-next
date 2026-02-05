"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import StaticHeaderSkeleton from "../Header/StaticHeaderSkeleton";

const Header = dynamic(() => import("../Header/index"), { ssr: false });

const HeaderWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  const [isHeaderReady, setIsHeaderReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleHeaderReady = () => {
    setIsHeaderReady(true);
  };

  return (
    <>
      {!isHeaderReady && <StaticHeaderSkeleton />}

      {isClient && (
        <div
          suppressHydrationWarning
          style={{ visibility: isHeaderReady ? "visible" : "hidden" }}
        >
          <Header onHeaderReady={handleHeaderReady} />
        </div>
      )}
    </>
  );
};

export default HeaderWrapper;
