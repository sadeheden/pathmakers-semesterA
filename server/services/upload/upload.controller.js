import dotenv from 'dotenv';
dotenv.config();  // טוען את משתני הסביבה

import { v2 as cloudinary } from 'cloudinary';

console.log("✅ Loading Cloudinary ENV Variables:", {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET ? "Exists ✅" : "❌ MISSING"
});

// הגדרת Cloudinary עם שם הענן
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export async function uploadToCloudinary(req, res) {
    try {
        console.log("✅ Multer received file:", req.file);

        if (!req.file) {
            console.error("❌ No file received.");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("📂 File Details:", {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        console.log("✅ Cloudinary Credentials:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET ? "Exists ✅" : "❌ MISSING"
        });

        // Upload to Cloudinary
        cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("🚨 Cloudinary Upload Error:", error);
                    return res.status(500).json({ error: "Cloudinary upload failed", details: error });
                }

                console.log("✅ Cloudinary Upload Success:", result);
                res.status(200).json({ success: true, url: result.secure_url });
            }
        ).end(req.file.buffer);

    } catch (error) {
        console.error("🚨 Server Error:", error);
        res.status(500).json({ error: "Failed to upload image", details: error.message });
    }
}
