import { JSONSchemaType } from "ajv";

import { GeneratePresignedUrlParams } from "../types";

export const generatePresignedUrlSchema: JSONSchemaType<GeneratePresignedUrlParams> = {
  type: "object",
  properties: {
    folder: { type: "string", minLength: 1, maxLength: 128 },
    contentType: { type: "string", minLength: 1 },
    userId: { type: "string", minLength: 1 },
    options: {
      type: "object",
      nullable: true,
      properties: {
        shorten: { type: "boolean", nullable: true },
      },
      additionalProperties: false,
    },
  },
  required: ["folder", "contentType", "userId"],
  additionalProperties: false,
};
