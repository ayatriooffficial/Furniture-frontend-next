import {call,put,takeEvery} from 'redux-saga/effects'
import {fetchProfileContent} from '../api'
import {getProfileSuccess,loadProfileFetch} from '../Slices/profileSlice'

function* fetchProfileData(){
    try{
        const data = yield call(fetchProfileContent);
        yield put(getProfileSuccess(data));
    }
    catch(error){
        console.error("Error fetching profile data:", error);
    }
    finally{
        yield put(loadProfileFetch(false));
    }
}

export function* watchFetchProfileData(){
    yield takeEvery('FETCH_PROFILE_REQUEST',fetchProfileData);
}