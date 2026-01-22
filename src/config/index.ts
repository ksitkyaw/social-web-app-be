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
  aws: {
    region: ConfigHelper.parseString(process.env.AWS_REGION, "us-east-1"),
    accessKeyId: ConfigHelper.parseString(process.env.AWS_ACCESS_KEY_ID, ""),
    secretAccessKey: ConfigHelper.parseString(process.env.AWS_SECRET_ACCESS_KEY, ""),
    s3: {
      bucketName: ConfigHelper.parseString(process.env.AWS_S3_BUCKET_NAME, ""),
    },
    cloudfront: {
      endpoint: ConfigHelper.parseString(process.env.AWS_CLOUDFRONT_ENDPOINT, ""),
    },
  },
};

export type AppConfig = typeof appConfig;
