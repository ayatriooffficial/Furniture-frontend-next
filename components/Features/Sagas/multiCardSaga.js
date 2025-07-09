import {call,put,takeEvery} from 'redux-saga/effects'
import {multiCardData} from '../api'
import {loadMultiCardFetch,loadMultiCardSuccess} from '../Slices/multiCardSlice'
 function* fetchMultiCardData(){
    try{
        const data=yield call(multiCardData);
        yield put(loadMultiCardSuccess(data));
    }
      catch(error){
        console.log("Error fetching multiCard data:",error);
    }
    finally{
        yield put(loadMultiCardFetch(false));
    }
 }
 export function* watchMultiCardData(){
    yield takeEvery('FETCH_MULTICARD_REQUEST',fetchMultiCardData);
 }