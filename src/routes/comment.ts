import express from "express";

import { createComment } from "../controllers/comment";
import { requireAuth } from "../middlewares/auth";

const router = express.Router({ mergeParams: true });
console.log("router mounted");

router.post("/", requireAuth, createComment);

export default router;
