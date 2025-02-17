import { getAttractionsByCity } from "./att.model.js";

export const getAttractions = async (req, res) => {
    try {
        const { city } = req.params;
        const attractions = await getAttractionsByCity(city);

        if (!attractions.length) {
            return res.status(404).json({ error: `No attractions found for city: ${city}` });
        }

        res.json(attractions);
    } catch (error) {
        console.error("Error fetching attractions:", error);
        res.status(500).json({ error: "Server error" });
    }
};
