import axios from "axios";
import { ICartResponse, ISetAddressParam, ISetAddressResponse, IUser, IUserCreds } from "../../interfaces/auth.interface";

const API_URL = "http://localhost:5000/api/user";
const API_CUSTOMER = "http://localhost:5000/api/customer"

// register
const registerUser = async (userCreds: IUserCreds): Promise<IUser> => {
    const response = await axios.post(API_URL + `/register`, userCreds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data.sendUser));
    };
    return response.data;
};

// login
const loginUser = async (userCreds: IUserCreds): Promise<IUser> => {
    const response = await axios.post(API_URL + "/login", userCreds);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data.sendUser));
    };
    return response.data.sendUser;
};

// set address
const setAddressUser = async (addressDetails: ISetAddressParam, token: string): Promise<ISetAddressResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/set/address", addressDetails, config);
    console.log(response.data, "in service")
    const user = JSON.parse(localStorage.getItem("user")!);
    console.log(user)
    const newLoginUser = {
        ...user.loginUser,
        "address": response.data.address,
        "city": response.data.city,
        "state": response.data.state,
        "pincode": response.data.pincode
    };
    const newUser = {
        ...user,
        "loginUser": newLoginUser
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// add to cart
const addToCartUser = async (id: string, qtyDetails: { qty: string }, token: string): Promise<ICartResponse> => {
    console.log(id, "in service")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_CUSTOMER + `/add/cart/${id}`, qtyDetails, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.loginUser,
        "cart": response.data.cart
    };
    const newUser = {
        ...user,
        "loginUser": newLoginUser
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// remove item from cart
const removeFromCart = async (id: string, token: string): Promise<{ success: boolean, id: string }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CUSTOMER + `/remove/item/${id}`, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newCart = user.loginUser.cart.map((element: any) => {
        if (element._id === response.data.id) {
            let index = user.loginUser.cart.indexOf(element);
            user.loginUser.cart.splice(index, 1);
        };
        return element
    });
    const newLoginUser = {
        ...user.loginUser,
        "cart": newCart
    };
    const newUser = {
        ...user,
        "loginUser": newLoginUser
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// clear cart
const clearUserCart = async (token: string): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_CUSTOMER + "/clear/cart", config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = { ...user.loginUser, "cart": [] };
    const newUser = { ...user, "loginUser": newLoginUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
}

const userService = {
    registerUser,
    loginUser,
    setAddressUser,
    addToCartUser,
    removeFromCart,
    clearUserCart
};

export default userService;