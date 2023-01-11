import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IMyMenuResponse } from "../../interfaces/chef.interface";
import { IChefsResponse, IMenuItemResponse, IMenuParam, ISetMenuResponse, IUpdateOrder, IUpdateOrderResponse } from "../../interfaces/menu.interface";

const API_URL = "http://localhost:5000/api/menu";
const API_CHEF = "http://localhost:5000/api/chef";

// get chefs nearby
const getChefsNearbyUser = async (latitude: number | null, longitude: number | null, token: string): Promise<IChefsResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log(token, "token")
    const response = await axios.get(API_URL + `/get/chefs/${latitude}/${longitude}`, config);
    return response.data;
};

// set menu chef
const setChefMenu = async (menuDetails: IMenuParam, token: string): Promise<ISetMenuResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log(menuDetails)
    const response = await axios.post(API_CHEF + "/create/menu", menuDetails, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newUser = {
        ...user,
        "active": true
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// get menu by id
const getMenuById = async (id: string, token: string): Promise<IMenuItemResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log(config, id)
    console.log(API_URL + `/get/menu/${id}`)
    const response = await axios.get(API_URL + `/get/menu/${id}`, config);
    return response.data;
};

// get my menu
const getMyMenu = async (token: string): Promise<IMyMenuResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CHEF + "/get/my/menu", config);
    return response.data;
};

// update menu
const updateMyMenu = async (token: string, updateDetails: IUpdateOrder): Promise<IUpdateOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_CHEF + "/update/menu", updateDetails, config);
    return response.data;
};

// delete menu
const deleteMyMenu = async (token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CHEF + "/delete/menu", config);
    return response.data;
}

const menuService = {
    getChefsNearbyUser,
    setChefMenu,
    getMenuById,
    getMyMenu,
    updateMyMenu,
    deleteMyMenu
};

export default menuService;