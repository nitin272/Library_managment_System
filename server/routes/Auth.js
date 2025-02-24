const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('../models/user');
const cors = require('cors');
require('dotenv').config();
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

const auth = express();

// Middleware setup
auth.use(express.json());
auth.use(cookieParser());
auth.use(cors({
    origin: "http://localhost:4500",
    credentials: true
}));

// Initialize Passport
auth.use(passport.initialize());

// Google OAuth Strategy
passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ["profile", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("Google OAuth Profile:", profile);

        let user = await userModel.findOne({ username: profile.emails[0].value });

        if (!user) {
            console.log("Creating new user...");
            user = await userModel.create({
                name: profile.displayName,
                username: profile.emails[0].value,
                ownerImg: [profile.photos[0].value],
                role: 'user',
            });
        }

        console.log("User found/created:", user);
        return done(null, user);
    } catch (error) {
        console.error("Error in Google OAuth Strategy:", error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

auth.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

auth.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
  
    async (req, res) => {
        try {
            const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // sameSite: "None"
            });
            res.redirect('http://localhost:4500/');

        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');

        }
    }
);
// ✅ POST Route: Manually Register a User
auth.post('/login', async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body); // ✅ Debugging

        const { name, username, ownerImg, role } = req.body;

        if (!name || !username) {
            console.log("Validation Error: Name and username are required.");
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Check if user already exists
        let user = await userModel.findOne({ username });

        if (user) {
            console.log("User already exists in DB:", user);
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        console.log("Creating new user...");
        user = new userModel({
            name,
            username,
            ownerImg: ownerImg || [],
            role: role || 'user'
        });

        console.log("User object before saving:", user);

        await user.save();

        console.log("User successfully saved to DB:", user);

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set HTTP-Only Cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log("User registered successfully and JWT token set.");

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        console.error("Error in /login route:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get User Info Route

auth.get('/user', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
            .select("name username ownerImg role"); // Include these fields

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Updated Logout Route with secure cookie clearing
auth.get('/logout', (req, res) => {
    try {
        // Clear JWT cookie with secure options
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true, // Force secure
            sameSite: 'strict',
            path: '/',
            domain: 'localhost'
        });

        // Clear session cookie if exists
        res.clearCookie('connect.sid', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            domain: 'localhost'
        });

        console.log("Cookies cleared successfully");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
});

//get all users
auth.get('/allUsers', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json({users});
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Add login-success route
auth.get('/login-success', async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "No token found" 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.json({
            success: true,
            user,
            message: "Successfully authenticated"
        });
    } catch (error) {
        console.error("Error in login-success route:", error);
        res.status(401).json({ 
            success: false,
            message: "Authentication failed" 
        });
    }
});

module.exports = auth;
