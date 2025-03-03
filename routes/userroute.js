const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { authMiddleware } = require("../middleware/auth");

// ✅ Get User Details (Excluding Password)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Delete User
router.delete("/", authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
});

// ✅ Update User (Ensure Data Validation)
router.put("/", authMiddleware, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        let updatedData = { name, email };

        // If password is provided, hash it before saving
        if (password) {
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});




module.exports = router;

// ✅ Track Click on a Link
router.post("/links/:linkId/click", async (req, res) => {
    try {
        const { linkId } = req.params;
        const { device, location, referrer } = req.body;

        const user = await User.findOne({ "links._id": linkId });
        if (!user || !user.links) return res.status(404).json({ message: "Link not found" });

        const link = user.links.id(linkId);
        if (!link) return res.status(404).json({ message: "Link not found" });

        link.clicks = (link.clicks || 0) + 1;
        link.analytics = link.analytics || []; // Ensure it's an array
        link.analytics.push({
            device: device || "Unknown",
            location: location || "Unknown",
            referrer: referrer || "Direct",
            timestamp: new Date(),
        });

        await user.save();
        res.json({ message: "Click recorded successfully" });
    } catch (error) {
        console.error("Error tracking link click:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get All Links of a User
router.get("/links", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("links");
        if (!user || !user.links) return res.status(404).json({ message: "User not found or no links available" });

        res.json(user.links);
    } catch (error) {
        console.error("Error fetching user links:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Track Clicks (Shop or Link)
// ✅ Add a new Link and update analytics
router.post("/links/:linkId/click", async (req, res) => {
    try {
        const { linkId } = req.params;
        const { device, location, referrer } = req.body; // Collect additional analytics data

        const user = await User.findOne({ "links._id": linkId });
        if (!user || !user.links) return res.status(404).json({ message: "Link not found" });

        const link = user.links.id(linkId);
        if (!link) return res.status(404).json({ message: "Link not found" });

        // Increment click count
        link.clicks = (link.clicks || 0) + 1;
        link.analytics = link.analytics || []; // Ensure it's an array
        link.analytics.push({
            device: device || "Unknown",
            location: location || "Unknown",
            referrer: referrer || "Direct",
            timestamp: new Date(),
        });

        await user.save();
        res.json({ message: "Click recorded successfully", totalClicks: link.clicks });
    } catch (error) {
        console.error("Error tracking link click:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// ✅ Get Analytics for User
router.get("/analytics", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("links shopClicks");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            totalShopClicks: user.shopClicks || 0,
            links: user.links?.map(link => ({
                id: link._id,
                title: link.title,
                clicks: link.clicks || 0,
                analytics: link.analytics || [],
            })) || []
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
