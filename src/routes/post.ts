import express from "express";

import { createPost, deletePost, listPosts, updatePost } from "../controllers/post";
import { toggleReaction } from "../controllers/reaction";
import commentsRouter from "./comment";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/", requireAuth, createPost);
router.put("/:postId", requireAuth, updatePost);
router.delete("/:postId", requireAuth, deletePost);
router.post("/:postId/reaction", requireAuth, toggleReaction);
router.use("/:postId/comments", commentsRouter);
router.get("/", listPosts);

export default router;
