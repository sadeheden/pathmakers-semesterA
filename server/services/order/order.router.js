import express from "express";
import { createOrder, getUserOrders } from "./order.controller.js";
import authenticateUser from "../middleware/authenticateUser.js"; // ✅ Import correctly

const router = express.Router();

router.post("/", authenticateUser, createOrder); // ✅ Use correct middleware
router.get("/", authenticateUser, getUserOrders); // ✅ Use correct middleware

export default router;
