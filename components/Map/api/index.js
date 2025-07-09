import axios from "axios";
import { REACT_APP_X_RapidAPI_Key, REACT_APP_X_RapidAPI_Host } from "../config";

const URL =
  "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary";

export const getPlaceData = async (sw, ne) => {
  try {
    const {
      data: { data },
    } = await axios.get(URL, {
      params: {
        bl_latitude: sw.lat,
        tr_latitude: ne.lat,

        bl_longitude: sw.lng,
        tr_longitude: ne.lng,
      },
      headers: {
        "X-RapidAPI-Key": "4adbbec4dbmshd9ac429279f3d24p1a208fjsna2ee2cadb197",
        "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
      },
    });

    return data;
  } catch (error) {
    // console.log(error);
  }
};
