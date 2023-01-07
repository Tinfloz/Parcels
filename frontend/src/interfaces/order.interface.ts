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
    order: IOrder | Array<ISingleMyOrder> | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
};

export interface ISingleMyOrder {
    _id: string,
    items: Array<{
        _id: string,
        product: {
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
        chef: string,
        prepared: string,
        qty: number,
        deliveryId?: string
    }>,
    total: number
}

export interface IGetCustomerOrderResponse {
    success: boolean,
    myOrders: Array<ISingleMyOrder>
};