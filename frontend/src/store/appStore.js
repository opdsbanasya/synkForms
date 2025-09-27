import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice";
import formsReducer from "./formsSlice";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        forms: formsReducer,
    }
});

export default appStore;