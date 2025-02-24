const express = require("express");
const router = express.Router();
const pool  = require("../config/db");

// 📌 Create a new category
router.post("/", async (req, res) => {
    try {
        const { cat_name, sub_cat_name } = req.body;

        const result = await pool.query(
            "INSERT INTO category (cat_name, sub_cat_name) VALUES ($1, $2) RETURNING *",
            [cat_name, sub_cat_name]
        );

        res.status(201).json({ message: "Category created", category: result.rows[0] });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get all categories
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM category");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get category by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM category WHERE cat_id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
