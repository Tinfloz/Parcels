import { Request, Response } from "express";
import mongoose from "mongoose";
import Orders from "../models/order.model";
import * as Redis from "redis";
import Chefs from "../models/chef.model";
import { getDistance } from "../helpers/get.distance";
import Customers from "../models/customer.model";
import Users from "../models/all.user.model";
import Menus from "../models/menu.model";

// connect to redis
const redisClient = Redis.createClient();
redisClient.connect();

// get chef menu
const getChefMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("in api menu chef")
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid"
        };
        const chef = await Chefs.findById(id).select("_id menu userId").populate([{
            path: "menu",
            select: "_id price left image item",
        }, { path: "userId", select: "name" }])
        res.status(200).json({
            success: true,
            menu: chef
        });
        return
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get chefs nearby
const getChefsNearby = async (req: Request, res: Response): Promise<void> => {
    try {
        const { latitude, longitude } = req.params;
        const customer = await Customers.findOne({
            userId: req.user!._id
        });
        let chefsArray = [];
        if (Number(latitude) === customer!.latitude && Number(longitude) === customer!.longitude) {
            let data = await redisClient.get(`${customer?.userId}NearbyChefs`);
            if (data) {
                res.status(200).json({
                    success: true,
                    items: JSON.parse(data)
                });
                return
            };
            for await (let chef of Chefs.find().select("userId active latitude longitude").populate("userId", "name _id")) {
                if (chef!.active) {
                    let distance = getDistance((Math.round(Number(latitude) * 1e5) / 1e5), (Math.round(Number(longitude) * 1e5) / 1e5),
                        (Math.round(chef!.latitude * 1e5) / 1e5), (Math.round(chef!.longitude * 1e5) / 1e5));
                    if (distance < 8) {
                        chefsArray.push(chef);
                    };
                };
            };
            redisClient.setEx(`${customer?.userId}NearbyChefs`, 3600, JSON.stringify(chefsArray));
        } else {
            for await (let chef of Chefs.find().select("_id userId active latitude longitude").populate("userId", "name _id")) {
                if (chef!.active) {
                    let distance = getDistance((Math.round(Number(latitude) * 1e5) / 1e5), (Math.round(Number(longitude) * 1e5) / 1e5),
                        (Math.round(chef!.latitude * 1e5) / 1e5), (Math.round(chef!.longitude * 1e5) / 1e5));
                    if (distance < 8) {
                        chefsArray.push(chef);
                    };
                };
            };
        };
        res.status(200).json({
            success: true,
            items: chefsArray
        });
        return
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};
export {
    getChefMenu,
    getChefsNearby
};


