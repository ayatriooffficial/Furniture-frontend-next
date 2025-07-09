"use server";

import { createApiEndpoint } from "@/components/Features/api";
import axios from "axios";

export const fetchSliderData = async (page = 1, limit = 4) => {
  try {
    const response = await axios.get(
      createApiEndpoint("getImgCircle?" + "page=" + page)
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
