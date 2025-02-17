import express from "express";
import { getHotels } from "./hotel.controller.js";

const router = express.Router();

router.get("/:city", getHotels);

export default router;
