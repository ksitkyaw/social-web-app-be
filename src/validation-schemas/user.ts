import { JSONSchemaType } from "ajv";
import { CreateUserParams } from "../types";

export const createUserSchema: JSONSchemaType<CreateUserParams> = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["name", "email", "password"],
  additionalProperties: false,
};
