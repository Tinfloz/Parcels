import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ICartQtyChangeParam, ICartQtyResponse, IUserCartResponse } from "../../interfaces/cart.interface";
import { ICartInit } from "../../interfaces/cart.interface";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { RootState } from "../../store";
import cartService from "./cart.service";

const initialState: ICartInit = {
    cart: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

// get cart items
export const getMycartItems = createAsyncThunk<
    IUserCartResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/cart", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await cartService.getAllUserCartItems(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// change cart qty
export const changeUserCartQty = createAsyncThunk<
    ICartQtyResponse,
    ICartQtyChangeParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("change/cart", async (changeDetails, thunkAPI) => {
    try {
        const { id, quantity } = changeDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await cartService.changeCartQty(id, quantity, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetCart: state => initialState,
        resetCartHelpers: state => ({
            ...initialState,
            cart: state.cart
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getMycartItems.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMycartItems.fulfilled, (state, action: PayloadAction<IUserCartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.cart = action.payload.cart;
            })
            .addCase(getMycartItems.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(changeUserCartQty.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeUserCartQty.fulfilled, (state, action: PayloadAction<ICartQtyResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newCart = state.cart!.map(element => {
                    if (element._id === action.payload.id) {
                        element.qty = Number(action.payload.qty)
                    };
                    return element
                });
                state.cart = newCart;
            })
            .addCase(changeUserCartQty.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetCart, resetCartHelpers } = cartSlice.actions;
export default cartSlice.reducer;