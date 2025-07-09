// components/home/HomePageWrapper.jsx
import HomePage from "./HomePage";
import BrandJsonLd from "../JsonLd/BrandSchema";
import ReviewSchema from "../JsonLd/ReviewListSchema";
import PromotionEventSchema from "../JsonLd/PromotionEventSchema";
import BlogPostingSchema from "../JsonLd/BlogPostingSchema";

export default function HomePageWrapper() {
  return (
    <>
      <ReviewSchema />
      <BrandJsonLd />
      <PromotionEventSchema />
      <BlogPostingSchema />
      <HomePage />
    </>
  );
}
