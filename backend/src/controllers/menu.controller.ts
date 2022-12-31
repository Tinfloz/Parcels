import { Request, Response } from "express";
import mongoose from "mongoose";
import Orders from "../models/order.model";
import * as Redis from "redis";
import Chefs from "../models/chef.model";
import { getDistance } from "../helpers/get.distance";
import Customers from "../models/customer.model";

// connect to redis
const redisClient = Redis.createClient();
redisClient.connect();

// get chef menu
const getChefMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id invalid";
        };
        const order = await Orders.find({
            chef: {
                $in: id
            }
        });
        res.status(200).json({
            success: false,
            order
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get all chefs near by
const getChefsNearby = async (req: Request, res: Response): Promise<void> => {
    try {
        const { latitude, longitude } = req.params;
        const customer = await Customers.findOne({
            userId: req.user!._id
        });
        const chefsArray = [];
        if (Number(latitude) === Number(customer!.latitude) &&
            Number(longitude) === Number(customer!.longitude)) {
            const data = await redisClient.get(`${customer!._id}Nearby`);
            if (data) {
                res.status(200).json({
                    success: true,
                    data: JSON.parse(data)
                });
                return;
            };
            for await (let chef of Chefs.find()) {
                let distance = getDistance(Number(latitude), Number(longitude),
                    Number(customer!.latitude), Number(customer!.longitude));
                if (distance < 8) {
                    chefsArray.push(chef);
                }
            };
            redisClient.set(`${customer!._id}Nearby`, JSON.stringify(chefsArray));
            res.status(200).json({
                success: true,
                chefsArray
            });
            return;
        };
        for await (let chef of Chefs.find()) {
            let distance = getDistance(Number(latitude), Number(longitude),
                Number(customer!.latitude), Number(customer!.longitude));
            if (distance < 8) {
                chefsArray.push(chef);
            }
        };
        res.status(200).json({
            success: 200,
            chefsArray
        });
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