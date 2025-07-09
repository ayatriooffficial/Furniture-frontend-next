import {call,put,takeEvery} from 'redux-saga/effects'
import {fetchFirstImgCardSlider} from '../api'
import {getTrendingSuccess,loadTrendingFetch} from '../Slices/trendingSlice'

function* fetchTrendingData(){
    try{
        const data = yield call(fetchFirstImgCardSlider);
        yield put(getTrendingSuccess(data));
    }
    catch(error){
        console.error("Error fetching trending data:", error);
    }
    finally{
        yield put(loadTrendingFetch(false));
    }
}

export function* watchFetchTrendingData(){
    yield takeEvery('FETCH_TRENDING_DATA',fetchTrendingData);
}