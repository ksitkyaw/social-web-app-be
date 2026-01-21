import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { appConfig } from "./config";
import { connectMongo } from "./databases/init";
import appRouter from "./routes";
import { attachCurrentUser } from "./middlewares/auth";
import { BaseError } from "./utils/errors/base.error";
import useragent from "express-useragent";

// express app setup
const app = express();

app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(cors());
app.use(useragent.express());

app.use(attachCurrentUser);
app.use(appRouter);

app.use(
  (error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error instanceof BaseError) {
      res.status(error.httpStatusCode).json({
        name: error.name,
        message: error.message,
        body: error.body,
      });
    } else {
      next();
    }
  },
);

// DB setup
connectMongo();

const port = appConfig.common.port;
app.listen(port, "0.0.0.0", () => {
  console.info(`app listening on port ${port}`);
});
