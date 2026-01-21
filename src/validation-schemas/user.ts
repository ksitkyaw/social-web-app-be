import { JSONSchemaType } from "ajv";

import { LoginUserParams, RegisterUserParams } from "../types";

export const registerUserSchema: JSONSchemaType<RegisterUserParams> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 255 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
    passwordConfirmation: { type: "string", minLength: 8 },
  },
  required: ["name", "email", "password", "passwordConfirmation"],
  additionalProperties: false,
};

export const loginUserSchema: JSONSchemaType<LoginUserParams> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};
