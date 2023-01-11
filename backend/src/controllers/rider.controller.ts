import { Request, Response } from "express";
import mongoose from "mongoose";
import { getDistance } from "../helpers/get.distance";
import { multiIdValidator } from "../helpers/multi.id.validator";
import Orders from "../models/order.model";
import Deliveries from "../models/pending.delivery.model";
import Riders from "../models/rider.model";

// get nearby delivery assignments
const getDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
        const { latitude, longitude } = req.params;
        const deliveriesArray = []
        for await (let delivery of Deliveries.find()) {
            if (!delivery.claimed) {
                let distance = getDistance(Number(latitude), Number(longitude),
                    Number(delivery.pickUpAddress.latitude), Number(delivery.pickUpAddress.longitude))
                let deliveryElement = {
                    distance,
                    pickUp: delivery.pickUpAddress,
                    drop: delivery.dropAddress,
                    deliveryId: delivery._id
                };
                deliveriesArray.push(deliveryElement);
            };
        };
        res.status(200).json({
            success: true,
            deliveriesArray
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// claim deliveries
const claimDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const delivery = await Deliveries.findById(id);
        console.log(delivery, "delivery")
        if (!delivery) {
            throw "delivery not found"
        };
        const rider = await Riders.findOne({
            userId: req.user!._id
        });
        if (!rider!.active) {
            throw "you are inactive"
        }
        delivery!.claimed = true;
        delivery!.rider = rider!._id;
        rider!.activeDeliveries = delivery!._id;
        const order = await Orders.findById(delivery!.orderId);
        for (let element of order!.items) {
            if (element._id!.toString() === delivery!.elementId.toString()) {
                element!.deliveryId = delivery._id;
                break;
            };
        };
        await delivery!.save();
        await rider!.save();
        await order!.save();
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        console.log(error)
        if (error === "delivery not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "you are inactive") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        }
    };
};

// get active delivery
const getActiveDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
        const rider = await Riders.findOne({
            userId: req.user!._id
        }).populate("activeDeliveries", "orderId elementId dropAddress _id pickUpAddress");
        res.status(200).json({
            success: true,
            delivery: rider?.activeDeliveries
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// mark order delivered
const markOrderDelivered = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const delivery = await Deliveries.findById(id);
        if (!delivery) {
            throw "delivery not found"
        };
        const rider = await Riders.findOne({
            userId: req.user!._id
        });
        rider!.activeDeliveries = undefined;
        const order = await Orders.findById(delivery!.orderId);
        for (let element of order!.items) {
            if (element._id!.toString() === delivery.elementId) {
                element.prepared = "Delivered";
                break;
            };
        };
        await rider!.save();
        await order!.save();
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        if (error === "delivery not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// mark order picked up
const markOrderPickedUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, elementId } = req.params;
        if (multiIdValidator([orderId, elementId])) {
            throw "id invalid"
        };
        const order = await Orders.findById(orderId);
        for (let element of order!.items) {
            if (element._id!.toString() === elementId.toString()) {
                element.prepared = "Collected";
                break;
            }
        };
        await order!.save();
        res.status(200).json({
            success: true
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    getDeliveries,
    claimDeliveries,
    markOrderDelivered,
    getActiveDelivery,
    markOrderPickedUp
};

