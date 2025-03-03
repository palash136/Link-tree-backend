const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if all fields are provided
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password correctly
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new userModel({
            name: `${firstname} ${lastname}`,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body; // ✅ Ensure email is being used

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({ token, user: payload, message: "Login successful" });
    } catch (err) {
        next(err);
    }

    const router = express.Router();


});


module.exports = router;
