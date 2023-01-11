import axios from "axios";
import { IActiveOrder, INearbyDeliveryResponse } from "../../interfaces/rider.interface";

const API_URL = "http://localhost:5000/api/rider";

// get nearby deliveries
const getNearbyRiderDeliveries = async (token: string, latitude: string, longitude: string): Promise<INearbyDeliveryResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/deliveries/${latitude}/${longitude}`, config);
    return response.data;
};

//claim delivery
const claimDelivery = async (id: string, token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/claim/delivery/${id}`, config);
    return response.data;
};

// get claimed delivery
const getClaimedDelivery = async (token: string): Promise<{ success: boolean, delivery: IActiveOrder }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/active/delivery", config);
    return response.data;
};

// mark delivery picked up
const markDeliveryPicked = async (orderId: string, elementId: string, token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/picked/${orderId}/${elementId}`, config);
    return response.data;
};

// mark order delivered
const markDelivered = async (id: string, token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/mark/order/delivered/${id}`, config);
    return response.data;
};

const riderService = {
    getNearbyRiderDeliveries,
    claimDelivery,
    getClaimedDelivery,
    markDeliveryPicked,
    markDelivered
};

export default riderService;