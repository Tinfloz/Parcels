import mongoose from "mongoose";
import Users from "../models/all.user.model";
import Riders from "../models/rider.model";
import Chefs from "../models/chef.model";
import Customers from "../models/customer.model";
import { Request, Response } from "express";
import { addressZodSchema, userZodSchema } from "../zod/user.zod.schema";
import { getToken } from "../utils/get.access.token";
import { getLatLong } from "../helpers/get.lat.lon";

// register user 
const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = userZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error,
            });
            return
        };
        const { email, password, name, userType } = result.data;
        const userExists = await Users.findOne({
            email
        });
        if (userExists) {
            throw "user already exists"
        };
        const user = await Users.create({
            email,
            password,
            name,
            userType
        });
        if (!user) {
            throw "user could not be created"
        };
        let loginUser;
        if (userType === "Chef") {
            loginUser = await Chefs.create({
                userId: user!._id
            });
        } else if (userType === "Customer") {
            loginUser = await Customers.create({
                userId: user!._id
            });
        } else {
            loginUser = await Riders.create({
                userId: user!._id
            });
        };
        let sendUser = {
            email,
            name,
            token: getToken(user!._id),
            userType,
            loginUser
        }
        res.status(200).json({
            sendUser
        });
    } catch (error: any) {
        if (error === "user already exists") {
            res.status(400).json({
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

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = userZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error,
            });
            return
        };
        const { email, password } = result.data;
        const user = await Users.findOne({
            email
        });
        if (user && await user.matchPassword(password)) {
            let loginUser;
            switch (user!.userType) {
                case "Chef":
                    loginUser = await Chefs.findOne({
                        userId: user._id
                    });
                    break;
                case "Customer":
                    loginUser = await Customers.findOne({
                        userId: user!._id
                    }).populate({
                        path: "cart.item",
                        populate: {
                            path: "chef"
                        }
                    });;
                    break;
                case "Rider":
                    loginUser = await Riders.findOne({
                        userId: user!._id
                    });
                    break;
            };
            let sendUser = {
                email,
                name: user!.name,
                userType: user!.userType,
                token: getToken(user!._id),
                loginUser
            };
            res.status(200).json({
                sendUser
            });
        } else {
            if (!user) {
                throw "user not found"
            } else {
                throw "passwords don't match"
            }
        };
    } catch (error: any) {
        console.log(error)
        if (error === "user not found") {
            res.status(404).json({
                succes: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "passwords don't match") {
            res.status(400).json({
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

const setAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = addressZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error,
            });
            return
        };
        const user = await Users.findById(req.user!._id);
        const { address, city, state, pincode } = result.data;
        const userAddress = `${address}, ${city}`;
        console.log(userAddress)
        const [latitude, longitude] = await getLatLong(userAddress);
        if (user?.userType === "Chef") {
            await Chefs.findOneAndUpdate({ userId: user!._id }, {
                address, city, state, pincode,
                latitude, longitude
            }, { new: true });

        } else if (user?.userType === "Customer") {
            await Customers.findOneAndUpdate({ userId: user!._id }, {
                address, city, state, pincode,
                latitude, longitude
            }, { new: true });
        };
        res.status(200).json({
            success: true,
            address, city, state, pincode,
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const toggleVisibilityUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await Users.findById(req.user!._id);
        let visibility = false;
        switch (user!.userType) {
            case "Chef":
                const chef = await Chefs.findOne({
                    userId: user!._id
                });
                chef!.active ? chef!.active = false : chef!.active = true;
                visibility = chef!.active;
                await chef!.save();
                break;
            case "Rider":
                const rider = await Riders.findOne({
                    userId: user!._id
                });
                rider!.active ? rider!.active = false : rider!.active = true;
                visibility = chef!.active;
                await rider!.save();
                break;
        };
        res.status(200).json({
            success: true,
            visibility
        });
    } catch (error: any) {
        res.status(500).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    login,
    register,
    setAddress,
    toggleVisibilityUser
}