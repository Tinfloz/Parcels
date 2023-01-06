import { ValidationErrors } from "./errors/validation.errors"

export interface IItems {
    _id?: string,
    product: {
        _id: string,
        item: string,
        image: string,
        price: number
    },
    chef: string,
    status: string,
    qty: number,
    deliveryId?: string
};

export interface IOrder {
    _id: string,
    items: Array<IItems>,
    shippingFee: number,
    salesTax: number,
    total: number,
    customer: string,
    isPaid: boolean,
};

export interface IOrderResponse {
    success: boolean,
    order: IOrder
};

export interface IOrderInit {
    order: IOrder | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
};