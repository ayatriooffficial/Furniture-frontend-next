"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Card from "../../../../components/Cards/card";

const transformOffer = (str) => {
  return str.replace(/percent/g, "%").replace(/-/g, " ");
};

const OfferPage = () => {
  const { offer } = useParams(); // e.g., 50percent-Off
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferData = async () => {
      try {
        let url;

        if (offer) {
          const transformedOffer = transformOffer(offer);
          url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllProductsByOffer/${encodeURIComponent(transformedOffer)}`;
        } else {
          url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/productsWithOffers`;
        }

        const res = await axios.get(url);
        setData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch offer data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferData();
  }, [offer]);

  if (loading) return <p className="p-4">Loading offer...</p>;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center mt-12 px-4">
        <img
          src="/images/no-results.png" // optional: update path
          alt="No results"
          className="w-[250px] h-auto mb-6"
        />
        <p className="text-lg text-gray-600 font-medium mb-2">
          Oops! No products found for this offer.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Try exploring other deals or check back later.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-6">
        {offer ? `Offer: ${transformOffer(offer)}` : "All Offers"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((product, idx) => (
          <Card
            key={idx}
            id={product._id}
            title={product.productTitle}
            imgSrc={product.images}
            productImages={product.productImages}
            price={product.price}
            offer={product.offer}
            inCart={product.inCart}
            urgency={product.urgency}
            shortDescription={product.shortDescription}
            expectedDelivery={product.expectedDelivery}
            specialPrice={product.specialPrice}
            discountedprice={product.discountedprice}
            productId={product.productId}
            productType={product.productType}
            demandtype={product.demandtype}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferPage;
