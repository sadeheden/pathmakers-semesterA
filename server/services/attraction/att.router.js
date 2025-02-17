import express from "express";
import { getAttractions } from "./att.controller.js";

const router = express.Router();

router.get("/:city", getAttractions);

export default router;
