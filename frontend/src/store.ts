import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user/user.slice";
import menuReducer from "./reducers/chefs/chefs.slice";
import orderReduceer from "./reducers/order/order.slice";
import cartReducer from "./reducers/cart/cart.slice";
import paymentReducer from "./reducers/payment/payment.slice";

const store = configureStore({
    reducer: {
        user: userReducer,
        menus: menuReducer,
        order: orderReduceer,
        cart: cartReducer,
        payment: paymentReducer,

    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;