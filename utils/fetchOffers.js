import axios from "axios";

export async function fetchOffers() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.ayatrio.com";
  try {
    const response = await axios.get(`${apiBaseUrl}/api/getAllOffers`);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}