import { call, put, takeEvery } from "redux-saga/effects";
import { fetchMusicData } from "../api";
import { getMusicSuccess, loadMusicFetch } from "../Slices/musicSectionSlice";

function* fetchMusicContent() {
  try {
    const data = yield call(fetchMusicData);
    yield put(getMusicSuccess(data));
  } catch (error) {
    console.error("Error fetching music data : ", error);
  } finally {
    yield put(loadMusicFetch(false));
  }
}

export function* watchFetchMusicData(){
    yield takeEvery('FETCH_MUSIC_DATA', fetchMusicContent);
}
