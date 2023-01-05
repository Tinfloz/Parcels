import express from "express";
import { getChefMenu, getChefsNearby } from "../controllers/menu.controller";
import { isCustomer, protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/get/menu/:id").get(protect, isCustomer, getChefMenu);
router.route("/get/chefs/:latitude/:longitude").get(protect, isCustomer, getChefsNearby);

export default router;

