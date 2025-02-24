const express = require("express");
require("dotenv").config();
const app = express(); // Initialize Express
const User = require("./Auth")
const memberRoutes = require("./memberRoutes");
const bookRoutes = require("./bookRoutes");
const issuanceRoutes = require("./issuanceRoutes")
const categoryRoutes = require("./categoryRoutes")
const membershipRoutes = require("./membershipRoutes")
const collectionRoutes = require("./collectionRoutes")
const { authMiddleware } = require('../Middleware/Auth.Token');

app.use(express.json());

// Public routes (no auth required)
app.use("/", User); // Auth routes should remain public

// Protected routes (require authentication)
app.use("/books", authMiddleware, bookRoutes);
app.use("/members", authMiddleware, memberRoutes);
app.use("/issuance", authMiddleware, issuanceRoutes);
app.use("/category", authMiddleware, categoryRoutes)
app.use("/membership", authMiddleware, membershipRoutes)
app.use("/collection", authMiddleware, collectionRoutes)

module.exports = app;
