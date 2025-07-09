"use client";

import ImageCaresoul from "@/components/Room/imagecaresoul";
import Card from "@/components/Room/Other/Card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRoomData, setRoomData } from "../Features/Slices/roomSlice";
import Reviews from "../Room/Other/Reviews";
import RoomImageList from "../Room/RoomImageList";
import RoomInfo from "../Room/RoomInfo";
import NavigationItem from "./NavigationItem";
import RoomToolbar from "./RoomToolbar";
import { viewItem } from "@/tag-manager/events/view_item";
import axios from "axios";
import AccessoriesPosts from "../Cards/AccessoriesPosts";
import UserReviewPosts from "../Cards/UserReviewPosts";
import Carous from "../Carousel/Carous";

const ProductPage = ({ productId, initialData }) => {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedData = useSelector(selectRoomData);
  const dispatch = useDispatch();
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    if (!initialData) {
      dispatch({ type: "FETCH_PRODUCT_BY_ID", payload: productId });
    }
  }, [productId, dispatch, initialData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: "FETCH_IMAGE_DATA",
          payload: null,
        });
      } catch (error) {
        console.error("Error fetching cached data:", error);
      }
    };

    fetchData();
    dispatch(setRoomData({ roomData: initialData, status: "succeeded" }));
  }, [dispatch, initialData]);

  const fetchAccessories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetchAccessoriesByCategory/${data?.category}`
      );
      setAccessories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.category) {
      fetchAccessories();
    }
  }, [data]);

  useEffect(() => {
    if (selectedData && Object.keys(selectedData).length !== 0) {
      sessionStorage?.setItem("roomData", JSON.stringify(selectedData));
      setData(selectedData);
      if (selectedData?.productImages?.[0]?.color) {
        dispatch({
          type: "FETCH_IMAGE_DATA",
          payload: selectedData?.productImages[0]?.color,
        });
      } else {
        dispatch({
          type: "FETCH_IMAGE_DATA",
          payload: null,
        });
      }
    }
  }, [selectedData, dispatch]);

  useEffect(() => {
    if (data) {
      viewItem({ item: data });
    }
  }, [data]);

  return (
    <main
      className="mb-[32px] px-[12px] sm:px-[20px] md:px-[52px]"
      aria-label="Product details"
      aria-live="polite"
      data-component="product-main"
      data-product-id={data?._id}
      data-product-name={data?.productTitle}
      data-product-type={data?.category}
      data-product-price={data?.price}
      data-online-sellable="true"
    >
      <div
        className="w-full gap-6 sm:mt-[96px] md:grid grid-cols-[1fr,1fr]"
        aria-label="Product gallery and purchase options"
        data-component="product-gallery-purchase"
      >
        <section
          className="h-full w-full font-sans text-xs sm:text-sm sm:pl-0 py-2 flex flex-col"
          aria-labelledby="product-navigation"
          data-component="product-gallery"
        >
          <div
            className="mb-4"
            id="product-navigation"
            aria-label="Breadcrumb navigation"
            data-component="product-breadcrumb"
          >
            <NavigationItem product={data} />
          </div>
          <RoomImageList
            data={data}
            images={data?.images}
            alt={data?.productTitle}
            aria-label="Product image list"
            data-component="product-image-list"
          />
          <ImageCaresoul
            data={data}
            images={data?.images}
            aria-label="Product image carousel"
            data-component="product-image-carousel"
            
          />
        </section>

        <section
          className="h-full w-full relative md:pl-3 md:pt-3 md:pl-3 md:pt-3 sm:pt-0 sm:pl-0 md:row-span-2"
          aria-label="Purchase card"
          data-component="purchase-card"
        >
          <div
            className={`w-full h-fit sticky top-2 ${
              isModalOpen ? "z-[9999]" : ""
            }`}
            id="pip-buy-module-content"
            data-component="purchase-card-inner"
          >
            <Card
              data={data}
              productId={data._id}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              aria-label="Buy or add to cart"
              data-component="buy-add-to-cart"
            />
          </div>
        </section>

        <section
          className="h-full w-full font-sans text-xs sm:text-sm sm:pl-0 flex flex-col"
          aria-label="Product information and reviews"
          data-component="product-info-reviews"
        >
          <RoomToolbar
            data={data}
            aria-label="Product actions"
            data-component="product-toolbar"
          />
          <RoomInfo
            data={data}
            accessories={accessories}
            aria-label="Product description and features"
            data-component="product-description-features"
          />

          <Reviews
            productId={data._id}
            data={data}
            aria-live="polite"
            aria-label="Customer reviews"
            data-component="customer-reviews"
          />

          <UserReviewPosts
            slidesPerView={2.2}
            SubcategoryName={data.subcategory}
            aria-label="User posts related to this product"
            data-component="user-review-posts"
          />

          <AccessoriesPosts
            accessories={accessories}
            aria-label="Related accessories"
            data-component="related-accessories"
          />
        </section>
      </div>

      <section
        aria-label="Similar products carousel"
        data-component="similar-products-carousel"
      >
        <Carous data={data} />
      </section>
    </main>
  );
};

export default ProductPage;
