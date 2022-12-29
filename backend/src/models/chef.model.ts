import mongoose from "mongoose";

export interface IOrdersToBe {
    _id: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
    orderId: mongoose.Schema.Types.ObjectId,
    qty: number
}

export interface IChef {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    active: boolean,
    menu?: mongoose.Schema.Types.ObjectId,
    requestedOrders?: Array<IOrdersToBe>,
    acceptedOrders?: Array<IOrdersToBe>
    address?: string,
    city?: string,
    state?: string,
    pincode?: string,
    latitude?: number,
    longitude?: number
};

export interface IChefModel extends mongoose.Model<IChef> {
    instanceOfIChef: (param: any) => param is IChef
};

const chefSchema = new mongoose.Schema<IChef, IChefModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    active: {
        type: Boolean,
        default: false
    },
    menu: {
        type: mongoose.Types.ObjectId,
        ref: "Menus"
    },
    requestedOrders: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "Customers"
            },
            qty: {
                type: Number,
            },
            orderId: {
                type: mongoose.Types.ObjectId,
                ref: "Orders"
            }
        }
    ],
    acceptedOrders: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                ref: "Customers"
            },
            qty: {
                type: Number,
            },
            orderId: {
                type: mongoose.Types.ObjectId,
                ref: "Orders"
            }
        }
    ],
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pincode: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
}, { timestamps: true })

chefSchema.statics.instanceOfIChef = (param: any): param is IChef => {
    return param.active !== undefined
};

const Chefs = mongoose.model<IChef, IChefModel>("Chefs", chefSchema);
export default Chefs;