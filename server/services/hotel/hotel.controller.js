import { loadHotels } from "./hotel.model.js"; // ✅ Ensure it loads data

export const getHotels = (req, res) => {
    const { city } = req.params;
    console.log("🔍 Fetching hotels for city:", city);

    const hotels = loadHotels(); // ✅ Load from database or JSON file
    const cityHotels = hotels.filter(hotel => hotel.city.toLowerCase() === city.toLowerCase());

    if (cityHotels.length === 0) {
        return res.status(404).json({ message: "No hotels found for this city." });
    }

    res.json(cityHotels);
};
