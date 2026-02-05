import Header from "../Header";
import { Suspense } from "react";
import StaticHeaderSkeleton from "../Header/StaticHeaderSkeleton";

/**
 * Server-side HeaderWrapper - eliminates hydration mismatch
 * Uses Suspense boundary with static skeleton fallback for fast FCP
 * Header component handles client interactivity directly
 */
const HeaderWrapper = () => {
  return (
    <Suspense fallback={<StaticHeaderSkeleton />}>
      <Header />
    </Suspense>
  );
};

export default HeaderWrapper;
