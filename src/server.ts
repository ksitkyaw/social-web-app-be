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
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

// express app setup
const app = express();

app.set("trust proxy", 1);

app.use(bodyParser.json());
app.use(cors());
app.use(useragent.express());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

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
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// You MUST export the app for Vercel to work
export default app;
