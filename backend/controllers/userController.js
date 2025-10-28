import { Parser } from "json2csv";
import {
  processAndStoreUsers,
  fetchUsersWithFilters,
  fetchAllUsersWithFilters,
} from "../services/userService.js";

export const uploadUsers = async (req, res) => {
  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
  try {
    const result = await processAndStoreUsers(req.file.buffer);
    res.status(201).json({
      message: `${result.insertedCount} users imported successfully.`,
      insertedCount: result.insertedCount,
      duplicates: result.duplicates,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "Failed to process file.", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  
  try {
    const result = await fetchUsersWithFilters(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch users.", error: error.message });
  }
};

export const exportUsers = async (req, res) => {
  try {
    const users = await fetchAllUsersWithFilters(req.query);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the selected criteria." });
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  } catch (error) {
    console.error("Export Users Error:", error);
    res
      .status(500)
      .json({ message: "Failed to export users.", error: error.message });
  }
};
