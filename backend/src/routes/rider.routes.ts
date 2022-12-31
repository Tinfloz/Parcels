import express from "express";
import { claimDeliveries, getActiveDelivery, getDeliveries, markOrderDelivered } from "../controllers/rider.controller";
import { isRider, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/get/deliveries").get(protect, isRider, getDeliveries);
router.route("/claim/delivery/:id").get(protect, isRider, claimDeliveries);
router.route("/get/active/delivery").get(protect, isRider, getActiveDelivery);
router.route("/mark/order/delivered/:id").get(protect, isRider, markOrderDelivered);

export default router;