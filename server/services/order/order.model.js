import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(process.cwd(), 'data', 'orders.json');

// ✅ Load orders from JSON file
export const loadOrders = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    }
    return []; // Default to an empty array if no data exists
};

// ✅ Save orders to JSON file
export const saveOrders = (orders) => {
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));
};
