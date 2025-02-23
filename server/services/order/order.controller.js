import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadOrders, saveOrders } from "./order.model.js";
import { v4 as uuidv4 } from "uuid";
import pdf from "html-pdf";

// ✅ Get all orders for a user
export const getUserOrders = (req, res) => {
    try {
        const userId = req.user.id; // ✅ Extract user ID from token
        const orders = loadOrders(); // ✅ Load all orders from JSON file

        console.log("🔍 All Orders:", orders); // Debugging

        const userOrders = orders.filter(order => order.userId === userId);
        
        if (!userOrders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json(userOrders);
    } catch (error) {
        console.error("⚠️ Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfDir = path.join(__dirname, "../../data/pdfs");

// Ensure PDF directory exists
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

// ✅ Save a new order and generate PDF
export const createOrder = async (req, res) => {
    try {
        const { departureCity, destinationCity, flight, hotel, attractions, transportation, paymentMethod, totalPrice } = req.body;
        const userId = req.user.id;

        const orderId = uuidv4();
        const newOrder = {
            id: orderId,
            userId,
            departureCity,
            destinationCity,
            flight,
            hotel,
            attractions,
            transportation,
            paymentMethod,
            totalPrice,
            createdAt: new Date(),
        };

        const orders = loadOrders();
        orders.push(newOrder);
        saveOrders(orders);

        // ✅ Generate and save PDF
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);
        const pdfContent = `
            <h1>Travel Invoice</h1>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Departure City:</strong> ${departureCity}</p>
            <p><strong>Destination City:</strong> ${destinationCity}</p>
            <p><strong>Flight:</strong> ${flight || "N/A"}</p>
            <p><strong>Hotel:</strong> ${hotel || "N/A"}</p>
            <p><strong>Attractions:</strong> ${attractions?.join(", ") || "N/A"}</p>
            <p><strong>Transportation:</strong> ${transportation || "N/A"}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <h2>Total Price: $${totalPrice}</h2>
        `;

        pdf.create(pdfContent).toFile(pdfPath, (err) => {
            if (err) {
                console.error("⚠️ Error generating PDF:", err);
                return res.status(500).json({ message: "Error generating PDF" });
            }
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("⚠️ Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Serve the PDF file
export const getOrderPDF = (req, res) => {
    const { orderId } = req.params;
    const pdfPath = path.join(pdfDir, `${orderId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ message: "PDF not found" });
    }

    res.sendFile(pdfPath);
};
