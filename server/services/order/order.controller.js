import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadOrders, saveOrders } from "./order.model.js"; // ✅ Correct import
import { v4 as uuidv4 } from "uuid";
import pdf from "html-pdf";

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfDir = path.join(__dirname, "../../data/pdfs");

// Ensure PDF directory exists
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

// ✅ Get all orders for a user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure the user ID is extracted
        console.log("🔍 Fetching orders for user:", userId);

        const orders = loadOrders().filter(order => order.userId === userId); // Filter orders for the specific user

        console.log("✅ Orders found:", orders);
        return res.status(200).json(orders);
    } catch (error) {
        console.error("⚠️ Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// ✅ Save a new order and generate PDF
export const createOrder = async (req, res) => {
    try {
        const { departureCity, destinationCity, flight, hotel, attractions, transportation, paymentMethod, totalPrice } = req.body;
        
        if (!req.user || !req.user.id) {
            console.error("❌ User ID is missing in request.");
            return res.status(401).json({ message: "Unauthorized: User not identified" });
        }

        const userId = String(req.user.id); // Ensure user ID is a string
        const username = req.user.username;

        const orderId = uuidv4();
        const newOrder = {
            id: orderId,
            userId,
            username,
            departureCity,
            destinationCity,
            flight,
            hotel,
            attractions,
            transportation,
            paymentMethod,
            totalPrice,
            createdAt: new Date().toISOString(),
        };

        console.log("🔍 New order to be saved:", newOrder); // Log the new order before saving

        // Save the order to JSON storage
        const orders = loadOrders();
        orders.push(newOrder);
        saveOrders(orders);

        console.log("✅ Order saved successfully!");

        return res.status(201).json(newOrder);
    } catch (error) {
        console.error("⚠️ Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// ✅ Serve the PDF file
export const getOrderPDF = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // ✅ Fix extracting Bearer token
        console.log("🔍 Token received:", token); // Debugging
        
        if (!token) {
            console.warn("⚠️ No token provided.");
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const { orderId } = req.params;
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);

        console.log(`🔍 Looking for PDF at: ${pdfPath}`); // Debugging

        if (!fs.existsSync(pdfPath)) {
            console.error("⚠️ PDF not found:", pdfPath);
            return res.status(404).json({ message: "PDF not found" });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");
        res.sendFile(pdfPath);
    } catch (error) {
        console.error("⚠️ Error serving PDF:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

