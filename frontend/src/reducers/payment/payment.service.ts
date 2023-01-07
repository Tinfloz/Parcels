import axios from "axios";
import { IPaymentParam } from "../../interfaces/payment.interface";

const API_URL = "http://localhost:5000/api/order";

// create order
const createRazorpayOrder = async (id: string, token: string): Promise<{ success: boolean, rzpOrder: any }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/order/pay/${id}`, config);
    return response.data
};

// verify payment
const verifyPayment = async (id: string, token: string, orderDetails: IPaymentParam): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/verify/payment/${id}`, orderDetails, config);
    return response.data;
}

const paymentService = {
    createRazorpayOrder,
    verifyPayment
};

export default paymentService;