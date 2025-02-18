import express from "express";
import { getAttractionsByCity } from "./att.controller.js";

const router = express.Router();

router.get("/:city", async (req, res) => {
  const { city } = req.params;
  try {
    const attractions = await getAttractionsByCity(city);

    if (!attractions.length) {
      return res.status(404).json({ error: `No attractions found for city: ${city}` });
    }

    res.json(attractions);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;