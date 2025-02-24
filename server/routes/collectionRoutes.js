const express = require("express");
const router = express.Router();
const  pool  = require("../config/db");

// 📌 Create a new collection
router.post("/", async (req, res) => {
    try {
        const { collection_name } = req.body;

        const result = await pool.query(
            "INSERT INTO collection (collection_name) VALUES ($1) RETURNING *",
            [collection_name]
        );

        res.status(201).json({ message: "Collection created", collection: result.rows[0] });
    } catch (error) {
        console.error("Error creating collection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get all collections
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM collection");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get a collection by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM collection WHERE collection_id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Collection not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching collection:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
