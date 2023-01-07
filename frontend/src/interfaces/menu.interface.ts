import { IMyMenu } from "./errors/chef.interface"
import { ValidationErrors } from "./errors/validation.errors"

export interface IChef {
    _id: string,
    userId: {
        _id: string,
        name: string
    },
    active: boolean,
    latitude: number,
    longitude: number
};

export interface IChefsResponse {
    success: boolean,
    items: Array<IChef>
};

export interface IMenuInit {
    chefOrMenu: Array<IChef> | IMenu | IMyMenu | null,
    isSuccess: boolean,
    isError: boolean,
    isLoading: boolean,
    message: "" | ValidationErrors
};



export interface IMenu {
    _id: string,
    userId: {
        _id: string,
        name: string
    },
    menu: {
        _id: string,
        item: string,
        price: number,
        left: number,
        image: string
    }
};

export interface IMenuParam {
    image: string,
    price: string,
    item: string,
    left: string
}

export interface ISetMenuResponse {
    success: boolean,
    menu: IMenu
};

export interface IMenuItemResponse {
    success: boolean,
    menu: IMenu
};

export interface IUpdateOrder {
    price: string,
    image: string,
    item: string,
    left: string
};

export interface IUpdateOrderResponse extends IUpdateOrder {
    success: boolean
}