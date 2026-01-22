import swaggerJSDoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Web App API",
      version: "1.0.0",
      description:
        "REST API for managing users, posts, comments, and reactions in the social web app backend test assignment.",
    },
    servers: [{ url: "http://localhost:5500", description: "Local dev" }],
    tags: [
      { name: "auth", description: "Authentication and profile endpoints" },
      { name: "posts", description: "Post CRUD and listing" },
      { name: "comments", description: "Comments on posts" },
      { name: "reactions", description: "Like/unlike reactions" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            name: { type: "string" },
            message: { type: "string" },
            body: { type: "object", nullable: true },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 25 },
            totalPages: { type: "integer", example: 3 },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        Profile: {
          allOf: [
            { $ref: "#/components/schemas/User" },
            {
              type: "object",
              properties: {
                postCount: { type: "integer", example: 5 },
                reactionCount: { type: "integer", example: 12 },
                commentCount: { type: "integer", example: 8 },
              },
            },
          ],
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        LogoutResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Logged out successfully" },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            author: { $ref: "#/components/schemas/User" },
            reactionCount: { type: "integer" },
            commentCount: { type: "integer" },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "string" },
            postId: { type: "string" },
            content: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            author: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string", nullable: true },
                email: { type: "string", format: "email", nullable: true },
              },
            },
          },
        },
        ReactionResponse: {
          type: "object",
          properties: {
            reacted: { type: "boolean" },
            reactionCount: { type: "integer" },
          },
        },
        PaginatedPosts: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Post" },
            },
            pagination: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        PaginatedComments: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Comment" },
            },
            pagination: { $ref: "#/components/schemas/PaginationMeta" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "passwordConfirmation"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
            passwordConfirmation: { type: "string", format: "password" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            image: { type: "string", nullable: true },
          },
        },
        UpdatePostRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            image: { type: "string", nullable: true },
          },
        },
        CreateCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string" },
          },
        },
      },
    },
    security: [],
    paths: {
      "/api/register": {
        post: {
          tags: ["auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "User registered",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/api/login": {
        post: {
          tags: ["auth"],
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login success",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } },
              },
            },
          },
        },
      },
      "/api/logout": {
        post: {
          tags: ["auth"],
          summary: "Logout current user",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Logout success",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LogoutResponse" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/profile": {
        get: {
          tags: ["auth"],
          summary: "Get authenticated user profile",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Profile" },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/posts": {
        post: {
          tags: ["posts"],
          summary: "Create a post",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePostRequest" } } },
          },
          responses: {
            201: {
              description: "Post created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } },
            },
            401: { description: "Unauthorized" },
          },
        },
        get: {
          tags: ["posts"],
          summary: "List all posts",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
          ],
          responses: {
            200: {
              description: "Paginated posts",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedPosts" } } },
            },
          },
        },
      },
      "/api/my-posts": {
        get: {
          tags: ["posts"],
          summary: "List authenticated user's posts",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
          ],
          responses: {
            200: {
              description: "Paginated posts",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedPosts" } } },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/posts/{postId}": {
        put: {
          tags: ["posts"],
          summary: "Update a post",
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: "postId", in: "path", required: true, schema: { type: "string" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdatePostRequest" } },
            },
          },
          responses: {
            200: {
              description: "Post updated",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Post" } } },
            },
            401: { description: "Unauthorized" },
            404: { description: "Not found" },
          },
        },
      },
      "/api/posts/{postId}/comments": {
        post: {
          tags: ["comments"],
          summary: "Create a comment",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "postId", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreateCommentRequest" } } },
          },
          responses: {
            201: {
              description: "Comment created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Comment" } } },
            },
            401: { description: "Unauthorized" },
            404: { description: "Post not found" },
          },
        },
        get: {
          tags: ["comments"],
          summary: "List comments for a post",
          parameters: [
            { name: "postId", in: "path", required: true, schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 50 } },
          ],
          responses: {
            200: {
              description: "Paginated comments",
              content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedComments" } } },
            },
            404: { description: "Post not found" },
          },
        },
      },
      "/api/posts/{postId}/reaction": {
        post: {
          tags: ["reactions"],
          summary: "Toggle like reaction",
          security: [{ BearerAuth: [] }],
          parameters: [{ name: "postId", in: "path", required: true, schema: { type: "string" } }],
          responses: {
            200: {
              description: "Reaction toggled",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ReactionResponse" } } },
            },
            401: { description: "Unauthorized" },
            404: { description: "Post not found" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
