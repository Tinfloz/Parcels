import { Request, Response } from "express";
import mongoose from "mongoose";
import Chefs from "../models/chef.model";
import Menus from "../models/menu.model";
import Orders from "../models/order.model";
import { menuUpdateZodSchema, menuZodSchema } from "../zod/chef.zod.schema";


// create menu
const createMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("runningb create menue")
        const result = menuZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { item, image, left, price } = result.data;
        console.log(result.data)
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
            menu
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
        })
        const menu = await Menus.findOne({
            chef: chef!._id
        });
        if (!menu) {
            throw "menu not found";
        };
        const { item, image, left, price } = result.data;
        menu!.item = item || menu!.item;
        menu!.image = image || menu!.image;
        menu!.left = Number(left) || menu!.left;
        menu!.price = Number(price) || menu!.price;
        await menu!.save();
        res.status(200).json({
            success: true,
            item: menu!.item, image: menu!.image, left: menu!.left, price: menu!.price
        })
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// delete menu 
const deleteMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        const menu = await Menus.findOne({
            chef: chef!._id
        });
        if (!menu) {
            throw "menu not found"
        }
        if (menu!.chef.toString() !== chef!._id.toString()) {
            throw "not authorized"
        };
        chef!.menu = undefined;
        await chef!.save();
        await menu!.remove();
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
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid";
        };
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        for (let element of chef!.requestedOrders!) {
            if (element._id!.toString() === id) {
                let index = chef!.requestedOrders!.indexOf(element);
                chef!.requestedOrders!.splice(index, 1);
                chef!.acceptedOrders!.push(element);
                const order = await Orders.findById(element!.orderId);
                for (let i of order!.items) {
                    if (i._id!.toString() === element!.elementId.toString()) {
                        i.status = "Accepted"
                        break;
                    };
                };
                await order!.save();
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

// reject order
// TODO: add refund logic
const rejectOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const chef = await Chefs.findOne({
            userId: req.user!._id
        });
        for (let element of chef!.requestedOrders!) {
            if (element!._id!.toString() === id) {
                let index = chef!.requestedOrders!.indexOf(element);
                chef!.requestedOrders!.splice(index, 1);
                const order = await Orders.findById(element!.orderId);
                for (let i of order!.items) {
                    if (i._id!.toString() === element!.elementId.toString()) {
                        i.status = "Rejected";
                        break;
                    };
                };
                await chef!.save();
                await order!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            id
        })
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get my menu
const getMyMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const chef = await Chefs.findOne({
            userId: req.user!._id
        }).populate("menu", "_id image left price item chef");
        res.status(200).json({
            success: true,
            menu: chef!.menu
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


export {
    createMenu,
    acceptOrders,
    rejectOrders,
    updateMenu,
    deleteMenu,
    getMyMenu
}


