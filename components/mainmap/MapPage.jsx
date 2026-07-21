// components/Map/MapPage.js
"use client";
import Map from "@/components/Map/index";
import SaveUserCoordinates from "@/utils/SaveUserCoordinates";
import { getUserLocation, getUserLocationFromStorage } from "@/utils/getUserLocation";
import { searchNearbyAyatrioStores } from "@/services/googlePlacesService";
import { calculateDistance, formatDistance } from "@/utils/calculateDistance";
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
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleGetLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user location - force fresh location for accuracy
      console.log('Getting user location...');
      const location = await getUserLocation();
      console.log('Got user location:', location);
      
      setUserLocation(location);
      setCoords(location);
      
      // Search for nearby Vivo stores using Google Places API
      console.log('Searching for nearby Vivo stores around:', location);
      const nearbyStores = await searchNearbyAyatrioStores(location.lat, location.lng);
      console.log('Found nearby stores from Google Places:', nearbyStores);
      
      if (!nearbyStores || nearbyStores.length === 0) {
        setError('No Vivo stores found nearby. Please try a different location or check if stores exist in your area.');
        setStoreMapData([]);
        setPlaces([]);
        return;
      }
      
      // Calculate distance for each store from Google Places
      const storesWithDistance = nearbyStores.map(store => ({
        ...store,
        distance: calculateDistance(
          location.lat,
          location.lng,
          store.geometry.location.lat,
          store.geometry.location.lng
        ),
        // Format data to match existing structure
        _id: store.place_id,
        name: store.name,
        address: store.formatted_address || store.vicinity,
        phone: store.formatted_phone_number || 'N/A',
        geo_location: {
          latitude: store.geometry.location.lat,
          longitude: store.geometry.location.lng
        },
        images: store.photos ? 
          store.photos.map(photo => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyDzbRA0o0fEBZQ0SqtSi4BrYjX0_D4aQio`) : 
          ['/icons/vivo_store.svg'],
        profileImg: store.photos && store.photos[0] ? 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${store.photos[0].photo_reference}&key=AIzaSyDzbRA0o0fEBZQ0SqtSi4BrYjX0_D4aQio` : 
          '/icons/vivo_store.svg',
        rating: store.rating || 0,
        reviews: store.reviews || [],
        category: ['Mobile Store', 'Electronics']
      }));
      
      // Sort by distance
      storesWithDistance.sort((a, b) => a.distance - b.distance);
      
      console.log('Final stores with distance:', storesWithDistance);
      setStoreMapData(storesWithDistance);
      setPlaces(storesWithDistance);
    } catch (error) {
      console.error("Error fetching nearby Vivo stores:", error);
      setError(error.message || 'Failed to fetch nearby Vivo stores. Please enable location services and try again.');
      setStoreMapData([]);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-request location on component mount
    handleGetLocation();
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
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding nearby Vivo stores...</p>
            <p className="mt-2 text-sm text-gray-500">Please enable location services</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md px-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Location Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleGetLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg mr-2"
            >
              Enable Location
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        <>
          {storeMapData.map((store) => {
            const addressParts = store.address?.split(', ') || [];
            return (
              <LocalBusinessJsonLd
                key={store._id}
                type="ElectronicsStore"
                id={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/store/${store._id}`}
                name={store.name}
                description={`Vivo ${store.name} offering ${store.category?.join(', ') || 'mobile phones and electronics'}`}
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
                priceRange="$$"
                aggregateRating={{
                  "@type": "AggregateRating",
                  ratingValue: store.rating || 0,
                  reviewCount: store.reviews?.length || 0,
                }}
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
            userLocation={userLocation}
          />
        </>
      )}
    </>
  );
};

export default MapPage;