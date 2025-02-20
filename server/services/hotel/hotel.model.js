import fs from "fs/promises";

const FILE_PATH = "data/hotels.json";

const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};

const readJsonFile = async (filePath) => {
    try {
        if (!(await fileExists(filePath))) {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const getHotelsByCity = async (city) => {
    const hotelsData = await readJsonFile(FILE_PATH);
    const cityHotels = hotelsData.find(cityData => cityData.city.toLowerCase() === city.toLowerCase());
    return cityHotels ? cityHotels.hotels : [];
};




