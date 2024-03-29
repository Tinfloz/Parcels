import express from "express";
import { claimDeliveries, getActiveDelivery, getDeliveries, markOrderDelivered, markOrderPickedUp } from "../controllers/rider.controller";
import { isRider, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/deliveries/:latitude/:longitude").get(protect, isRider, getDeliveries);
router.route("/claim/delivery/:id").get(protect, isRider, claimDeliveries);
router.route("/get/active/delivery").get(protect, isRider, getActiveDelivery);
router.route("/mark/order/delivered/:id").get(protect, isRider, markOrderDelivered);
router.route("/picked/:orderId/:elementId").get(protect, isRider, markOrderPickedUp);

export default router;