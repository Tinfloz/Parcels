import axios from "axios";
import { IGetCustomerOrderResponse, IOrderResponse } from "../../interfaces/order.interface";

const API_URL = "http://localhost:5000/api/order";
const API_CUSTOMER = "http://localhost:5000/api/customer"
const API_ORDER = "http://localhost:5000/api/order"

// create individual order
const createIndividualItemOrders = async (id: string, qty: string, token: string): Promise<IOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CUSTOMER + `/order/single/${id}/${qty}`, config);
    return response.data;
};

// delete order from database
const deleteOrder = async (id: string, token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/delete/order/${id}`, config);
    return response.data;
};

// order cart items
const orderCart = async (token: string): Promise<IOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CUSTOMER + "/order/cart", config);
    return response.data;
};

// get my orders
const getLoggedInUserOrders = async (token: string): Promise<IGetCustomerOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_ORDER + "/get/my/orders", config);
    return response.data;
}

const orderService = {
    createIndividualItemOrders,
    deleteOrder,
    orderCart,
    getLoggedInUserOrders
};

export default orderService;