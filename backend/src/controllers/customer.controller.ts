import Customers from "../models/customer.model";
import Orders from "../models/order.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Chefs from "../models/chef.model";
import Menus from "../models/menu.model";
import { getDistance } from "../helpers/get.distance";
import data from "../helpers/constants.json";
import { getTaxes } from "../helpers/get.taxes";
import { qtyZodSchema } from "../zod/customer.zod.schema";

// add to cart 
const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const result = qtyZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return
        };
        const customer = await Customers.findOne({
            userId: req.user!._id
        })
        const menu = await Menus.findById(id)
        for (let element of customer!.cart!) {
            console.log(element.item.toString(), id)
            if (element.item.toString() === id) {
                throw "already in cart"
            };
        };
        const cart = {
            item: menu!._id,
            qty: Number(result.data.qty)
        };
        customer!.cart?.push(cart);
        const updatedCustomer = await (await customer!.save())
            .populate("cart.item", "_id item image price");
        res.status(200).json({
            success: true,
            cart: customer!.cart
        });
        return
    } catch (error: any) {
        if (error === "already in cart") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// remove from cart
const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const customer = await Customers.findOne({
            userId: req.user!._id
        })
        for (let i of customer!.cart!) {
            if (i!._id!.toString() === id) {
                let index = customer!.cart!.indexOf(i);
                customer!.cart!.splice(index, 1);
                await customer!.save();
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

// clear cart
const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customers.findOne({
            userId: req.user!._id
        });
        while (customer!.cart!.length !== 0) {
            customer!.cart!.pop();
        };
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get all cart items
const getAllCartItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customers.findOne({
            userId: req.user!._id
        }).populate({
            path: "cart.item",
            populate: {
                path: "chef"
            }
        });
        res.status(200).json({
            success: true,
            cart: customer!.cart
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// order single item 
const orderSingleItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, qty } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const customer = await Customers.findOne({
            userId: req.user!._id
        });
        const chef = await Chefs.findById(id).populate("menu");
        const menuArray = [];
        const item = {
            qty: Number(qty),
            chef: chef!._id,
        };
        let salesTax = 0;
        let itemTotal = 0;
        if (Menus.instanceOfIMenu(chef!.menu!)) {
            Object.assign(item, { product: chef!.menu!._id });
            salesTax = getTaxes(chef!.menu!.price) * Number(qty)
            itemTotal = chef!.menu!.price * Number(qty);
        };
        menuArray.push(item);
        const distance = getDistance(chef!.latitude!, chef!.longitude!, customer!.latitude!, customer!.longitude!);
        let shippingFee = distance * data.shippingFeePerKilometer;
        let total = Number(itemTotal! + salesTax! + shippingFee);
        const order = await Orders.create({
            items: menuArray,
            shippingFee,
            total,
            salesTax,
            customer: customer!._id
        });
        res.status(200).json({
            success: false,
            order
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// order cart items
const cartToOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customers.findOne({
            userId: req.user!._id
        }).populate({
            path: "cart.item",
            populate: {
                path: "chef",
                select: "_id active latitide longitude"
            }
        });
        let shippingFee = 0;
        let salesTax = 0;
        let totalArray = [];
        let itemsArray = []
        for (let element of customer!.cart!) {
            let itemTotal = 0;
            let shippingFeeCal = 0;
            let salesTaxCal = 0;
            let item = {
                qty: element!.qty
            }
            if (Menus.instanceOfIMenu(element!.item)) {
                itemTotal = element!.item!.price * element.qty!;
                Object.assign(item, {
                    product: element!.item!._id,
                });
                salesTaxCal = getTaxes(element!.item!.price) * Number(element!.qty);
                salesTax += getTaxes(element!.item!.price) * Number(element!.qty);
                if (Chefs.instanceOfIChef(element!.item!.chef)) {
                    Object.assign(item, {
                        chef: element!.item!.chef!._id
                    });
                    const distance = getDistance(element!.item!.chef!.latitude!,
                        element!.item!.chef!.longitude!, customer!.latitude!, customer!.longitude!);
                    shippingFeeCal = distance * data.shippingFeePerKilometer;
                    shippingFee += distance * data.shippingFeePerKilometer;
                };
            };
            itemsArray.push(item);
            let individualTotal = itemTotal + shippingFeeCal + salesTaxCal;
            totalArray.push(individualTotal);
        };
        let total = totalArray.reduce((pv, cv) => pv + cv);
        const order = await Orders.create({
            items: itemsArray,
            shippingFee,
            salesTax,
            total,
            customer: customer!._id
        });
        res.status(200).json({
            success: true,
            order
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// edit cart 
const editCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const customer = await Customers.findOne({
            userId: req.user!._id
        });
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const result = qtyZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error,
            });
            return;
        }
        for (let element of customer!.cart!) {
            if (element!._id!.toString() === id) {
                element!.qty = Number(result.data.qty);
                await customer!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            id,
            qty: result.data.qty
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


export {
    addToCart,
    removeFromCart,
    cartToOrder,
    getAllCartItems,
    clearCart,
    orderSingleItem,
    editCart
};

