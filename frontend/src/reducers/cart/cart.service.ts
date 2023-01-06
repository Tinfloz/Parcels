import axios from "axios";
import { ICartQtyResponse, IUserCartResponse } from "../../interfaces/cart.interface";

const API_URL = "http://localhost:5000/api/customer";

// get all cart items
const getAllUserCartItems = async (token: string): Promise<IUserCartResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/cart/items", config);
    return response.data;
};

// change cart qty
const changeCartQty = async (id: string, quantity: { qty: string }, token: string): Promise<ICartQtyResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/edit/cart/${id}`, quantity, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newCart = user.loginUser.cart.map((element: any) => {
        if (element._id === response.data.id) {
            element.qty = response.data.qty
        };
        return element;
    });
    const newLoginUser = { ...user.loginUser, "cart": newCart };
    const newUser = { ...user, "loginUser": newLoginUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
}

const cartService = {
    getAllUserCartItems,
    changeCartQty
};

export default cartService;