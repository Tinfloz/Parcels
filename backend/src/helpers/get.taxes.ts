import data from "./constants.json";

export const getTaxes = (price: number): number => {
    return price * data.salesTax
}