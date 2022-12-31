import express from "express";
import { login, register, setAddress, toggleVisibilityUser } from "../controllers/all.user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/set/address").post(protect, setAddress);
router.route("/set/visibility").get(protect, toggleVisibilityUser)

export default router;