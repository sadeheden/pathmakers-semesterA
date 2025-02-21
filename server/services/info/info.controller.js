const { getUserProfile, saveUserProfile } = require("./info.model");

// Get User Profile
const getUser = (req, res) => {
    const userProfile = getUserProfile();
    if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
};

// Update User Profile
const updateUser = (req, res) => {
    const updatedProfile = req.body;

    if (!updatedProfile.username || !updatedProfile.address || !updatedProfile.city || 
        !updatedProfile.country || !updatedProfile.phone || !updatedProfile.gender || 
        !updatedProfile.membership) {
        return res.status(400).json({ message: "All fields are required" });
    }

    saveUserProfile(updatedProfile);
    res.json(updatedProfile);
};

module.exports = { getUser, updateUser };
