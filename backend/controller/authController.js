import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user already exists
        console.log(req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: "user"   // ✅ Always set role to user here
        });

        await newUser.save();
        console.log("User registered successfully");

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3️⃣ Generate JWT token (optional)
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,   // You must add this in .env
            { expiresIn: "1h" }
        );

        // 4️⃣ Send response
        res.status(200).json({
            message: "Login successful",
            token: token,
            role: user.role   // 🚩 Frontend uses this to redirect
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
