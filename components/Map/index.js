import {
  selectMapDataCoords,
  selectMapDataZoom,
} from "@/components/Features/Slices/mapSlice";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import { useSelector } from "react-redux";
import { REACT_APP_GMAP_API_KEY } from "./config.js";
import MapMarker from "./MapMarker";
import { mapStyles } from "./mapStyles";
import Search from "./Search";
import "./styles.css";
const Map = ({ setBoundaries, coords, places, PlacesData }) => {
  const [stores, setStores] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);


  // const [STORE_MAP_DATA, SET_STORE_MAP_DATA] = useState([])

  // useEffect(() => {
  //   fetchStores().then((stores) => {
  //     setStores(stores);
  //     setIsLoading(false);
  //   });
  // }, []);

  // const fetchMapData = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mapPlaces`);
  //     console.log(response.data);
  //     SET_STORE_MAP_DATA(response.data);
  //   } catch (error) {
  //     console.error("Error fetching map data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchMapData();
  // }, []);

  // console.log(PlacesData);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: REACT_APP_GMAP_API_KEY,
  });
  const newZoom = useSelector(selectMapDataZoom);
  const newCoords = useSelector(selectMapDataCoords);
  // console.log(newZoom)
  const india_zoom = 5;
  const hotels_zoom = 11;
  const [zoom, setZoom] = useState(india_zoom);
  const [map, setMap] = useState(null);
  // const [selectedCoords, setSelectedCoords] = useState(coords);
  const handleResultClick = ({ lat, lng }) => {
    if (lat && lng && lat !== null && lng !== null) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      setSelectedCoords({ lat: latitude, lng: longitude });
      // console.log(selectedCoords);
      if (selectedCoords.lat === 20.593 && selectedCoords.lng === 78.96) {
        setZoom(india_zoom);
      } else {
        setZoom(hotels_zoom);
      }
    }
  };
  // console.log(selectedCoords);
  const onLoad = (map) => {
    setMap(map);
  };
  // Custom overlay component
  const CustomMarker = ({ lat, lng, content }) => (
    <OverlayView
      position={{ lat, lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
        {/* snapmarker component */}
        {content}
      </div>
    </OverlayView>
  );
  // console.log("hi")
  // console.log(PlacesData)
  // const handleBoundsChanged = () => {
  //   if (map) {
  //     const bounds = map.getBounds();
  //     const ne = {
  //       lat: bounds.getNorthEast().lat(),
  //       lng: bounds.getNorthEast().lng(),
  //     };
  //     const sw = {
  //       lat: bounds.getSouthWest().lat(),
  //       lng: bounds.getSouthWest().lng(),
  //     };

  //     setBoundaries({ ne, sw });
  //   }
  // };
  const generateStoreSchema = (store) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ayatrio.com";
    
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/stores/${store._id}/#localbusiness`, // Use MongoDB's _id
      "name": store.name,
      "image": store.profileImg, // Map to profileImg field
      "url": `${baseUrl}/stores/${store._id}`, // Use _id for URL
      "telephone": store.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": store.address.split(","), // Extract street from address string
        "addressLocality":store.address.split(",")[1], // Hardcode or parse from address
        "addressRegion": store.address.split(",")[2], // Hardcode or parse from address
        "postalCode": store.pincode, // Map to pincode field
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": store.geo_location.latitude,
        "longitude": store.geo_location.longitude
      },
      "openingHoursSpecification": "Specify hours here", // Add your opening hours logic
      "parentOrganization": {
        "@type": "Organization",
        "name": "Ayatrio",
        "@id": `${baseUrl}/#organization`
      },
      // Additional fields from MongoDB:
      "description": "Add a description if needed", // Optional
      "photos": store.images // Include all images from the array
    };
};

  return (
  <>
    {!isLoaded ? (
      <h1 className="text-center my-6">Loading...</h1>
    ) : (
      <>
        {/* Add schema scripts HERE - outside GoogleMap but inside loaded section */}
        {PlacesData.map(store => (
          <script
            key={store._id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStoreSchema(store)) }}
          />
        ))}

        <Search places={stores} onResultClick={handleResultClick} />
        <GoogleMap
          mapContainerClassName="map-container"
          onLoad={onLoad}
          center={newCoords || coords}
          zoom={newZoom}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            // styles: mapStyles,
            mapId: "7f00381402189dadef00088d",

          }}
        >
          {PlacesData.map((store, i) => (
            <CustomMarker
              key={store._id}
              lat={store.geo_location.latitude}
              lng={store.geo_location.longitude}
              content={<MapMarker place={store} idx={i} />}
            />
          ))}
        </GoogleMap>
      </>
    )}
  </>
);
}

export default Map;
