import express from "express";
import { getCitiesList } from "./cities.controller.js";

const router = express.Router();

router.get("/", getCitiesList);

export default router;

