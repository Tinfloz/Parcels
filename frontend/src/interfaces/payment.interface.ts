import { ValidationErrors } from "./errors/validation.errors";

export interface IPaymentInit {
    rzpOrder: any,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    message: string | ValidationErrors
};

export interface IPaymentParam {
    orderCreationId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
};

export interface IPaymentSliceParam {
    details: IPaymentParam,
    id: string | null,
}