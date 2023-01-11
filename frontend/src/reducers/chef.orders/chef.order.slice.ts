import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IChefOrderInit, IMyChefOrderResponse } from "../../interfaces/chef.interface";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { RootState } from "../../store";
import { addCartUser } from "../user/user.slice";
import chefService from "./chef.order.service";

const initialState: IChefOrderInit = {
    myOrders: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

// get requested orders
export const getLoginChefRequestedOrders = createAsyncThunk<
    IMyChefOrderResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("req/orders", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await chefService.getChefRequestedOrders(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get accepted orders 
export const getLoginChefAcceptedOrders = createAsyncThunk<
    IMyChefOrderResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("accepted/orders", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await chefService.getChefAcceptedOrders(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

// accept chef orders
export const acceptLoginChefOrders = createAsyncThunk<
    {
        success: boolean,
        id: string
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("accept/order", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await chefService.acceptChefOrders(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// reject orders 
export const rejectLoginChefOrders = createAsyncThunk<
    {
        success: boolean,
        id: string
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("reject/order", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await chefService.rejectChefOrders(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// mark orders prepared
export const markLoginChefOrdersPrepared = createAsyncThunk<
    {
        success: boolean
    },
    {
        orderId: string,
        elementId: string
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("mark/prepared", async (orderDetails, thunkAPI) => {
    try {
        const { orderId, elementId } = orderDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await chefService.markChefOrdersPrepared(orderId, elementId, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const chefSlice = createSlice({
    name: "chef",
    initialState,
    reducers: {
        resetChef: state => initialState,
        resetChefHelpers: state => ({
            ...initialState,
            myOrders: state.myOrders
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getLoginChefRequestedOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginChefRequestedOrders.fulfilled, (state, action: PayloadAction<IMyChefOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.myOrders = action.payload.orders!;
            })
            .addCase(getLoginChefRequestedOrders.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(getLoginChefAcceptedOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginChefAcceptedOrders.fulfilled, (state, action: PayloadAction<IMyChefOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.myOrders = action.payload.orders!;
            })
            .addCase(getLoginChefAcceptedOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(acceptLoginChefOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(acceptLoginChefOrders.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(acceptLoginChefOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(rejectLoginChefOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(rejectLoginChefOrders.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(rejectLoginChefOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(markLoginChefOrdersPrepared.pending, state => {
                state.isLoading = true;
            })
            .addCase(markLoginChefOrdersPrepared.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(markLoginChefOrdersPrepared.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!;
            })
    }
});

export const { resetChef, resetChefHelpers } = chefSlice.actions;
export default chefSlice.reducer;