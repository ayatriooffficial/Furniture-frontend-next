"use client";
import React, { Suspense } from "react";
import Header from "@/components/ProductPage/SeeOnWall/Header";

const SeeOnWallPage = () => {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-white" />}>
      <Header />
    </Suspense>
  );
};

export default SeeOnWallPage;
