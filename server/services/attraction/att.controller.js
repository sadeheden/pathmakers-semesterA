import { getAttractionsByCity } from "./att.model.js";

// att.controller.js
export const getAttractions = async (req, res) => {
    const { city } = req.params;
    try {
      // כאן תוסיף את הלוגיקה לשליפת האטרקציות מתוך מקור נתונים כלשהו
      const attractions = await fetchAttractionsFromDatabase(city); // או כל שליפה אחרת
      
      if (!attractions || attractions.length === 0) {
        return res.status(404).json({ message: "No attractions found." });
      }
  
      res.status(200).json(attractions);
    } catch (error) {
      console.error("Error fetching attractions:", error);
      res.status(500).json({ message: "Failed to fetch attractions" });
    }
  };
  