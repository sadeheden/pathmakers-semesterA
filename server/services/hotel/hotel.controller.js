import { getHotelsByCity } from "./hotel.model.js";

export const getHotels = async (req, res) => {
    try {
        const { city } = req.params;
        const hotels = await getHotelsByCity(city);

        if (!hotels.length) {
            return res.status(404).json({ error: `No hotels found for city: ${city}` });
        }

        res.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        res.status(500).json({ error: "Server error" });
    }
};
