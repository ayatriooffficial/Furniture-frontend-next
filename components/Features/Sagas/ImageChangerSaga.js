import { call, put, takeEvery } from "redux-saga/effects";

import { setImagechanger } from "../Slices/ImagechangerSlice";
import axios from "axios";

function* fetchImagechangerData() {
  try {
    const response = yield call(
      axios.get,
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getMidInfoSection`
    );

    yield put(setImagechanger(response.data));
  } catch (error) {
    console.error("Error fetching imagechanger data:", error);
  }
}

export function* watchFetchImagechangerData() {
  yield takeEvery("FETCH_IMAGECHANGER_DATA", fetchImagechangerData);
}
