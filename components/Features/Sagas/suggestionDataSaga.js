import { call, put, takeEvery } from "redux-saga/effects";
import { fetchSuggestionData as fetchSuggestionDataFromApi } from "../api";
import {
  getSuggestionDataSuccess,
  loadSuggestionDataFetch,
} from "../Slices/suggestionDataSlice";

function* fetchSuggestionData(action) {
  try {
    const data = yield call(fetchSuggestionDataFromApi, action.payload);
    yield put(getSuggestionDataSuccess(data));
  } catch (error) {
    console.error("Error fetching suggestion data:", error);
  } finally {
    yield put(loadSuggestionDataFetch(false));
  }
}

export function* watchFetchSuggestionData() {
  yield takeEvery("FETCH_SUGGESTION_DATA", fetchSuggestionData);
}
