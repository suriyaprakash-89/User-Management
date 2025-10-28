import express from "express";
import {
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
} from "../controllers/searchController.js";

const router = express.Router();

router.post("/", saveSearch);
router.get("/", getSavedSearches);
router.delete("/:id", deleteSavedSearch);

export default router;
