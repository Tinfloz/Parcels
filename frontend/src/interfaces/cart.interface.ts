import { ValidationErrors } from "./errors/validation.errors"

export interface ICartItems {
    _id: string,
    item: {
        _id: string,
        item: string,
        image: string,
        price: number,
        chef: {
            _id: string,
            userId: {
                _id: string,
                name: string
            }
        }
    },
    qty: number
};

export interface IUserCartResponse {
    success: boolean,
    cart: Array<ICartItems>
};

export interface ICartInit {
    cart: Array<ICartItems> | null,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    message: string | ValidationErrors
};

export interface ICartQtyResponse {
    success: boolean,
    id: string,
    qty: string
};

export interface ICartQtyChangeParam {
    id: string,
    quantity: {
        qty: string
    }
}