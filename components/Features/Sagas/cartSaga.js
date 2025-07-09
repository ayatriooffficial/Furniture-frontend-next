// import { call, put, takeLatest } from 'redux-saga/effects';
// import { setCartData,setCartStatus } from '../Slices/cartSlice';
// // Adjust the path based on your project structure
// import { fetchCartDataApi } from '../api';  // Your API call function for fetching cart data

// // Worker saga
// function* fetchCartData() {
//   try {
//     yield put(setCartStatus('loading'));
//     const data = yield call(fetchCartDataApi);  // Call your API function to fetch cart data
//     yield put(setCartData(data));
//     yield put(setCartStatus('succeeded'));
//   } catch (error) {
//     yield put(setCartStatus('failed'));
//     console.error('Error fetching cart data:', error);
//   }
// }

// // Watcher saga
// export function* watchFetchCartData() {
//   yield takeLatest('cart/fetchCartData', fetchCartData);  // Adjust the action type based on your project
// }

// cartSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import { setDbItems } from '../Slices/cartSlice'; // Import your action creators
import axios from 'axios';

// Worker Saga: Fetch data from the server
function* fetchDbItemsSaga(action) {
  try {
    const response = yield call(axios.get, `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`, {
      params: {
        deviceId: action.payload,
      },
    });

    // Dispatch the action to update the Redux store
    yield put(setDbItems(response.data.items));
  } catch (error) {
    // Handle the error or dispatch an action indicating failure
    console.error('Error fetching data from the server:', error);
    // You might want to dispatch an action to update the store with an error status
  }
}

// Watch for the action and run the saga
export function* cartSaga() {
  // Replace 'FETCH_DB_ITEMS' with the actual action type you want to trigger this saga
  yield takeLatest('FETCH_DB_ITEMS', fetchDbItemsSaga);
}

// export default cartSaga;
