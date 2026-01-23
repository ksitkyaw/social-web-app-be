import express from "express";

import { createComment, deleteComment, listComments } from "../controllers/comment";
import { requireAuth } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.post("/", requireAuth, createComment);
router.get("/", requireAuth, listComments);
router.delete("/:commentId", requireAuth, deleteComment);

export default router;
