import { loadHotels } from "./hotel.model.js"; // ✅ Only importing (no redeclaration)

export const getHotels = async (req, res) => {
    const { city } = req.params;
    console.log("🔍 Fetching hotels for:", city);

    try {
        const hotels = await loadHotels(); // ✅ Using imported function

        if (!hotels || hotels.length === 0) {
            return res.status(500).json({ message: "Hotels data is unavailable." });
        }

        const cityHotels = hotels.find(h => h.city.toLowerCase() === city.toLowerCase());

        if (!cityHotels) {
            console.warn(`🚨 No hotels found for city: ${city}`);
            return res.status(404).json({ message: `No hotels found for ${city}.` });
        }

        console.log(`✅ Found ${cityHotels.hotels.length} hotels for ${city}`);
        return res.json(cityHotels.hotels);
    } catch (error) {
        console.error("❌ Error fetching hotels:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
