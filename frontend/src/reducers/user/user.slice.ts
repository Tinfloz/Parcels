import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IAuthUserInit, ICartResponse, ISetAddressParam, ISetAddressResponse, IUser, IUserCreds } from "../../interfaces/auth.interface";
import { ValidationErrors } from "../../interfaces/errors/validation.errors";
import { RootState } from "../../store";
import userService from "./user.service";

const user = JSON.parse(localStorage.getItem("user")!);

const initialState: IAuthUserInit = {
    user: user ? user : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// register users
export const registerNewUser = createAsyncThunk<
    IUser,
    IUserCreds,
    {
        rejectValue: ValidationErrors
    }
>("register/user", async (creds, thunkAPI) => {
    try {
        return await userService.registerUser(creds);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// login users
export const login = createAsyncThunk<
    IUser,
    IUserCreds,
    {
        rejectValue: ValidationErrors
    }
>("login/user", async (creds, thunkAPI) => {
    try {
        return await userService.loginUser(creds);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// set address
export const setAddressLoginUser = createAsyncThunk<
    ISetAddressResponse,
    ISetAddressParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("set/address", async (addressDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await userService.setAddressUser(addressDetails, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// add to cart
export const addCartUser = createAsyncThunk<
    ICartResponse,
    {
        id: string,
        quantity: {
            qty: string
        }
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("add/cart/user", async (cartDetails, thunkAPI) => {
    try {
        const { id, quantity } = cartDetails;
        const token = thunkAPI.getState().user.user!.token;
        return await userService.addToCartUser(id, quantity, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// remove from cart
export const removeItemUserCart = createAsyncThunk<
    {
        success: boolean,
        id: string
    },
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("remove/item", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await userService.removeFromCart(id, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// clear cart
export const clearMyCart = createAsyncThunk<
    { success: boolean },
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("clear/cart", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user!.token;
        return await userService.clearUserCart(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get reset link
export const getUserResetLink = createAsyncThunk<
    {
        success: boolean
    },
    {
        email: string
    },
    {
        rejectValue: ValidationErrors
    }
>("reset/link", async (email, thunkAPI) => {
    try {
        return await userService.getResetPasswordLink(email);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// reset password
export const resetPasswordUser = createAsyncThunk<
    {
        success: boolean
    },
    {
        resetToken: string,
        passwordDetails: {
            password: string,
            confirmPassword: string
        }
    },
    {
        rejectValue: ValidationErrors
    }
>("reset/password", async (changeDetails, thunkAPI) => {
    try {
        const { resetToken, passwordDetails } = changeDetails;
        return await userService.resetUserPassword(resetToken, passwordDetails);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const userAuthSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUser: state => initialState,
        resetUserHelpers: state => ({
            ...initialState,
            user: state.user
        }),
        logout: () => localStorage.removeItem("user")
    },
    extraReducers: builder => {
        builder
            .addCase(registerNewUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(registerNewUser.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.sendUser
            })
            .addCase(registerNewUser.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(login.pending, state => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.user = action.payload.sendUser;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(setAddressLoginUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(setAddressLoginUser.fulfilled, (state, action: PayloadAction<ISetAddressResponse>) => {
                state.isLoading = false;
                const newLoginUser = {
                    ...state.user!.loginUser,
                    address: action.payload.address,
                    state: action.payload.state,
                    city: action.payload.city,
                    pincode: action.payload.pincode
                };
                const newUser = {
                    ...state.user!,
                    loginUser: newLoginUser
                };
                state.user = newUser;
                state.isSuccess = true;
            })
            .addCase(setAddressLoginUser.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(addCartUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(addCartUser.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newLoginUser = {
                    ...state.user!.loginUser,
                    cart: action.payload.cart
                };
                const newUser = {
                    ...state.user!,
                    loginUser: newLoginUser
                };
                state.user = newUser
            })
            .addCase(addCartUser.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(removeItemUserCart.pending, state => {
                state.isLoading = true;
            })
            .addCase(removeItemUserCart.fulfilled, (state, action: PayloadAction<{ success: boolean, id: string }>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newCart = state.user!.loginUser.cart.filter((element: any) => element._id !== action.payload.id);
                const newLoginUser = { ...state.user!.loginUser, cart: newCart };
                const newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
            })
            .addCase(removeItemUserCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(clearMyCart.pending, state => {
                state.isLoading = true;
            })
            .addCase(clearMyCart.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
                const newLoginUser = { ...state.user!.loginUser, cart: [] };
                const newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
            })
            .addCase(clearMyCart.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(getUserResetLink.pending, state => {
                state.isLoading = true;
            })
            .addCase(getUserResetLink.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(getUserResetLink.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(resetPasswordUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(resetPasswordUser.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPasswordUser.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetUser, resetUserHelpers } = userAuthSlice.actions;
export default userAuthSlice.reducer;
