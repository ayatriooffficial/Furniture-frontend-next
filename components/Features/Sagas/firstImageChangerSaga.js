import {call,put,takeEvery} from 'redux-saga/effects'
import {fetchFirstImageChangerData} from '../api'
import {getFirstImgChangerSuccess,loadFirstImgChangerFetch} from '../Slices/firstImageChangerSlice'

function* fetchFirstImgChangerData(){
    try{
        const data = yield call(fetchFirstImageChangerData);
        yield put(getFirstImgChangerSuccess(data));
    }
    catch(error){
        console.error("Error fetching First Image Changer data:", error);
    }
    finally{
        yield put(loadFirstImgChangerFetch(false));
    }
}

export function* watchFetchFirstImgChangerData(){
    yield takeEvery('FETCH_FIRST_IMGHANGER_DATA',fetchFirstImgChangerData);
}