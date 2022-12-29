import mongoose from "mongoose";

interface IToBeDelivered {
    chef: mongoose.Schema.Types.ObjectId,
    customer: mongoose.Schema.Types.ObjectId,
};

export interface IRider {
    _id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    active: boolean,
    toBeDelivered: Array<IToBeDelivered>
};

export interface IRiderModel extends mongoose.Model<IRider> {
    instanceOfIRider: (param: any) => param is IRider
};

const riderSchema = new mongoose.Schema<IRider, IRiderModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    active: {
        type: Boolean,
        default: false
    },
    toBeDelivered: [
        {
            chef: {
                type: mongoose.Types.ObjectId,
                ref: "Chefs"
            },
            customer: {
                type: mongoose.Types.ObjectId,
                ref: "Customers"
            }
        }
    ]
}, { timestamps: true })

// static method
riderSchema.statics.instanceOfIRider = (param: any): param is IRider => {
    return param.active !== undefined
};

const Riders = mongoose.model<IRider, IRiderModel>("Riders", riderSchema);

export default Riders;