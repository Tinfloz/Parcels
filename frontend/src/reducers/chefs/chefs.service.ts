import axios from "axios";
import { IChefsResponse, IMenuItemResponse, IMenuParam, ISetMenuResponse } from "../../interfaces/menu.interface";

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

const menuService = {
    getChefsNearbyUser,
    setChefMenu,
    getMenuById
};

export default menuService;