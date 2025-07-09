"use server";

import axios from "axios";

export const checkKeyword = async (keyword) => {
  if (!keyword) return null;

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/api/checkkeyword",
      {
        params: {
          keyword,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
