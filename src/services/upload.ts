import { randomBytes } from "crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { appConfig } from "../config";
import { GeneratePresignedUrlParams, GeneratePresignedUrlResponse } from "../types";
import { generatePresignedUrlSchema } from "../validation-schemas";
import { validateParams } from "../utils/validator";
import { buildPublicFileUrl, getS3Client } from "../utils/aws/s3";
import { BadRequestError } from "../utils/errors";

const PRESIGNED_URL_TTL = 60 * 5; // 5 minutes

class UploadService {
  private s3Client = getS3Client();

  @validateParams(generatePresignedUrlSchema)
  public async generatePresignedUrl(
    params: GeneratePresignedUrlParams,
  ): Promise<GeneratePresignedUrlResponse> {
    const { folder, userId, contentType } = params;
    const bucket = appConfig.aws.s3.bucketName;

    if (!bucket) {
      throw new BadRequestError("Upload bucket is not configured");
    }

    const key = this.buildObjectKey(folder, userId, contentType);
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      Metadata: {
        "uploaded-by": userId,
      },
    });

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: PRESIGNED_URL_TTL,
    });

    const fileUrl = await this.maybeShortenUrl(buildPublicFileUrl(key), params);

    return { presignedUrl, fileUrl };
  }

  private buildObjectKey(folder: string, userId: string, contentType: string) {
    const safeFolder = this.sanitizeFolder(folder);
    const extension = this.resolveExtension(contentType);
    const randomId = randomBytes(8).toString("hex");
    const timestamp = Date.now();

    const segments = [safeFolder, userId, `${timestamp}-${randomId}`].filter(Boolean);
    return `${segments.join("/")}${extension ? `.${extension}` : ""}`;
  }

  private sanitizeFolder(folder: string) {
    return folder
      .split("/")
      .map((segment) => segment.replace(/[^a-zA-Z0-9-_]/g, ""))
      .filter(Boolean)
      .join("/");
  }

  private resolveExtension(contentType: string) {
    const [, subtype] = contentType.split("/");
    if (!subtype) {
      return "";
    }
    return subtype.split(";")[0];
  }

  private async maybeShortenUrl(url: string, params: GeneratePresignedUrlParams) {
    if (!params.options?.shorten) {
      return url;
    }
    // Placeholder for future URL-shortening integration.
    return url;
  }
}

export const uploadService = new UploadService();
