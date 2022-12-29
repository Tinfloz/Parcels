import mongoose from "mongoose";

interface IAddresses {
    address: string,
    city: string,
    state: string,
    pincode: string,
    latitude: number,
    longitude: number
}

export interface IDeliveryRequests {
    _id: string,
    claimed: boolean,
    pickUpAddress: IAddresses,
    dropAddress: IAddresses,
    orderId: mongoose.Schema.Types.ObjectId,
    rider?: mongoose.Schema.Types.ObjectId
};

interface IDeliveryRequestsModel extends mongoose.Model<IDeliveryRequests> {
    instanceOfIDeliveryRequests: (param: any) => param is IDeliveryRequests
};

const deliveryRequestSchema = new mongoose.Schema<IDeliveryRequests, IDeliveryRequestsModel>({
    claimed: {
        type: Boolean,
        default: false
    },
    pickUpAddress: {
        type: Object
    },
    dropAddress: {
        type: Object
    },
    rider: {
        type: mongoose.Types.ObjectId
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "Orders"
    }
}, { timestamps: true });

// static method
deliveryRequestSchema.statics.instanceOfIDeliveryRequests = (param: any): param is IDeliveryRequests => {
    return param.claimed !== undefined;
};

const Deliveries = mongoose.model<IDeliveryRequests, IDeliveryRequestsModel>("Deliveries", deliveryRequestSchema);

export default Deliveries;