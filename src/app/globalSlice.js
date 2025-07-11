import { createSlice } from "@reduxjs/toolkit";
import { sliceNames } from "../helpers/Constants";

const globalSliceReducerInitialState = {
    error: null,
    redirectPath: "/dashboard",
};

const globalSlice = createSlice({
    name: sliceNames.GLOBAL,
    initialState: globalSliceReducerInitialState,
    reducers: {
        setGlobalError(state, action) {
            state.error = action.payload;
        },
        clearGlobalError(state) {
            state.error = null;
        },
        setRedirectPath: (state, action) => {
            state.redirectPath = action.payload;
        },
        clearRedirectPath: (state) => {
            state.redirectPath = "/dashboard";
        },
    },
});

export const {
    setGlobalError,
    clearGlobalError,
    setRedirectPath,
    clearRedirectPath,
} = globalSlice.actions;

export default globalSlice.reducer;