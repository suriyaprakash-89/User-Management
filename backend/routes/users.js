import express from "express";
import multer from "multer";
import {
  uploadUsers,
  getUsers,
  exportUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadUsers);
router.get("/", getUsers);
router.get("/export", exportUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
