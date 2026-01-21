import mongoose from "mongoose";

import { appConfig } from "../config";

export const connectMongo = async () => {
  mongoose.Promise = Promise;
  mongoose.connect(appConfig.database.mongodb.uri);
  mongoose.connection.on("error", (error: Error) => {
    console.error("Error in connecting to MongoDB:", error);
  });
  console.info("MongoDB connected.");
};
