import { NextFunction, Request, Response } from "express";
import Users from "../models/all.user.model";
import jwt, { JwtPayload } from "jsonwebtoken";

// user validation
const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                throw "invalid token";
            };
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            req.user = await Users.findById(decoded.id).select("-password")!;
            if (!req.user) {
                throw "user not found"
            }
            next();
        }
    } catch (error: any) {
        if (error === "invalid token") {
            res.status(400).json({
                success: false,
                message: error.errors?.[0]?.message || error
            });
        } else if (error === "user not found") {
            res.status(404).json({
                success: false,
                message: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.errors?.[0]?.message || error
            });
        };
    };
};

// is a chef
const isChef = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (req.user?.userType === "chef") {
            next();
        } else {
            throw "not authorized";
        }
    } catch (error: any) {
        res.status(403).json({
            success: false,
            message: error.errors?.[0]?.message || error
        });
    };
};

// is a rider
const isRider = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (req.user?.userType === "Rider") {
            next();
        } else {
            throw "not authorized";
        }
    } catch (error: any) {
        res.status(403).json({
            success: false,
            message: error.errors?.[0]?.message || error
        });
    };
};

// is a customer
const isCustomer = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user!.userType === "Customer") {
            next()
        };
        throw "not authorized"
    } catch (error: any) {
        res.status(403).json({
            success: false,
            message: error.errors?.[0]?.message || error
        });
    };
};
export {
    protect,
    isRider,
    isChef,
    isCustomer
}