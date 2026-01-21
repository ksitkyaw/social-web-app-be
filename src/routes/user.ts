import express from "express";

import { getProfile, loginUser, logoutUser, registerUser } from "../controllers/user";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", requireAuth, logoutUser);
router.get("/profile", requireAuth, getProfile);

export default router;
