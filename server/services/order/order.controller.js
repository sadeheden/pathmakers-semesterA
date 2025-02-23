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
        const userId = req.user.id;
        console.log("🔍 Fetching orders for user:", userId);

        const orders = loadOrders().filter(order => order.userId === userId);

        console.log("✅ Orders found:", orders); // ✅ Debugging log

        return res.status(200).json(orders); // ✅ Always return an array, even if empty
    } catch (error) {
        console.error("⚠️ Error fetching orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Save a new order and generate PDF
export const createOrder = async (req, res) => {
    try {
        const { departureCity, destinationCity, flight, hotel, attractions, transportation, paymentMethod, totalPrice } = req.body;
        const userId = req.user.id;
        const username = req.user.username; // ✅ Get username from token

        const orderId = uuidv4();
        const newOrder = {
            id: orderId,
            userId,
            username, // ✅ Save username
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

        // ✅ Save order to JSON storage
        const orders = loadOrders(); 
        orders.push(newOrder); 
        saveOrders(orders);
        
        console.log("✅ Order saved successfully:", newOrder);
        
        // ✅ Generate PDF content with **username added**
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);
        const pdfContent = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 40px;
                    }
                    .firm-name {
                        font-size: 45px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 10px;
                        color: #2c3e50;
                    }
                    .title {
                        font-size: 40px;
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .info {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .total-price {
                        font-size: 45px;
                        font-weight: bold;
                        color: #e74c3c;
                        margin-top: 30px;
                    }
                    .label {
                        font-weight: bold;
                        font-size: 30px;
                    }
                    hr {
                        border: 2px solid #333;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="firm-name">Pathmakers</div>
                <hr>
                <div class="title">Travel Invoice</div>

                <div class="info"><span class="label">User:</span> ${username}</div> <!-- ✅ Added username -->
                <div class="info"><span class="label">Order ID:</span> ${orderId}</div>
                <div class="info"><span class="label">Departure City:</span> ${departureCity}</div>
                <div class="info"><span class="label">Destination City:</span> ${destinationCity}</div>
                <div class="info"><span class="label">Flight:</span> ${flight || "N/A"}</div>
                <div class="info"><span class="label">Hotel:</span> ${hotel || "N/A"}</div>
                <div class="info"><span class="label">Attractions:</span> ${attractions?.join(", ") || "N/A"}</div>
                <div class="info"><span class="label">Transportation:</span> ${transportation || "N/A"}</div>
                <div class="info"><span class="label">Payment Method:</span> ${paymentMethod}</div>

                <div class="total-price">Total Price: $${totalPrice}</div>
            </body>
            </html>
        `;

        // ✅ Create PDF with formatting
        pdf.create(pdfContent, { format: "A4" }).toFile(pdfPath, (err, result) => {
            if (err) {
                console.error("⚠️ Error generating PDF:", err);
                return res.status(500).json({ message: "Error generating PDF" });
            }
            console.log("✅ PDF generated successfully:", result.filename);
            
            // ✅ Send response only after the PDF is fully generated
            res.status(201).json({ 
                ...newOrder, 
                pdfUrl: `/api/order/${orderId}/pdf` 
            });
        });

    } catch (error) {
        console.error("⚠️ Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Serve the PDF file
export const getOrderPDF = async (req, res) => {
    try {
        const token = req.headers.authorization || req.query.token; // ✅ Check for token in query
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const { orderId } = req.params;
        const pdfPath = path.join(pdfDir, `${orderId}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            console.error("⚠️ PDF not found:", pdfPath);
            return res.status(404).json({ message: "PDF not found" });
        }

        console.log("✅ Sending PDF file:", pdfPath);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=receipt.pdf");
        res.sendFile(pdfPath);
    } catch (error) {
        console.error("⚠️ Error serving PDF:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
