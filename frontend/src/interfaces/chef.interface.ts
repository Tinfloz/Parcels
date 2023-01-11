import { ValidationErrors } from "./errors/validation.errors"

export interface IMyMenu {
    _id: string,
    image: string,
    chef: string,
    price: string,
    item: string,
    left: string
}

export interface IMyMenuResponse {
    success: boolean,
    menu: IMyMenu
}

export interface IMyChefOrder {
    _id: string,
    orderId: {
        _id: string,
        customer: {
            _id: string,
            userId: {
                _id: string,
                name: string
            }
        }
    },
    elementId: string,
    qty: number
}

export interface IMyChefOrderResponse {
    success: boolean,
    orders: Array<IMyChefOrder>
}

export interface IChefOrderInit {
    myOrders: Array<IMyChefOrder> | null,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    message: string | ValidationErrors
}