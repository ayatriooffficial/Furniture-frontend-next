// allProductsSaga.js
import { takeLatest, put, call } from 'redux-saga/effects';
import { setAllProducts, allProductsLoader } from '../Slices/productSlice';
import { fetchAllProducts } from '../api';

function* fetchAllProductsSaga(action) { // Include action as a parameter
    try {
        const { limit } = action.payload;
        yield put(allProductsLoader(true));

        const data = yield call(fetchAllProducts, limit);
        yield put(setAllProducts(data));

        // localStorage.setItem('allProducts', JSON.stringify(data));
    } catch (error) {
        console.error('Error fetching all products:', error);
    } finally {
        yield put(allProductsLoader(false));
    }
}

export function* watchFetchAllProducts() {
    yield takeLatest('ALL_PRODUCTS_REQUEST', fetchAllProductsSaga);
}
