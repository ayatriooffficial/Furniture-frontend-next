// components/Map/MapPage.js
"use client";
import Map from "@/components/Map/index";
import SaveUserCoordinates from "@/utils/SaveUserCoordinates";
import axios from "axios";
import { LocalBusinessJsonLd } from "next-seo";
import { useEffect, useState } from "react";

const MapPage = () => {
  const [places, setPlaces] = useState([]);
  const [coords, setCoords] = useState({ lat: 20.5937, lng: 78.9629 });
  const [boundaries, setBoundaries] = useState(null);
  const [storeMapData, setStoreMapData] = useState([]);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 450
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, mapRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mapPlaces`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mapPlaces`)
        ]);
        setPlaces(placesRes.data);
        setStoreMapData(mapRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <SaveUserCoordinates />
      {storeMapData.map((store) => {
        const addressParts = store.address?.split(', ') || [];
        return (
          <LocalBusinessJsonLd
            key={store._id}
            type="HomeGoodsStore"
            id={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/store/${store._id}`}
            name={store.name}
            description={`Ayatrio ${store.name} offering ${store.category?.join(', ') || 'home furnishings'}`}
            url={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/store/${store._id}`}
            telephone={store.phone}
            address={{
              "@type": "PostalAddress",
              streetAddress: addressParts.slice(0, 2).join(', '),
              addressLocality: addressParts[2] || 'Kolkata',
              addressRegion: addressParts[3] || 'West Bengal',
              postalCode: store.geo_location?.pincode || '700020',
              addressCountry: "India",
            }}
            geo={{
              latitude: store.geo_location?.latitude,
              longitude: store.geo_location?.longitude,
            }}
            images={store.images}
            priceRange="$$$"
            servesCuisine={store.category}
            sameAs={[
              `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/store/${store._id}`
            ]}
          />
        );
      })}
      <Map
        setBoundaries={setBoundaries}
        coords={coords}
        places={places}
        PlacesData={storeMapData}
      />
    </>
  );
};

export default MapPage;