import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { IPaymentInit, IPaymentSliceParam } from "../../interfaces/payment.interface";
import { RootState } from "../../store";
import paymentService from "./payment.service";

const initialState: IPaymentInit = {
    rzpOrder: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

// get rzp response
export const getRzpResponse = createAsyncThunk<
    {
        success: boolean,
        rzpOrder: any
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("rzp/response", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await paymentService.createRazorpayOrder(id, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// verify payment
export const verifyMyPayment = createAsyncThunk<
    {
        success: boolean
    },
    IPaymentSliceParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("verify/payment", async (orderDetails, thunkAPI) => {
    try {
        const { id, details } = orderDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await paymentService.verifyPayment(id!, token, details)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        resetPayment: state => initialState,
        resetPaymentHelpers: state => ({
            ...initialState,
            rzpOrder: state.rzpOrder
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getRzpResponse.pending, state => {
                state.isLoading = true;
            })
            .addCase(getRzpResponse.fulfilled, (state, action: PayloadAction<{ success: boolean, rzpOrder: any }>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.rzpOrder = action.payload.rzpOrder
            })
            .addCase(getRzpResponse.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(verifyMyPayment.pending, state => {
                state.isLoading = true;
            })
            .addCase(verifyMyPayment.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(verifyMyPayment.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!;
            })
    }
});

export const { resetPayment, resetPaymentHelpers } = paymentSlice.actions;
export default paymentSlice.reducer;