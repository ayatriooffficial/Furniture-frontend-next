import { call, put, debounce} from 'redux-saga/effects';
import {
  searchProductsSuccess,
  searchProductsFailure,
  searchProductsRequest
} from '../search/searchSlice';

import { fetchProductsWithSearch } from '../api';

function* searchProducts(action) {
  try {
    const { query } = action?.payload;
    const data = yield call(fetchProductsWithSearch, query);
    yield put(searchProductsSuccess(data));
  } catch (error) {
    yield put(searchProductsFailure(error));
  }
}

export function* watchSearchProducts() {
  // Debounce the action to avoid making API calls for every keystroke
  yield debounce(300,searchProductsRequest.type , searchProducts);
}
