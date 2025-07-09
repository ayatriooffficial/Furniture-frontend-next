import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CategorySlidesSkeleton from "./../Skeleton/CategorySlidesSkeleton";
import RoomCardSkeleton from "./../Skeleton/RoomCardSkeleton";

const Loader = dynamic(() => import("../Cards/Loader"));
const Footer = dynamic(() => import("../Footer/Footer"));
const Multicard = dynamic(() => import("../Imagechanger/Multicard"));
const TabsWrapper = dynamic(() => import("./TabsWrapper"), {
  ssr: false,
  loading: () => <TabWrapperSkeleton />,
});
const Profile = dynamic(() => import("./Profile"), {
  ssr: false,
  loading: () => <Loader />,
});
const Phone = dynamic(() => import("./Phone"));
const RankedProducts = dynamic(() => import("./RankedProducts"));
const Suggestion = dynamic(() => import("./Suggestion"));
const MulticardService = dynamic(() => import("./MultiCardService"));
const ShopByRoomSlider = dynamic(() => import("./ShopByRoomSlider"));
const Display = dynamic(() => import("./Display"));
const RoomCard = dynamic(() => import("./RoomCard"), {
  ssr: false,
  loading: () => <RoomCardSkeleton />,
});
const DataSliderWrapper = dynamic(() => import("./DataSliderWrapper"), {
  loading: () => <CategorySlidesSkeleton />,
});

/** Utility function to create a delay */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function HomePhaseTwo() {
  const [currentStep, setCurrentStep] = useState(0);

  const components = [
    () => <RoomCard />,
    () => <DataSliderWrapper />,
    () => <Display />,
    () => <RankedProducts />,
    () => <Multicard />,
    () => <ShopByRoomSlider />,
    () => <Profile />,
    () => <Suggestion />,
    () => <MulticardService />,
    () => <TabsWrapper />,
    () => <Phone />,
    () => <Footer />,
  ];

  useEffect(() => {
    let isMounted = true;

    const loadSequentially = async () => {
      for (let i = 0; i < components.length; i++) {
        if (!isMounted) break;
        await delay(1000); // Delay of 1 second between components
        if (isMounted) setCurrentStep((prev) => prev + 1);
      }
    };

    loadSequentially();

    return () => {
      isMounted = false; // Cleanup to prevent updates after unmount
    };
  }, []);

  return (
    <main
      className="w-full h-auto"
      aria-label="Homepage main content"
      data-component="homepage"
    >
      {components.slice(0, currentStep).map((Component, index) => (
        <section
          key={index}
          aria-live="polite"
          data-component={`homepage-section-${index + 1}`}
        >
          {Component()}
        </section>
      ))}

      {currentStep < components.length && (
        <footer
          className="fixed bottom-0 left-0 w-full p-4 flex justify-center"
          aria-live="polite"
          aria-label="Loading content"
          data-component="homepage-loader"
        >
          <Loader />
        </footer>
      )}
    </main>
  );
}

export default HomePhaseTwo;
