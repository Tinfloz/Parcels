import express from "express";
import { deleteOrderFromDb, getAcceptedOrders, getAllOrdersCustomer, getRequestedOrders, markOrdersPrepared, rzpPayForOrder, updateOrderToBePaid } from "../controllers/order.controller";
import { isChef, isCustomer, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/order/pay/:id").get(protect, isCustomer, rzpPayForOrder);
router.route("/verify/payment/:id").post(protect, isCustomer, updateOrderToBePaid);
router.route("/get/requested/orders").get(protect, isChef, getRequestedOrders);
router.route("/get/accepted/orders").get(protect, isChef, getAcceptedOrders);
router.route("/prepared/:orderId/:elementId").get(protect, isChef, markOrdersPrepared);
router.route("/delete/order/:id").get(protect, isCustomer, deleteOrderFromDb);
router.route("/get/my/orders").get(protect, isCustomer, getAllOrdersCustomer);

export default router;