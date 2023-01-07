export interface IMyMenu {
    _id: string,
    image: string,
    chef: string,
    price: string,
    item: string,
    left: string
}

export interface IMyMenuResponse {
    success: boolean,
    menu: IMyMenu
}