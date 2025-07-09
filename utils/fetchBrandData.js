// utils/fetchBrandData.js
import axios from "axios";

export const fetchBrandData = async () => {
  try {
    const [offersRes, placesRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getAllOffers`),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/mapPlaces`)
    ]);
    
    return {
      offers: offersRes?.data || [],
      primaryLocation: placesRes?.data[0] || {},
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return { offers: [], primaryLocation: {} };
  }
};