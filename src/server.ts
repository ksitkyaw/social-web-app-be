import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import useragent from "express-useragent";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./swagger";
import { connectMongo } from "./databases/init";
import appRouter from "./routes";
import { attachCurrentUser } from "./middlewares/auth";
import { BaseError } from "./utils/errors/base.error";
import { appConfig } from "./config";

const app = express();

app.set("trust proxy", 1);

app.use(cors());
app.use(bodyParser.json());
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


app.use(async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (error) {
    next(error);
  }
});


app.use(attachCurrentUser);
app.use(appRouter);

app.use(
  (error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error instanceof BaseError) {
      return res.status(error.httpStatusCode).json({
        name: error.name,
        message: error.message,
        body: error.body,
      });
    }

    console.error("Unhandled error:", error);
    return res.status(500).json({
      name: "InternalServerError",
      message: "Something went wrong",
    });
  },
);


if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || appConfig.common.port || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
