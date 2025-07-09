import {call, put, takeLatest} from 'redux-saga/effects';
import {virtualGet} from '../api';

import {
    getVirtualSuccess,
    fetchVirtualRequest,
    getVirtualFailure,
    } from '../Slices/virtualSlice';

function* virtualGetSaga() {
   try{
    yield put(fetchVirtualRequest(true));
    const data = yield call(virtualGet);
    yield put(getVirtualSuccess(data));

   }
    catch(error){
     console.error("Error fetching virtual data:", error);
     yield put(getVirtualFailure());
    }
    finally{
     yield put(fetchVirtualRequest(false));
    }
}
export function* watchVirtualGet() {
    yield takeLatest('VIRTUAL_REQUEST', virtualGetSaga);

}