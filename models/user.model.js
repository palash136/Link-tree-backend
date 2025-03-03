const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ✅ Define Link Schema (Tracks individual links and analytics)
const LinkSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },  // ✅ Tracks total clicks on this link
    analytics: [
        {
            timestamp: { type: Date, default: Date.now },
            device: String, // ✅ Device type (mobile, desktop, tablet)
            location: String, // ✅ Location (country, city)
            referrer: String, // ✅ Referrer (source of the visit)
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// ✅ Define User Schema (Stores user details, links, and analytics data)
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    links: [LinkSchema], // ✅ Array of links with analytics data
    shopClicks: { type: Number, default: 0 }, // ✅ Track total shop button clicks
}, { timestamps: true }); // ✅ Automatically adds `createdAt` and `updatedAt` fields

// ✅ Export User Model
module.exports = mongoose.model("User", UserSchema);
