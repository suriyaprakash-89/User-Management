import express from "express";
import multer from "multer";
import {
  uploadUsers,
  getUsers,
  exportUsers,
} from "../controllers/userController.js"; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadUsers);
router.get("/", getUsers);
router.get("/export", exportUsers); 

export default router;
