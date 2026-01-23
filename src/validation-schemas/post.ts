import { JSONSchemaType } from "ajv";

import {
  CreatePostInput,
  DeletePostInput,
  ListMyPostsInput,
  ListPostsInput,
  UpdatePostInput,
} from "../types";

export const createPostSchema: JSONSchemaType<CreatePostInput> = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    content: { type: "string", minLength: 1 },
    image: { type: "string", nullable: true, minLength: 1 },
    userId: { type: "string", minLength: 1 },
  },
  required: ["title", "content", "userId"],
  additionalProperties: false,
};

export const updatePostSchema: JSONSchemaType<UpdatePostInput> = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255, nullable: true },
    content: { type: "string", minLength: 1, nullable: true },
    image: { type: "string", nullable: true, minLength: 1 },
    userId: { type: "string", minLength: 1 },
    postId: { type: "string", minLength: 1 },
  },
  required: ["userId", "postId"],
  additionalProperties: false,
};

export const listMyPostsSchema: JSONSchemaType<ListMyPostsInput> = {
  type: "object",
  properties: {
    page: { type: "integer", minimum: 1, default: 1, nullable: true },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10, nullable: true },
    userId: { type: "string", minLength: 1 },
  },
  required: ["userId"],
  additionalProperties: false,
};

export const listPostsSchema: JSONSchemaType<ListPostsInput> = {
  type: "object",
  properties: {
    page: { type: "integer", minimum: 1, default: 1, nullable: true },
    limit: { type: "integer", minimum: 1, maximum: 50, default: 10, nullable: true },
  },
  required: [],
  additionalProperties: false,
};

export const deletePostSchema: JSONSchemaType<DeletePostInput> = {
  type: "object",
  properties: {
    postId: { type: "string", minLength: 1 },
    userId: { type: "string", minLength: 1 },
  },
  required: ["postId", "userId"],
  additionalProperties: false,
};
