import { Request, Response } from "express";
import mongoose from "mongoose";
import Chefs from "../models/chef.model";
import Customers from "../models/customer.model";
import Menus from "../models/menu.model";
import Orders from "../models/order.model";
import Deliveries from "../models/pending.delivery.model";
import { menuUpdateZodSchema, menuZodSchema } from "../zod/chef.zod.schema";


// set profile to active
const toggleActiveState = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        if (chef!.active) {
            chef!.active = false;
        } else if (!chef!.active) {
            chef!.active = true;
        };
        await chef!.save();
        res.status(200).json({
            success: true,
            active: chef!.active
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// create menu
const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = menuZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { item, image, left, price } = result.data;
        const chef = await Chefs.findOne({
            userId: req.user!._id
        })
        const menu = await Menus.create({
            item,
            image,
            left: Number(left),
            price: Number(price),
            chef: chef!._id
        });
        chef!.menu = menu._id;
        if (!chef!.active) {
            chef!.active = true;
        }
        await chef!.save();
        res.status(200).json({
            success: true,
            chef
        })
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// update menu 
const updateMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id"
        };
        const menu = await Menus.findById(id);
        if (!menu) {
            throw "menu not found"
        };
        const result = menuUpdateZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const { item, image, left, price } = result.data;
        if (menu.chef.toString() !== chef!._id.toString()) {
            throw "not authorized"
        };
        menu.item = item || menu.item;
        menu.image = image || menu.image;
        menu.left = Number(left) || menu.left;
        menu.price = Number(price) || menu.price;
        await menu.save();
    } catch (error: any) {
        if (error === "menu not found") {
            res.status(404).json({
                succes: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorized") {
            res.status(403).json({
                succes: false,
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

// delete menu 
const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "invalid id"
        };
        const menu = await Menus.findById(id);
        if (!menu) {
            throw "menu not found"
        };
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        if (menu!.chef.toString() !== chef!._id.toString()) {
            throw "not authorized"
        };
        chef!.menu = undefined;
        await chef!.save();
        await menu.remove();
        res.status(200).json({
            success: false,
            chef
        });
    } catch (error: any) {
        if (error === "menu not found") {
            res.status(404).json({
                succes: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorized") {
            res.status(403).json({
                succes: false,
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

// accept orders
const acceptOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const { id } = req.params;
        for (let i of chef!.requestedOrders!) {
            if (i._id.toString() === id) {
                let index = chef!.requestedOrders!.indexOf(i);
                chef!.requestedOrders!.splice(index, 1);
                chef!.acceptedOrders!.push(i);
                await chef!.save();
                break;
            };
        };
        res.status(200).json({
            success: false,
            id
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// reject orders
const rejectOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        for (let i of chef!.requestedOrders!) {
            if (i._id.toString() === id) {
                let index = chef!.requestedOrders!.indexOf(i);
                chef!.requestedOrders!.splice(index, 1);
                await chef!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            id
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// mark orders prepared
const markOrdersPrepared = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const order = await Orders.findById(id).populate("customer",
            "address city state pincode latitude longitude");
        if (!order) {
            throw "order not found";
        };
        for (let i of order!.items!) {
            if (i.chef.toString() === chef?._id.toString()) {
                i.prepared = true;
                await order!.save();
                break;
            };
        };
        const pickUpAddress = {
            address: chef!.address,
            city: chef!.city,
            state: chef!.state,
            pincode: chef!.pincode,
            latitude: chef!.latitude,
            longitude: chef!.longitude
        };
        let dropAddress = {};
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
        await Deliveries.create({
            pickUpAddress,
            dropAddress,
            orderId: id
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    toggleActiveState,
    createMenu,
    acceptOrders,
    rejectOrders,
    markOrdersPrepared
}