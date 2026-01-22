import express from "express";

import { generatePresignedUrl } from "../controllers/upload";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/presigned", requireAuth, generatePresignedUrl);

export default router;
