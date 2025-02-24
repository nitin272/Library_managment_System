const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // PostgreSQL connection pool

// Get all members
router.get("/", async (req, res) => {
  try {
    const members = await pool.query("SELECT * FROM member");
    res.status(200).json(members.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new member
router.post("/", async (req, res) => {
  try {
    const { mem_email, mem_phone, mem_name } = req.body;
    const newMember = await pool.query(
      "INSERT INTO member (mem_email, mem_phone, mem_name) VALUES ($1, $2, $3) RETURNING *",
      [mem_email, mem_phone, mem_name]
    );
    res.status(201).json(newMember.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a member by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = await pool.query("SELECT * FROM member WHERE mem_id = $1", [id]);

    if (member.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json(member.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a member
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { mem_email, mem_phone, mem_name } = req.body;

    const updatedMember = await pool.query(
      "UPDATE member SET mem_email = $1, mem_phone = $2, mem_name = $3 WHERE mem_id = $4 RETURNING *",
      [mem_email, mem_phone, mem_name, id]
    );

    if (updatedMember.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json(updatedMember.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a member
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await pool.query("DELETE FROM member WHERE mem_id = $1 RETURNING *", [id]);

    if (deletedMember.rows.length === 0) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;