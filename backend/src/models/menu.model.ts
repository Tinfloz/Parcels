import mongoose from "mongoose";

export interface IMenu {
    _id: mongoose.Schema.Types.ObjectId,
    image: string,
    chef: mongoose.Schema.Types.ObjectId,
    item: string,
    left: number,
    expire_at?: Date
}

export interface IMenuModel extends mongoose.Model<IMenu> {
    instanceOfIMenu: (param: any) => param is IMenu
};

const menuSchema = new mongoose.Schema<IMenu, IMenuModel>({
    image: {
        type: String
    },
    chef: {
        type: mongoose.Types.ObjectId,
        ref: "Chefs"
    },
    item: {
        type: String
    },
    left: {
        type: Number
    },
    expire_at: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true })

menuSchema.index({ "expire_at": 1 }, { expireAfterSeconds: 5 })

// static method
menuSchema.statics.instanceOfIMenu = (param: any): param is IMenu => {
    return param.item !== undefined
};

const Menus = mongoose.model<IMenu, IMenuModel>("Menu", menuSchema);
export default Menus;