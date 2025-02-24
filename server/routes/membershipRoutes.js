const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Import the pool correctly

// 📌 Create a new membership
router.post("/", async (req, res) => {
    try {
        const { member_id, status } = req.body;

        const result = await pool.query(
            "INSERT INTO membership (member_id, status) VALUES ($1, $2) RETURNING *",
            [member_id, status]
        );

        res.status(201).json({ 
            message: "Membership created successfully", 
            membership: result.rows[0] 
        });
    } catch (error) {
        console.error("Error creating membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get all memberships
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM membership");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching memberships:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Get a specific membership by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM membership WHERE membership_id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Update membership status
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            "UPDATE membership SET status = $1 WHERE membership_id = $2 RETURNING *",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json({ 
            message: "Membership updated successfully", 
            membership: result.rows[0] 
        });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Delete a membership
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM membership WHERE membership_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Membership not found" });
        }

        res.status(200).json({ message: "Membership deleted successfully" });
    } catch (error) {
        console.error("Error deleting membership:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
