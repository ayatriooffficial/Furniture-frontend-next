import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  banks: [],
  bankOffers: [],
  appliedOffers: [], //an array of string rep applued offers title
  selectedBank: "", //this would store bankId like HDFC, SBIN
  bankDiscountedAmount: 0,
  sumTotalPrice: 0,
  otherOffers: null,
};

const externalOfferSlice = createSlice({
  name: "externalOffers",
  initialState,
  reducers: {
    setBankDiscount: {
      prepare(discountType, discountValue) {
        return {
          payload: {
            discountType,
            discountValue,
          },
        };
      },
      reducer(state, action) {
        const { discountType, discountValue } = action.payload;
        state.bankDiscountedAmount =
          discountType === "fixed"
            ? state.sumTotalPrice - discountValue
            : +((state.sumTotalPrice * discountValue) / 100).toFixed(2);
      },
    },
    setSumTotalPrice: (state, action) => {
      state.sumTotalPrice = action.payload;
    },
    setOtherApplicableExternalOffers: (state, action) => {
      state.otherOffers = action.payload;
    },
    addAppliedOffer: (state, action) => {
      //applied offer is a string
      const appliedOffer = action.payload;

      if (!state.appliedOffers.includes(appliedOffer)) {
        state.appliedOffers = [...state.appliedOffers, appliedOffer];
      }
    },
    setBanks: (state, action) => {
      state.banks = action.payload;
    },
    setSelectedBank: (state, action) => {
      state.selectedBank = action.payload;
    },
  },
});

export const {
  addAppliedOffer,
  setSumTotalPrice,
  setOtherApplicableExternalOffers,
  setBanks,
  setBankDiscount,
  setSelectedBank,
} = externalOfferSlice.actions;

export const selectBanks = (state) => state.externalOffers.banks;
export const selectOtherApplicableExternalOffers = (state) =>
  state.externalOffers.otherOffers;
export const selectSumTotalPrice = (state) =>
  state.externalOffers.sumTotalPrice;
export const selectSelectedBank = (state) => state.externalOffers.selectedBank;
export const selectBankDiscountedAmount = (state) =>
  state.externalOffers.bankDiscountedAmount;
export const selectAppliedOffers = (state) =>
  state.externalOffers.appliedOffers;

export default externalOfferSlice.reducer;
