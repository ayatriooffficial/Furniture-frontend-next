import {call, put, takeLatest} from 'redux-saga/effects';
import {fetchFirstImgCardSlider} from '../api';
import {FirstCardLoader,FirstCardData} from '../Slices/FIrstCardSlice'
function* fetchFirstCard(){
    try {
        const data = yield call(fetchFirstImgCardSlider);
        // console.log("Data received from API:", data);
        yield put(FirstCardData(data));
        return data;
    } catch (error) {
        // console.error("Error fetching first card data:", error);
    } finally {
        yield put(FirstCardLoader(false));
    }
}

export function* watchFetchFirstCard(){
    // console.log("watchFetchFirstCard saga is running");
    yield takeLatest('FETCH_FIRST_CARD_REQUEST', fetchFirstCard);
}
