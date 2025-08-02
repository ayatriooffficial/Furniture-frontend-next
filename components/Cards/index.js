//"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import RoomCardSkeleton from "./../Skeleton/RoomCardSkeleton";
import CategorySlidesSkeleton from "./../Skeleton/CategorySlidesSkeleton";
import TabWrapperSkeleton from "../Skeleton/TabWrapperSkeleton";
import ShopByRoomSliderSkeleton from "./../Skeleton/ShopByRoomSliderSkeleton";
import Loader from "./Loader";

import MainSliderWrapper from "../MainSlider/MainSliderWrapper";

// Lazy-loaded components
const Cookies = dynamic(() => import("./Cookies"), { ssr: false });
const Trending = dynamic(() => import("./Trending"), { ssr: false });
const CategoriesSlider = dynamic(() => import("./categorySlider"), { ssr: false });

const Banner = dynamic(() => import("./Banner"), {
  ssr: false,
  loading: () => <Loader />,
});
const Footer = dynamic(() => import("../Footer/Footer"));
const Multicard = dynamic(() => import("../Imagechanger/Multicard"), {
  ssr: false,
});
const TabsWrapper = dynamic(() => import("./TabsWrapper"), {
  ssr: false,
  loading: () => <TabWrapperSkeleton />,
});
const Profile = dynamic(() => import("./Profile"), {
  ssr: false,
  loading: () => <Loader />,
});
const Phone = dynamic(() => import("./Phone"));
const Suggestion = dynamic(() => import("./Suggestion"), {
  ssr: false,
  loading: () => <ShopByRoomSliderSkeleton />,
});
const MulticardService = dynamic(() => import("./MultiCardService"), {
  ssr: false,
});
const ShopByRoomSlider = dynamic(() => import("./ShopByRoomSlider"), {
  ssr: false,
  loading: () => <ShopByRoomSliderSkeleton />,
});
const Display = dynamic(() => import("./Display"));
const RoomCardWrapper = dynamic(() => import("./RoomCardWrapper"), {
  ssr: false,
  loading: () => <RoomCardSkeleton />,
});
const DataSliderWrapper = dynamic(() => import("./DataSliderWrapper"), {
  ssr: false,
  loading: () => (
    <>
      <CategorySlidesSkeleton />
      <CategorySlidesSkeleton />
      <CategorySlidesSkeleton />
    </>
  ),
});
const RankedProducts = dynamic(() => import("./RankedProducts"), {
  ssr: false,
});
const UserReviewPosts = dynamic(() => import("./UserReviewPosts"));

function Cards() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("navigationItem");
  }

  return (
    <div className="w-full h-auto">
      <MainSliderWrapper />

      <Suspense fallback={<Loader />}>
        <CategoriesSlider />
        <Cookies />
        <Trending />
        <RoomCardWrapper />
        <Banner />
        <DataSliderWrapper />
        <Display />
        <RankedProducts />
        <Multicard />
        <ShopByRoomSlider />
        <Profile />
        <MulticardService />
        <Suggestion />

        <section className="sm:px-[52px] px-[20px] lg:px-[52px]">
          <UserReviewPosts slidesPerView={3.2} />
        </section>

        <TabsWrapper />
      </Suspense>
      <Phone />
      <Footer />
    </div>
  );
}

export default Cards;
