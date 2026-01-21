import { JSONSchemaType } from "ajv";

import { CreateCommentInput } from "../types";

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
