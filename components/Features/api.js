import axios from "axios";
import axiosRetry from "axios-retry";

// const BASE_URL = "http://52.66.30.159:8080/api";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.ayatrio.com"}/api`;
export const createApiEndpoint = (endpoint) => `${BASE_URL}/${endpoint}`;
// if (typeof window !== "undefined") {
//   var id = localStorage.getItem("deviceId");
//   // console.log("id",id);
// }

export const fetchAllProducts = async (limit) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`products?limit=${limit}`)
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error to handle it in the calling code if needed
  }
};

export const fetchRecommendedProduct = async () => {
  let id;
  if (typeof window !== "undefined") {
    id = localStorage.getItem("deviceId");
  }
  try {
    const response = await axios.get(
      createApiEndpoint(`getRecommendation?deviceId=${id}`)
    );
    // console.log(response.data);
    return response.data;
  } catch (err) {
    // console.error(err);
  }
};
export const fetchRecommendedProductCategoryWise = async ({ categorySkip = 0, categoryLimit = 1, productLimit = 3 }) => {
  let id;
  if (typeof window !== "undefined") {
    id = localStorage.getItem("deviceId");
  }
  try {
    const response = await axios.get(
      createApiEndpoint(`getRecommendationCategoryWise?deviceId=${id}&categorySkip=${categorySkip}&categoryLimit=${categoryLimit}&productLimit=${productLimit}`)
    );
    return response.data; 
  } catch (err) {
    // console.error(err);
  }
};

export const fetchSliderView = async (page, limit) => {
  try {
    const response = await axios.get(
      createApiEndpoint("getImgCircle?limit=" + limit + "&page=" + page)
    );
    // console.log("response",response.data);
    return response.data;
  } catch (err) {
    console.error(err);
    return []
  }
};

export const fetchProductsWithSearch = async (searchQuery) => {
  try {
    const response = await axios.get(createApiEndpoint("products"), {
      params: {
        search: searchQuery,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
    return []
  }
};

export const fetchFirstImgCardSlider = async () => {
  try {
    const response = await axios.get(createApiEndpoint("trending-products"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching slider: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchBlogCardDataApi = async () => {
  try {
    const response = await axios.get(createApiEndpoint("fetchAllSuggestions"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchProfileContent = async () => {
  try {
    const response = await axios.get(createApiEndpoint("profileContent"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile content: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchCartData = async () => {
  try {
    const response = await axios.get(createApiEndpoint("cart"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching cart content: ${error.message} `);
    throw error;
    return []
  }
};
export const virtualGet = async () => {
  try {
    const response = await axios.get(createApiEndpoint("products"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching virtual content: ${error.message} `);
    throw error;
    return []
  }
};
export const multiCardData = async () => {
  try {
    const response = await axios.get(createApiEndpoint("getHeaderInfoSection"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching multicard content: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchMusicData = async () => {
  try {
    const response = await axios.get(createApiEndpoint("getStaticSection"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching music data : ${error.message}`);
    throw error;
    return []
  }
};

export const fetchFirstImageChangerData = async () => {
  try {
    const response = await axios.get(createApiEndpoint("getImgChanger"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching music data : ${error.message}`);
    throw error;
    return []
  }
};

// export const fetchSuggestionData = async (id) => {
//   try {
//     const response = await axios.get(createApiEndpoint("fetchSuggestionById"), {
//       params: { id },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching suggestions: ${error.message}`);
//     throw error;
//   }
// };

export const fetchSuggestionData = async (heading) => {
  try {
    const response = await axios.get(createApiEndpoint("fetchSuggestionByTitle"), {
      params: { heading : decodeURI(heading) },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching suggestions: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchHeaderCategoryData = async (category) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getCategoriesByType/${category}`),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response)

    return response.data;
  } catch (error) {
    console.error(`Error fetching header category data: ${error.message}`);
    return []
  }
};

export const fetchHeaderCategoryDataOnlyNames = async (category) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getCategoriesByTypeOnlyNames/${category}`),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching header category data: ${error.message}`);
    return []
  }
};

export const fetchProductsFromDemandType = async (type) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getAllProductsByDemandType/${type}`)
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching suggestions: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchProductsFromOffers = async (type) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getAllProductsByOffer/${type}`)
    );
    // dispatch(setOfferTotalPages(response.data.Totalproducts))
    return response.data.products;
  } catch (error) {
    console.error(`Error fetching suggestions: ${error.message}`);
    throw error;
    return []
  }
};

export const fetchStores = async (search) => {
  try {
    if (search === undefined || search === null) {
      const response = await axios.get(createApiEndpoint(`searchStore`));
      return response.data;
    } else {
      const response = await axios.get(
        createApiEndpoint(`searchStore?search=${search}`)
      );
      return response.data;
    }
  } catch (error) {
    console.error(`Error fetching suggestions: ${error.message}`);
    return []
  }
};

export const upsertUserLocation = async ({ lat, lng, pincode, deviceId }) => {
  try {
    const response = await axios.patch(
      createApiEndpoint(`userlocation/${deviceId}`),
      {
        lat,
        lng,
        pincode,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error storing location: ${error.message}`);
    return []
  }
};

export const getCategoryByName = async (categoryName) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getCategoryByName/${categoryName}`)
    );
    
    // 🛑 If it's an array, return first object (if needed)
    if (Array.isArray(response.data)) {
      return response.data[0] || null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching category: ${error.message}`);
    return null;
  }
};

export const getCategoryByNameModified = async (categoryName) => {
  try {
    const response = await axios.get(
      createApiEndpoint(`getCategoryByName/${categoryName}`)
    );
    
    // 🛑 If it's an array, return first object (if needed)
    if (Array.isArray(response.data)) {
      return response.data[0] || null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching category: ${error.message}`);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(createApiEndpoint("categories"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return []
  }
};

export const getOffers = async () => {
  try {
    const response = await axios.get(createApiEndpoint("getAllOffers"));
    return response.data;
  } catch (error) {
    console.error(`Error fetching offers: ${error.message}`);
    return[]
  }
};


export const fetchRankedProductsFoEachCategory = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getRankedProductsFoEachCategory`
  );
  return response.data;
};