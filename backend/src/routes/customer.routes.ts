import express from "express";
import { addToCart, cartToOrder, clearCart, editCart, getAllCartItems, orderSingleItem, removeFromCart } from "../controllers/customer.controller";
import { isCustomer, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add/cart/:id").get(protect, isCustomer, addToCart);
router.route("/remove/item/:id").get(protect, isCustomer, removeFromCart);
router.route("/order/cart").get(protect, isCustomer, cartToOrder);
router.route("/get/cart/items").get(protect, isCustomer, getAllCartItems);
router.route("/clear/cart").get(protect, isCustomer, clearCart);
router.route("/order/single/:id/:qty").get(protect, isCustomer, orderSingleItem);
router.route("/edit/cart/:id").post(protect, isCustomer, editCart);

export default router;