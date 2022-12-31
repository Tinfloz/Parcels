import mongoose from "mongoose";

export const multiIdValidator = (idArray: Array<string>): boolean => {
    const validationArray = idArray.map(element => {
        if (mongoose.Types.ObjectId.isValid(element)) {
            return true;
        }
        return false;
    });
    const result = validationArray.some(value => value === false);
    return result;
};