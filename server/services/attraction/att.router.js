import express from "express";
import { getAttractionsByCity } from "./att.controller.js";

const router = express.Router();

router.get('/',getAttractionsByCity);

export default router;