import express from "express";
import { acceptOrders, createMenu, deleteMenu, rejectOrders, updateMenu } from "../controllers/chef.controller";
import { isChef, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/set/visibility/client").post(protect, isChef, createMenu);
router.route("/accept/order/:id").get(protect, isChef, acceptOrders);
router.route("/reject/order/:id").get(protect, isChef, rejectOrders);
router.route("/update/menu").post(protect, isChef, updateMenu);
router.route("/delete/menu").get(protect, isChef, deleteMenu);

export default router;