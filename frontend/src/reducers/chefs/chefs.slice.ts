import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { IMyMenu, IMyMenuResponse } from "../../interfaces/errors/chef.interface";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { IChefsResponse, IMenuInit, IMenuItemResponse, IMenuParam, ISetMenuResponse, IUpdateOrder, IUpdateOrderResponse } from "../../interfaces/menu.interface";
import { RootState } from "../../store";
import menuService from "./chefs.service";

const initialState: IMenuInit = {
    chefOrMenu: null,
    isSuccess: false,
    isLoading: false,
    isError: false,
    message: ""
};

const instanceOfIMyMenu = (param: any): param is IMyMenu => {
    return param.price !== undefined
}

// get chefs nearby
export const getLoginUserChefs = createAsyncThunk<
    IChefsResponse,
    {
        latitude: number | null,
        longitude: number | null
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/chefs/nearby", async (position, thunkAPI) => {
    try {
        const { latitude, longitude } = position;
        const token = thunkAPI.getState().user.user!.token;
        return await menuService.getChefsNearbyUser(latitude, longitude, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// createMenu
export const createMenu = createAsyncThunk<
    ISetMenuResponse,
    IMenuParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("create/menu", async (menuDetails: IMenuParam, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await menuService.setChefMenu(menuDetails, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get menu of chef
export const getChefMenuById = createAsyncThunk<
    IMenuItemResponse,
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/menu/id", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await menuService.getMenuById(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get my menu
export const getLoginChefMenu = createAsyncThunk<
    IMyMenuResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/chef/menu", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await menuService.getMyMenu(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// update order 
export const updateLoginChefOrder = createAsyncThunk<
    IUpdateOrderResponse,
    IUpdateOrder,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("update/order", async (orderDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await menuService.updateMyMenu(token, orderDetails)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        resetMenu: state => initialState,
        resetMenuHelpers: state => ({
            ...initialState,
            chefOrMenu: state.chefOrMenu
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getLoginUserChefs.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginUserChefs.fulfilled, (state, action: PayloadAction<IChefsResponse>) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.chefOrMenu = action.payload!.items
            })
            .addCase(getLoginUserChefs.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(createMenu.pending, state => {
                state.isLoading = true;
            })
            .addCase(createMenu.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createMenu.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getChefMenuById.pending, state => {
                state.isLoading = true;
            })
            .addCase(getChefMenuById.fulfilled, (state, action: PayloadAction<IMenuItemResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chefOrMenu = action.payload.menu
            })
            .addCase(getChefMenuById.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(getLoginChefMenu.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLoginChefMenu.fulfilled, (state, action: PayloadAction<IMyMenuResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chefOrMenu = action.payload!.menu
            })
            .addCase(getLoginChefMenu.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(updateLoginChefOrder.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateLoginChefOrder.fulfilled, (state, action: PayloadAction<IUpdateOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newChefOrMenu = {
                    _id: instanceOfIMyMenu(state.chefOrMenu) ? state.chefOrMenu!._id : "",
                    item: action.payload!.item,
                    image: action.payload!.image,
                    price: action.payload!.price,
                    left: action.payload!.left,
                    chef: instanceOfIMyMenu(state.chefOrMenu) ? state.chefOrMenu!.chef : "",
                };
                state.chefOrMenu = newChefOrMenu!;
            })
            .addCase(updateLoginChefOrder.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetMenu, resetMenuHelpers } = menuSlice.actions;
export default menuSlice.reducer;