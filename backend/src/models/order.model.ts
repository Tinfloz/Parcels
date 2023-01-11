import mongoose from "mongoose";

interface IItems {
    _id?: mongoose.Schema.Types.ObjectId,
    product: mongoose.Schema.Types.ObjectId,
    chef: mongoose.Schema.Types.ObjectId,
    prepared: string,
    qty: number,
    deliveryId: mongoose.Schema.Types.ObjectId
};

export interface IOrder {
    _id: mongoose.Schema.Types.ObjectId,
    items: Array<IItems>,
    shippingFee: number,
    salesTax: number,
    total: number,
    customer: mongoose.Schema.Types.ObjectId,
    isPaid: boolean,
    paidAt: Date,
    rzpOrderId: string
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
                type: String,
                enum: ["Requested", "Rejected", "Accepted", "Prepared", "Collected", "Delivered"],
                default: "Requested"
            },
            deliveryId: {
                type: mongoose.Types.ObjectId,
                ref: "Deliveries"
            }
        }
    ],
    shippingFee: {
        type: Number
    },
    salesTax: {
        type: Number
    },
    total: {
        type: Number
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "Customers"
    },
    paidAt: {
        type: Date
    },
    rzpOrderId: {
        type: String
    }
}, { timestamps: true });

orderSchema.statics.instanceOfIOrder = (param: any): param is IOrder => {
    return param.isPaid !== undefined
};

const Orders = mongoose.model<IOrder, IOrderModel>("Orders", orderSchema);

export default Orders;