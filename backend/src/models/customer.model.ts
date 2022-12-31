import mongoose from "mongoose";

export interface ICart {
    _id?: mongoose.Schema.Types.ObjectId,
    item: mongoose.Schema.Types.ObjectId,
    qty?: number
}

export interface ICustomer {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    order: Array<mongoose.Schema.Types.ObjectId>,
    address?: string,
    city?: string,
    state?: string,
    pincode?: string,
    latitude?: number,
    longitude?: number,
    cart?: Array<ICart>
};

export interface ICustomerModel extends mongoose.Model<ICustomer> {
    instanceOfICustomer: (param: any) => param is ICustomer
};

const customerSchema = new mongoose.Schema<ICustomer, ICustomerModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    order: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Orders"
        }
    ],
    cart: [
        {
            item: {
                type: mongoose.Types.ObjectId,
                ref: "Menus"
            },
            qty: {
                type: Number,
                default: 1
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
})

// static method
customerSchema.statics.instanceOfICustomer = (param: any): param is ICustomer => {
    return param.userId !== undefined
};

const Customers = mongoose.model<ICustomer, ICustomerModel>("Customers", customerSchema);
export default Customers;