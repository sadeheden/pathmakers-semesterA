import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadOrders, saveOrders } from "./order.model.js"; // ✅ Correct import
import { v4 as uuidv4 } from "uuid";
import pdfkit from "pdfkit";

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

        console.log("🔍 New order to be saved:", newOrder);

        // Save the order to JSON storage
        const orders = loadOrders();
        orders.push(newOrder);
        saveOrders(orders);

        console.log("✅ Order saved successfully! Now generating PDF...");

        // ✅ Generate PDF
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);
        const doc = new pdfkit();
        const stream = fs.createWriteStream(pdfPath);

        doc.pipe(stream);
        doc.fontSize(20).text("Pathmskers- recept", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Order ID: ${newOrder.id}`);
        doc.text(`Username: ${newOrder.username}`);
        doc.text(`Departure City: ${newOrder.departureCity}`);
        doc.text(`Destination City: ${newOrder.destinationCity}`);
        doc.text(`Flight: ${newOrder.flight}`);
        doc.text(`Hotel: ${newOrder.hotel}`);
        doc.text(`Attractions: ${newOrder.attractions ? newOrder.attractions.join(", ") : "None"}`);
        doc.text(`Transportation: ${newOrder.transportation}`);
        doc.text(`Payment Method: ${newOrder.paymentMethod}`);
        doc.text(`Total Price: $${newOrder.totalPrice}`);
        doc.text(`Created At: ${newOrder.createdAt}`);
        doc.end();

        stream.on("finish", () => {
            console.log("✅ PDF generated successfully:", pdfPath);
            return res.status(201).json(newOrder);
        });

        stream.on("error", (error) => {
            console.error("❌ Error generating PDF:", error);
            return res.status(500).json({ message: "Failed to generate PDF" });
        });

    } catch (error) {
        console.error("⚠️ Error creating order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Serve the PDF file
export const getOrderPDF = async (req, res) => {
    try {
        const { orderId } = req.params;
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);

        console.log(`🔍 Looking for PDF at: ${pdfPath}`);

        if (!fs.existsSync(pdfPath)) {
            console.error("⚠️ PDF not found:", pdfPath);
            return res.status(404).json({ message: "PDF not found. Please try generating a new order." });
        }

        console.log("✅ PDF found, sending file...");
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=receipt-${orderId}.pdf`);
        res.sendFile(pdfPath);
    } catch (error) {
        console.error("⚠️ Error serving PDF:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
