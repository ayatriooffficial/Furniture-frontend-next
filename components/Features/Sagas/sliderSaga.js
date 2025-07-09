import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchSliderView } from '../api';
import { getSliderSuccess, fetchSliderRequest, getSliderFailure } from '../Slices/sliderSlice';

function* fetchSliderViewSaga(action) {
  try {
    const { page, limit } = action.payload;
    yield put(fetchSliderRequest(true));
    const data = yield call(fetchSliderView, page, limit);
    yield put(getSliderSuccess(data));
  } catch (error) {
    console.error("Error fetching slider data:", error);
    yield put(getSliderFailure());
  } finally {
    yield put(fetchSliderRequest(false));
  }
}

export function* watchFetchSliderView() {
  yield takeLatest('FETCH_SLIDER_VIEW_REQUEST', fetchSliderViewSaga);
}
