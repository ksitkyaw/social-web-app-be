import { JSONSchemaType } from "ajv";

import { ToggleReactionInput } from "../types";

export const toggleReactionSchema: JSONSchemaType<ToggleReactionInput> = {
  type: "object",
  properties: {
    postId: { type: "string", minLength: 1 },
    type: { type: "string", enum: ["like"], nullable: true },
    userId: { type: "string", minLength: 1 },
  },
  required: ["postId", "userId"],
  additionalProperties: false,
};
