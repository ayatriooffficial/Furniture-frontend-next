import { put, takeEvery } from "redux-saga/effects";

import { setselectedproduct } from "../Slices/compareSlice";
function* setSelectedProductsAsync(action) {
  try {
    // console.log("Handling SET_SELECTED_PRODUCTS_ASYNC action", action);
    yield put(setselectedproduct(action.payload));
  } catch (error) {
    console.error("Error is occurred", error);
  }
}

// Watchers
export function* watchSelectedProductsSaga() {
  yield takeEvery("SET_SELECTED_PRODUCTS_ASYNC", setSelectedProductsAsync);
}
