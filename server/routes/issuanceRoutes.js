const express = require("express");
const router = express.Router();
const  pool  = require("../config/db"); // Assuming you have a database connection setup

// 📌 Issue a book
router.post("/issue", async (req, res) => {
  try {
    const { book_id, issuance_member, issued_by, target_return_date, issuance_status } = req.body;

    const result = await pool.query(
      `INSERT INTO issuance (book_id, issuance_member, issued_by, target_return_date, issuance_status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [book_id, issuance_member, issued_by, target_return_date, issuance_status]
    );

    res.status(201).json({ message: "Book issued successfully", issuance: result.rows[0] });
  } catch (error) {
    console.error("Error issuing book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get all issuance records
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM issuance");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching issuance records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Get issuance record by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM issuance WHERE issuance_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Issuance record not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching issuance record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Update issuance status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { issuance_status } = req.body;

    const result = await pool.query(
      "UPDATE issuance SET issuance_status = $1 WHERE issuance_id = $2 RETURNING *",
      [issuance_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Issuance record not found" });
    }

    res.status(200).json({ message: "Issuance status updated", issuance: result.rows[0] });
  } catch (error) {
    console.error("Error updating issuance status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📌 Delete issuance record
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM issuance WHERE issuance_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Issuance record not found" });
    }

    res.status(200).json({ message: "Issuance record deleted" });
  } catch (error) {
    console.error("Error deleting issuance record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
