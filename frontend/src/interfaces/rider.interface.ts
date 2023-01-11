import { ValidationErrors } from "./errors/validation.errors"

interface IAddress {
    address: string,
    city: string,
    state: string,
    pincode: string,
    latitude: number,
    longitude: number
}

export interface INearbyDelivery {
    distance: number,
    pickUp: IAddress
    drop: IAddress,
    deliveryId: string
}

export interface INearbyDeliveryResponse {
    success: boolean,
    deliveriesArray: Array<INearbyDelivery>
}

export interface IActiveOrder {
    _id: string,
    dropAddress: IAddress,
    pickUpAddress: IAddress,
    orderId: string,
    elementId: string
}

export interface IRiderInit {
    deliveries: Array<INearbyDelivery> | IActiveOrder | null,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    message: string | ValidationErrors
}



