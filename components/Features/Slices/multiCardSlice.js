import { createSlice } from "@reduxjs/toolkit";

const initialState={
    status: "idle",
    loader: false,
    multiCardData: [],
}
export const multiCardSlice=createSlice({
    name:'multiCard',
    initialState,
    reducers:{
        loadMultiCardFetch:(state)=>{
            state.status="loading";
        },
        loadMultiCardSuccess:(state,action)=>{
            state.multiCardData = action.payload;
            state.status = "succeeded";
        },
        loadMultiCardFailure: (state) => {
            state.status = "failed";
        }
    }
})
 export const {loadMultiCardFetch,loadMultiCardSuccess,loadMultiCardFailurel}=multiCardSlice.actions;
 export const selectMultiCardData=(state)=>state.multiCard.multiCardData;
 export const selectMultiCardStatus=(state)=>state.multiCard.status;
 export default multiCardSlice.reducer
