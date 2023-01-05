import { ValidationErrors } from "./errors/validation.errors"

export interface IUserCreds {
    email: string,
    password: string,
    name?: string,
    userType?: string
};

export interface ISendUser {
    email: string,
    name: string,
    token: string,
    userType: string,
    [x: string]: any
};

export interface IUser {
    sendUser: ISendUser
};

export interface IAuthUserInit {
    user: ISendUser | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
};

export interface ISetAddressResponse {
    success: boolean,
    address: string,
    state: string,
    city: string,
    pincode: string
};

export interface ISetAddressParam {
    address: string,
    state: string,
    city: string,
    pincode: string,
};

export interface ICart {
    _id: string
    item: {
        _id: string,
        image: string,
        item: string,
        price: number
    },
    qty: number
}

export interface ICartResponse {
    success: boolean,
    cart: Array<ICart>
}