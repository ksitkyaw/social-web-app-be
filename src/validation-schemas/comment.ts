import { JSONSchemaType } from "ajv";

import { CreateCommentInput, ListCommentsInput } from "../types";

export const createCommentSchema: JSONSchemaType<CreateCommentInput> = {
  type: "object",
  properties: {
    postId: { type: "string", minLength: 1 },
    content: { type: "string", minLength: 1 },
    userId: { type: "string", minLength: 1 },
  },
  required: ["postId", "content", "userId"],
  additionalProperties: false,
};

export const listCommentsSchema: JSONSchemaType<ListCommentsInput> = {
  type: "object",
  properties: {
    postId: { type: "string", minLength: 1 },
    page: { type: "number", minimum: 1, nullable: true },
    limit: { type: "number", minimum: 1, maximum: 50, nullable: true },
  },
  required: ["postId"],
  additionalProperties: false,
};
