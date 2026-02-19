// components/Features/ReviewSchema.js
"use client";
import axios from "axios";
import Script from "next/script";
import { useEffect, useState } from "react";

const ReviewSchema = ({ isHomePage = false }) => {
  const [reviews, setReviews] = useState([]);
  const [mapPlaces, setMapPlaces] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, mapPlacesRes] = await Promise.all([
          axios.get(`${apiBaseUrl}/api//getSpecialReview`),
          axios.get(`${apiBaseUrl}/api/mapPlaces`)
        ]);
        setReviews(reviewsRes.data);
        setMapPlaces(mapPlacesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  if (!reviews.length || !mapPlaces.length) return null;

  // Create ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": reviews.length,
    "itemListElement": reviews.map((review, index) => {
      const mapPlace = mapPlaces[0]; // Using first map entry, adjust if multiple locations
      const addressParts = mapPlace.address.split(', ');
      
      const itemReviewed = [
        {
          "@type": "Service",
          "@id": `${baseUrl}/services/flooring-installation/#service`
        },
        {
          "@type": "LocalBusiness",
          "@id": `${baseUrl}/stores/${mapPlace._id}/#localbusiness`,
          "name": mapPlace.name,
          "image": mapPlace.profileImg,
          "telephone": mapPlace.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": addressParts[0],
            "addressLocality": addressParts[2],
            "addressRegion": addressParts[3],
            "postalCode": mapPlace.pincode,
            "addressCountry": "India"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": mapPlace.geo_location?.coordinates[1],
            "longitude": mapPlace.geo_location?.coordinates[0]
          }
        }
      ];

      if (!isHomePage) {
        itemReviewed.unshift({
          "@type": "Product",
          "@id": `${baseUrl}/products/${review.productId}/#product`
        });
      }

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Review",
          "@id": `${baseUrl}/reviews/${review.reviewId}/#review`,
          "reviewBody": review.comment,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review.rating.toString(),
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": review.name,
            "image": review.profilePic
          },
          "itemReviewed": itemReviewed,
          "datePublished": new Date(review.createdAt).toISOString()
        }
      };
    })
  };

  return (
    <Script
      key="review-itemlist-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
    />
  );
};

export default ReviewSchema;