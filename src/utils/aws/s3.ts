import { S3Client } from "@aws-sdk/client-s3";

import { appConfig } from "../../config";

let client: S3Client | null = null;

export const getS3Client = () => {
  if (!client) {
    client = new S3Client({
      region: appConfig.aws.region,
      credentials: {
        accessKeyId: appConfig.aws.accessKeyId,
        secretAccessKey: appConfig.aws.secretAccessKey,
      },
    });
  }
  return client;
};

export const buildPublicFileUrl = (key: string) => {
  const { cloudfront, s3, region } = appConfig.aws;
  if (cloudfront.endpoint) {
    return `${cloudfront.endpoint.replace(/\/$/, "")}/${key}`;
  }
  if (!s3.bucketName) {
    return key;
  }
  return `https://${s3.bucketName}.s3.${region}.amazonaws.com/${key}`;
};
