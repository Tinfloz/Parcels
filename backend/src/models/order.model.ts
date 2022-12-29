import mongoose from "mongoose";

interface IItems {
    _id: mongoose.Schema.Types.ObjectId,
    product: mongoose.Schema.Types.ObjectId,
    chef: mongoose.Schema.Types.ObjectId,
    prepared: boolean,
    qty: number
};

export interface IOrder {
    _id: string,
    items: Array<IItems>,
    shippingFee: number,
    salesTax: number,
    customer: mongoose.Schema.Types.ObjectId,
    isPaid: boolean,
    paidAt?: Date
};

export interface IOrderModel extends mongoose.Model<IOrder> {
    instanceOfIOrder: (param: any) => param is IOrder
};

const orderSchema = new mongoose.Schema<IOrder, IOrderModel>({
    items: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Menus"
            },
            chef: {
                type: mongoose.Types.ObjectId,
                ref: "Chefs"
            },
            qty: {
                type: Number
            },
            prepared: {
                type: Boolean,
                default: false
            }
        }
    ],
    shippingFee: {
        type: Number
    },
    salesTax: {
        type: Number
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

orderSchema.statics.instanceOfIOrder = (param: any): param is IOrder => {
    return param.isPaid !== undefined
};

const Orders = mongoose.model<IOrder, IOrderModel>("Orders", orderSchema);

export default Orders;