import { ConfigHelper } from "./helper";

export const appConfig = {
  common: {
    port: ConfigHelper.parseNumber(process.env.PORT, 5500),
  },
  database: {
    mongodb: {
      uri: ConfigHelper.parseString(process.env.MONGODB_URI, ""),
    },
  },
};

export type AppConfig = typeof appConfig;
