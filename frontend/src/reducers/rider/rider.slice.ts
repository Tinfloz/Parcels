import { createSlice, createAsyncThunk, PayloadAction, current } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { IActiveOrder, INearbyDeliveryResponse, IRiderInit } from "../../interfaces/rider.interface";
import { RootState } from "../../store";
import riderService from "./rider.service";

const initialState: IRiderInit = {
    deliveries: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
}

// get nearby deliveries
export const getLoginRiderNearbyDeliveries = createAsyncThunk<
    INearbyDeliveryResponse,
    {
        latitude: number,
        longitude: number
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("nearby/deliveries", async (deliveryDetails, thunkAPI) => {
    try {
        const { latitude, longitude } = deliveryDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await riderService.getNearbyRiderDeliveries(token, latitude.toString(), longitude.toString());
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// claim delivery
export const claimLoginRiderDelivery = createAsyncThunk<
    { success: boolean },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("claim/delivery", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await riderService.claimDelivery(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get claimed delivery
export const getLoginRiderDelivery = createAsyncThunk<
    {
        success: boolean,
        delivery: IActiveOrder
    },
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("active/delivery", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await riderService.getClaimedDelivery(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// mark delivery picked 
export const markLoginRiderDeliveryPicked = createAsyncThunk<
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
>("delivery/picked", async (orderDetails, thunkAPI) => {
    try {
        const { orderId, elementId } = orderDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await riderService.markDeliveryPicked(orderId, elementId, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// mark delivered
export const markLoginRiderOrderDelivered = createAsyncThunk<
    {
        success: boolean
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("order/delivered", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await riderService.markDelivered(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const riderSlice = createSlice({
    name: "rider",
    initialState,
    reducers: {
        resetRider: state => initialState,
        resetRiderHelpers: state => ({
            ...initialState,
            deliveries: state.deliveries
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getLoginRiderNearbyDeliveries.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginRiderNearbyDeliveries.fulfilled, (state, action: PayloadAction<INearbyDeliveryResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload.deliveriesArray;
                console.log(current(state).deliveries)
            })
            .addCase(getLoginRiderNearbyDeliveries.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(claimLoginRiderDelivery.pending, state => {
                state.isLoading = true;
            })
            .addCase(claimLoginRiderDelivery.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(claimLoginRiderDelivery.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getLoginRiderDelivery.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginRiderDelivery.fulfilled, (state, action: PayloadAction<{ success: boolean, delivery: IActiveOrder }>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload.delivery;
            })
            .addCase(getLoginRiderDelivery.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(markLoginRiderDeliveryPicked.pending, state => {
                state.isLoading = true;
            })
            .addCase(markLoginRiderDeliveryPicked.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(markLoginRiderDeliveryPicked.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(markLoginRiderOrderDelivered.pending, state => {
                state.isLoading = true;
            })
            .addCase(markLoginRiderOrderDelivered.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(markLoginRiderOrderDelivered.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetRider, resetRiderHelpers } = riderSlice.actions;
export default riderSlice.reducer;