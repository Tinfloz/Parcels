import express from "express";
import { getAcceptedOrders, getRequestedOrders, markOrdersPrepared, rzpPayForOrder, updateOrderToBePaid } from "../controllers/order.controller";
import { isChef, isCustomer, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/order/pay/:id").get(protect, isCustomer, rzpPayForOrder);
router.route("/verify/payment/:id").post(protect, isCustomer, updateOrderToBePaid);
router.route("/get/requested/orders").get(protect, isChef, getRequestedOrders);
router.route("/get/accepted/orders").get(protect, isChef, getAcceptedOrders);
router.route("/mark/orders/prepared").get(protect, isChef, markOrdersPrepared);

export default router;