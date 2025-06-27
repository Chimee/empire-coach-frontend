import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {dmApi} from "./dmApi";
import {thunk} from "redux-thunk";
import globalSlice from "./globalSlice";
import { sliceNames } from "../helpers/Constants";

const rootReducers = combineReducers({
    // reset: resetReducers,
    [sliceNames.GLOBAL]: globalSlice,
    [dmApi.reducerPath]: dmApi.reducer,

})
const store = configureStore({
    reducer: rootReducers,
    // middleware: [logger, thunk]
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(dmApi.middleware).concat(thunk)
    // getDefaultMiddleware().concat(addyApi.middleware).concat(logger).concat(thunk)
});


export default store;
