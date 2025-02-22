import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader); // Debugging log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token); // Debugging log

    try {
        const secretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
        console.log("JWT_SECRET:", secretKey); // Debugging log

        if (!secretKey) {
            return res.status(500).json({ message: "Server error: Missing JWT secret" });
        }

        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded Token:", decoded); // Debugging log

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default authenticateUser;
