import axios from "axios";
import { IMyChefOrderResponse } from "../../interfaces/chef.interface";

const API_URL = "http://localhost:5000/api/order";
const API_CHEF = "http://localhost:5000/api/chef";

// get requested orders 
const getChefRequestedOrders = async (token: string): Promise<IMyChefOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/requested/orders", config);
    return response.data;
};

// get accepted orders
const getChefAcceptedOrders = async (token: string): Promise<IMyChefOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/accepted/orders", config);
    return response.data;
};

// accept orders
const acceptChefOrders = async (id: string, token: string): Promise<{ success: boolean, id: string }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CHEF + `/accept/order/${id}`, config);
    return response.data;
};

// reject orders
const rejectChefOrders = async (id: string, token: string): Promise<{ success: boolean, id: string }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CHEF + `/reject/order/${id}`, config);
    return response.data;
};

// mark orders prepared
const markChefOrdersPrepared = async (orderId: string, elementId: string, token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/prepared/${orderId}/${elementId}`, config);
    return response.data
};

const chefService = {
    getChefRequestedOrders,
    getChefAcceptedOrders,
    acceptChefOrders,
    rejectChefOrders,
    markChefOrdersPrepared
};

export default chefService;
