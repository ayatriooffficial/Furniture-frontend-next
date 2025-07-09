import { takeLatest, put, call } from 'redux-saga/effects';
import { recomendProduct, recomendationLoader } from '../Slices/recommendationSlice';
import { fetchRecommendedProduct } from '../api'; 
function* fetchRecommendedProductSaga() {
  try {
    yield put(recomendationLoader(true));

    const data = yield call(fetchRecommendedProduct);
    yield put(recomendProduct(data));
    
    // localStorage.setItem('recommendedProducts', JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching recommended products:', error);
  } finally {
    yield put(recomendationLoader(false));
  }
}

export function* watchFetchRecommendedProduct() {
  yield takeLatest('RECOMMENDATION_REQUEST', fetchRecommendedProductSaga);
  
}
