import {
  recommendCategoryWiseProduct,
  recommendationCategoryWiseLoader,
  fetchRecommendationCategoryWiseRequest,
  fetchRecommendationCategoryWiseFailure,
} from "../Slices/recommendationCategoryWiseSlice";

import { takeLatest, put, call } from 'redux-saga/effects';
import { fetchRecommendedProductCategoryWise } from '../api';
function* fetchRecommendedProductCategoryWiseSaga(action) {
  try {
    yield put(fetchRecommendationCategoryWiseRequest());
    yield put(recommendationCategoryWiseLoader(true));

    const data = yield call(fetchRecommendedProductCategoryWise, {
      categorySkip: 0,
      categoryLimit: 1,
      productLimit: 3,
      productSkip: 0,
      ...action.payload,
    });
    yield put(recommendCategoryWiseProduct(data));
    // ✅ Status is set to "succeeded" by the reducer
  } catch (error) {
    yield put(fetchRecommendationCategoryWiseFailure());
    console.error(error);
  } finally {
    yield put(recommendationCategoryWiseLoader(false));
  }
}

export function* watchFetchRecommendedCategoryWiseProduct() {
    yield takeLatest('RECOMMENDATION_CATEGORYWISE_REQUEST', fetchRecommendedProductCategoryWiseSaga);

  }

// import { takeLatest, put, call, select } from "redux-saga/effects";
// import {
//   recommendCategoryWiseProduct,
//   recommendationCategoryWiseLoader,
//   fetchRecommendationCategoryWiseRequest,
// } from "../Slices/recommendationCategoryWiseSlice";
// import { fetchRecommendedCategoryWiseProduct } from "../api"; // API call

// // Selectors to get current state
// const selectRecommendedData = (state) =>
//   state.recommendedCategoryWiseProduct.recommendedCategoryWiseProductData;

// function* fetchCategoryWiseProductSaga(action) {
//   try {
//     // Start loader
//     yield put(recommendationCategoryWiseLoader(true));

//     const { categoryOffset, productOffset, limit } = action.payload;

//     // Fetch data from backend
//     const data = yield call(fetchRecommendedCategoryWiseProduct, {
//       categoryOffset,
//       productOffset,
//       limit,
//     });

//     // Merge new data with existing data
//     const currentData = yield select(selectRecommendedData);
//     const updatedData = {
//       ...currentData,
//       categories: [...(currentData?.categories || []), ...data.categories],
//     };

//     // Save to Redux store
//     yield put(recommendCategoryWiseProduct(updatedData));
//   } catch (error) {
//     console.error("Error fetching category-wise products:", error);
//   } finally {
//     // Stop loader
//     yield put(recommendationCategoryWiseLoader(false));
//   }
// }

// export function* watchFetchCategoryWiseProduct() {
//   yield takeLatest(
//     "FETCH_RECOMMENDATION_CATEGORY_WISE_REQUEST",
//     fetchCategoryWiseProductSaga
//   );
// }
