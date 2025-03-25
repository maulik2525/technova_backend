import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createPost,
  deletepost,
  getposts,
  updatepost,
} from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/createPost", verifyToken, upload.single("image"), createPost);
router.get("/getposts", getposts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

export default router;
