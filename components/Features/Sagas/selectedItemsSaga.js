// sagas/selectedItemsSaga.js

import { put, takeLatest } from "redux-saga/effects";
import {
  setSelectedcomItems1,
  setSelectedcomItems2,
  setSelectedcomItems3
} from "../Slices/selectedItemsSlice"; // Replace with your actual slice path

// Replace with your actual API call function
function* setSelectedItems1Async(action) {
  try {
    // Call your API here if needed

    yield put(setSelectedcomItems1(action.payload));
  } catch (error) {
    // Handle error if necessary
    console.error("Error is occurred", error);
  }
}

function* setSelectedItems2Async(action) {
  try {
    // Call your API here if needed

    yield put(setSelectedcomItems2(action.payload));
  } catch (error) {
    // Handle error if necessary
    console.error("Error is occurred", error);
  }
}

function* setSelectedItems3Async(action) {
  try {
    // Call your API here if needed

    yield put(setSelectedcomItems3(action.payload));
  } catch (error) {
    // Handle error if necessary
    console.error("Error is occurred", error);
  }
}

// Watchers
export function* watchSelectedItemsSaga() {
  yield takeLatest("SET_SELECTED_ITEMS_1_ASYNC", setSelectedItems1Async);
  yield takeLatest("SET_SELECTED_ITEMS_2_ASYNC", setSelectedItems2Async);
  yield takeLatest("SET_SELECTED_ITEMS_3_ASYNC", setSelectedItems3Async);
}
