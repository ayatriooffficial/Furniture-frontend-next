import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import RoomCardSkeleton from "./../Skeleton/RoomCardSkeleton";
import CategorySlidesSkeleton from "./../Skeleton/CategorySlidesSkeleton";
import TabWrapperSkeleton from "../Skeleton/TabWrapperSkeleton";
import ShopByRoomSliderSkeleton from "./../Skeleton/ShopByRoomSliderSkeleton";
import Loader from "./Loader";


// Lazy-loaded components
const Cookies = dynamic(() => import("./Cookies"), { ssr: false });
const Trending = dynamic(() => import("./Trending"), { ssr: false });



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


const LazySection = ({ children, minHeight = "400px" }) => {
 const { ref, inView } = useInView({
   triggerOnce: true,
   rootMargin: "300px 0px",
 });


 return (
   <div ref={ref} style={{ minHeight: inView ? "auto" : minHeight, width: "100%" }}>
     {inView && children}
   </div>
 );
};


function Cards(props) {
 const { isHomePage = false } = props;
 return (
   <div className="w-full h-auto">


     <Suspense fallback={<Loader />}>
       <Cookies />
       <Trending />
       <LazySection><RoomCardWrapper /></LazySection>
       <LazySection><Banner /></LazySection>
       <LazySection minHeight="800px"><DataSliderWrapper /></LazySection>
       <LazySection><Display /></LazySection>
       <LazySection><RankedProducts /></LazySection>
       <LazySection><Multicard /></LazySection>
       <LazySection><ShopByRoomSlider /></LazySection>
       <LazySection><Profile /></LazySection>
       <LazySection><MulticardService /></LazySection>
       <LazySection><Suggestion /></LazySection>


       <LazySection>
         <section className="sm:px-[52px] px-[20px] lg:px-[52px]">
           <UserReviewPosts slidesPerView={3.2} isHomePage={isHomePage} />
         </section>
       </LazySection>


       <LazySection><TabsWrapper /></LazySection>
       <LazySection><Phone isHomePage={isHomePage} /></LazySection>
     </Suspense>
     <Footer />
   </div>
 );
}


export default Cards;
