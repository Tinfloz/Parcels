import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { IGetCustomerOrderResponse, IOrderInit, IOrderResponse } from "../../interfaces/order.interface";
import { RootState } from "../../store";
import orderService from "./order.service";

const initialState: IOrderInit = {
    order: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

// order single item
export const orderSingularItems = createAsyncThunk<
    IOrderResponse,
    {
        id: string,
        qty: string
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("order/single", async (orderDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        const { id, qty } = orderDetails;
        return await orderService.createIndividualItemOrders(id, qty, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// delete order 
export const deleteOrderFromDatabase = createAsyncThunk<
    {
        success: boolean
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("delete/order/db", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await orderService.deleteOrder(id, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// order cart items
export const orderMyCartItems = createAsyncThunk<
    IOrderResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("order/cart", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await orderService.orderCart(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const getAllMyOrders = createAsyncThunk<
    IGetCustomerOrderResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("my/orders", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await orderService.getLoggedInUserOrders(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrder: state => initialState,
        resetOrderHelpers: state => ({
            ...initialState,
            order: state.order
        })
    },
    extraReducers: builder => {
        builder
            .addCase(orderSingularItems.pending, state => {
                state.isLoading = true;
            })
            .addCase(orderSingularItems.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.order;
            })
            .addCase(orderSingularItems.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(deleteOrderFromDatabase.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteOrderFromDatabase.fulfilled, state => {
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(deleteOrderFromDatabase.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(orderMyCartItems.pending, state => {
                state.isLoading = true;
            })
            .addCase(orderMyCartItems.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.order;
            })
            .addCase(orderMyCartItems.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getAllMyOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllMyOrders.fulfilled, (state, action: PayloadAction<IGetCustomerOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.myOrders
            })
            .addCase(getAllMyOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetOrder, resetOrderHelpers } = orderSlice.actions;
export default orderSlice.reducer;