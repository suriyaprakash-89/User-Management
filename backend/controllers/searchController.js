import pool from "../config/database.js";

export const saveSearch = async (req, res) => {
  const { name, filters } = req.body;
  if (!name || !filters) {
    return res.status(400).json({ message: "Name and filters are required." });
  }
  try {
    const query =
      "INSERT INTO saved_searches (name, filters) VALUES ($1, $2) RETURNING *";
    const { rows } = await pool.query(query, [name, JSON.stringify(filters)]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save search", error: error.message });
  }
};

export const getSavedSearches = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM saved_searches ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get saved searches", error: error.message });
  }
};

export const deleteSavedSearch = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM saved_searches WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete saved search", error: error.message });
  }
};
