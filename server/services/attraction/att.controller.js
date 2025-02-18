import { getAttractionsByCity } from "./att.model.js"; // ייבוא הפונקציה

// att.controller.js
export const getAttractions = async (req, res) => {
  const { city } = req.params;
  try {
    // שליפת האטרקציות מהמודל
    const attractions = await getAttractionsByCity(city); 

    // אם לא נמצאו אטרקציות לעיר, נחזיר הודעת שגיאה
    if (!attractions || attractions.length === 0) {
      return res.status(404).json({ 
        message: `No attractions found for ${city}.` 
      });
    }
    // אם נמצאו אטרקציות, נשלח אותן כתגובה
    res.status(200).json(attractions);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res.status(500).json({ message: "Failed to fetch attractions" });
  }
};