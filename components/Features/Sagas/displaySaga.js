import { call, put, takeEvery } from "redux-saga/effects";

import { setDisplayData } from "../Slices/displaySlice";

import axios from "axios";
export const FETCH_DISPLAY_DATA = "FETCH_DISPLAY_DATA";

function* fetchDisplayData() {
  try {
    const response = yield call(
      axios.get,
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBannerSection`
    );
    yield put(setDisplayData(response.data));
  } catch (error) {
    console.log("Error in fetching the Display data:", error);
  }
}

export function* watchFetchDisplayData() {
  yield takeEvery("FETCH_DISPLAY_DATA", fetchDisplayData);
}
