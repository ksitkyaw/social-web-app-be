import express from "express";

import { createComment, listComments } from "../controllers/comment";
import { requireAuth } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });

router.post("/", requireAuth, createComment);
router.get("/", requireAuth, listComments);

export default router;
