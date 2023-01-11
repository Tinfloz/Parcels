import mongoose from "mongoose";
import shortid from "shortid";
import { Request, Response } from "express";
import Orders from "../models/order.model";
import razorpay from "razorpay";
import crypto from "crypto";
import { orderZodSchema } from "../zod/order.zod.schema";
import Chefs from "../models/chef.model";
import { multiIdValidator } from "../helpers/multi.id.validator";
import Customers from "../models/customer.model";
import Deliveries from "../models/pending.delivery.model";

// pay for order
const rzpPayForOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found";
        };
        const rzpInstance = new razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        });
        let options = {
            amount: Number(order.total) * 100,
            currency: "INR",
            receipt: shortid.generate()
        };
        let rzpOrder;
        try {
            rzpOrder = await rzpInstance.orders.create(options);
        } catch (error: any) {
            throw new Error("could not create order", { cause: error })
        };
        res.status(200).json({
            success: true,
            rzpOrder
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// update order to be paid
const updateOrderToBePaid = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found";
        };
        const customer = await Customers.findOne({
            userId: req.user!._id
        })
        const result = orderZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature, } = result.data;
        let shasum = crypto.createHmac("sha256", process.env.RZP_KEY_SECRET!);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
        let digest = shasum.digest("hex");
        if (digest !== razorpaySignature) {
            throw "payment not legit"
        };
        order!.isPaid = true;
        order!.paidAt = new Date();
        order!.rzpOrderId = razorpayOrderId;
        await order!.save();
        for (let element of order!.items!) {
            const chef = await Chefs.findById(element!.chef);
            chef!.requestedOrders?.push({
                qty: Number(element!.qty),
                orderId: order!._id,
                elementId: element!._id!,
            });
            await chef!.save();
        };
        customer!.orders.push(order._id);
        await customer!.save();
        res.status(200).json({
            success: true,
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get requested orders
// const getRequestedOrders = async (req: Request, res: Response) => {
//     try {
//         const chef = await Chefs.findOne({
//             userId: req.user!._id
//         }).populate({
//             path: "requestedOrders.orderId",
//             select: "_id customer",
//             populate: {
//                 path: "customer",
//                 select: "_id userId",
//                 populate: {
//                     path: "userId",
//                     select: "_id name"
//                 }
//             }
//         });
//         res.status(200).json({
//             success: true,
//             orders: chef!.requestedOrders!
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             succes: false,
//             error: error.errors?.[0]?.message || error
//         });
//     };
// };

// get accepted orders
// const getAcceptedOrders = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const chef = await Chefs.findOne({
//             userId: req.user!._id
//         }).populate({
//             path: "acceptedOrders.orderId",
//             select: "_id customer",
//             populate: {
//                 path: "customer"
//             }
//         });
//         res.status(200).json({
//             success: true,
//             order: chef!.acceptedOrders
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             succes: false,
//             error: error.errors?.[0]?.message || error
//         });
//     };
// };

const markOrdersPrepared = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, elementId } = req.params;
        if (multiIdValidator([orderId, elementId])) {
            throw "id invalid";
        };
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const order = await Orders.findById(orderId).populate("customer");
        if (!order) {
            throw "order not found";
        };
        for (let element of order!.items) {
            if (element._id!.toString() === elementId) {
                console.log(element._id!.toString() === elementId)
                element!.prepared = "Prepared";
                await order!.save();
                break;
            };
        };
        let pickUpAddress = {
            address: chef!.address,
            city: chef!.city,
            state: chef!.state,
            pincode: chef!.pincode,
            latitude: chef!.latitude,
            longitude: chef!.longitude
        };
        let dropAddress = {

        };
        if (Customers.instanceOfICustomer(order!.customer)) {
            Object.assign(dropAddress, {
                address: order!.customer!.address,
                city: order!.customer!.city,
                state: order!.customer!.state,
                pincode: order!.customer!.pincode,
                latitude: order!.customer!.latitude,
                longitude: order!.customer!.longitude
            });
        };
        const newDelivery = await Deliveries.create({
            pickUpAddress,
            dropAddress,
            orderId,
            elementId
        });
        if (!newDelivery) {
            throw "Delivery could not be created"
        };
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// delete order from datatbase
const deleteOrderFromDb = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found"
        };
        await order!.remove();
        res.status(200).json({
            success: true
        })
    } catch (error: any) {
        if (error === "order not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                succes: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// get all orders of customer
const getAllOrdersCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customers.findOne({
            userId: req.user!._id
        }).populate({
            path: "orders",
            select: "items total _id",
            populate: {
                path: "items.product",
                select: "price _id item image chef",
                populate: {
                    path: "chef",
                    select: "_id userId",
                    populate: {
                        path: "userId",
                        select: "_id name"
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            myOrders: customer!.orders
        })
        return
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    rzpPayForOrder,
    updateOrderToBePaid,
    getRequestedOrders,
    getAcceptedOrders,
    markOrdersPrepared,
    deleteOrderFromDb,
    getAllOrdersCustomer
};

const getRequestedOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        }).populate({
            path: "requestedOrders.orderId",
            select: "_id customer",
            populate: {
                path: "customer",
                select: "_id userId",
                populate: {
                    path: "userId",
                    select: "_id name"
                }
            }
        });
        res.status(200).json({
            success: true,
            orders: chef!.requestedOrders
        });
        return
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get accepted orders
const getAcceptedOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        }).populate({
            path: "acceptedOrders.orderId",
            select: "_id customer",
            populate: {
                path: "customer",
                select: "_id userId",
                populate: {
                    path: "userId",
                    populate: "_id name"
                }
            }
        });
        res.status(200).json({
            success: true,
            orders: chef!.acceptedOrders
        });
        return
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};