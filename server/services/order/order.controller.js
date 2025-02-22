import { loadOrders, saveOrders } from "./order.model.js"; // Import JSON functions
import { v4 as uuidv4 } from "uuid"; // Generate unique IDs

// ✅ Save a new order
export const createOrder = async (req, res) => {
    try {
        const { departureCity, destinationCity, flight, hotel, attractions, transportation, paymentMethod, totalPrice } = req.body;
        const userId = req.user.id;

        const newOrder = {
            id: uuidv4(), // Unique ID
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

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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

