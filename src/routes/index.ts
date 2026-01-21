import express from "express";

import userRouter from "./user";
import postRouter from "./post";
import { requireAuth } from "../middlewares/auth";
import { listMyPosts } from "../controllers/post";

const router = express.Router();
const apiRouter = express.Router();

apiRouter.use("/", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.get("/my-posts", requireAuth, listMyPosts);

router.use("/api", apiRouter);

export default router;
