import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/user.slice";
import menuReducer from "./reducers/chefs/chefs.slice";

const store = configureStore({
    reducer: {
        user: userReducer,
        menus: menuReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;