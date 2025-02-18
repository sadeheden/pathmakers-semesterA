import fs from "fs/promises";

const FILE_PATH = "data/attractions.json";

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
            await fs.writeFile(filePath, JSON.stringify({}, null, 2));
            return {};
        }
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return {};
    }
};
export const getAttractionsByCity = async (city) => {
    const attractionsData = await readJsonFile(FILE_PATH);
    console.log("Loaded attractions data:", attractionsData);

    const cityLowerCase = city.toLowerCase();

    // Look for the city inside the attractions array
    const cityAttractions = attractionsData.attractions.find(
        (entry) => entry.city.toLowerCase() === cityLowerCase
    );

    console.log("City attractions found:", cityAttractions);

    if (cityAttractions) {
        return cityAttractions.attractions;
    }

    return [];
};
