import express from "express";
import * as controller from "../controllers/authController.js";

console.log("Controller exports:", controller);

const router = express.Router();

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

export default router;

