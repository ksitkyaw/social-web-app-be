Here is the API documentation based on your Swagger definition, formatted in Markdown.

# Social Web App API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5500` (Local Dev) / Production URL

## Authentication
This API uses **Bearer Token Authentication** (JWT).  
Most endpoints require the `Authorization` header.

**Header Format:**
```http
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication & Profile

### Register User
Register a new user account.

* **URL:** `/api/register`
* **Method:** `POST`
* **Auth Required:** No

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "passwordConfirmation": "securePassword123"
}
```

**Success Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a94f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "name": "ValidationError",
  "message": "Passwords do not match",
  "body": null
}
```

---

### Login
Authenticate an existing user.

* **URL:** `/api/login`
* **Method:** `POST`
* **Auth Required:** No

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a94f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Logout
Invalidate the current session (client-side logic usually, depending on implementation).

* **URL:** `/api/logout`
* **Method:** `POST`
* **Auth Required:** Yes

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Profile
Get the profile details and statistics of the currently authenticated user.

* **URL:** `/api/profile`
* **Method:** `GET`
* **Auth Required:** Yes

**Success Response (200 OK):**

```json
{
  "id": "65a94f...",
  "name": "John Doe",
  "email": "john@example.com",
  "postCount": 5,
  "reactionCount": 12,
  "commentCount": 8
}
```

---

## 2. Posts

### Create Post
Create a new post.

* **URL:** `/api/posts`
* **Method:** `POST`
* **Auth Required:** Yes

**Request Body:**

```json
{
  "title": "My Vacation",
  "content": "Had a wonderful time at the beach!",
  "image": "https://cdn.example.com/posts/images/beach.png"
}
```

**Success Response (201 Created):**

```json
{
  "id": "78b12c...",
  "title": "My Vacation",
  "content": "Had a wonderful time at the beach!",
  "image": "https://cdn.example.com/posts/images/beach.png",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z",
  "author": {
    "id": "65a94f...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "reactionCount": 0,
  "commentCount": 0
}
```

---

### List All Posts
Get a paginated list of all posts from all users.

* **URL:** `/api/posts`
* **Method:** `GET`
* **Auth Required:** No (implied by Swagger, though usually read operations might be public)

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `page` | integer | No | Page number (min: 1) | `1` |
| `limit` | integer | No | Items per page (max: 50) | `10` |

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "78b12c...",
      "title": "My Vacation",
      "content": "...",
      "author": { "name": "John Doe", ... },
      "reactionCount": 5,
      "commentCount": 2,
      "createdAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### List My Posts
Get a paginated list of posts created by the authenticated user.

* **URL:** `/api/my-posts`
* **Method:** `GET`
* **Auth Required:** Yes

**Query Parameters:** `page`, `limit`

**Success Response (200 OK):**
*Returns same structure as "List All Posts" above.*

---

### Update Post
Update an existing post.

* **URL:** `/api/posts/{postId}`
* **Method:** `PUT`
* **Auth Required:** Yes

**Path Parameters:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `postId` | string | Yes | The ID of the post to update |

**Request Body:**

```json
{
  "title": "My Updated Vacation",
  "content": "Actually, it rained a bit.",
  "image": null
}
```

**Success Response (200 OK):**
*Returns the updated Post object.*

---

## 3. Comments

### Create Comment
Add a comment to a specific post.

* **URL:** `/api/posts/{postId}/comments`
* **Method:** `POST`
* **Auth Required:** Yes

**Path Parameters:** `postId`

**Request Body:**

```json
{
  "content": "Great photo!"
}
```

**Success Response (201 Created):**

```json
{
  "id": "99c34d...",
  "postId": "78b12c...",
  "content": "Great photo!",
  "createdAt": "2023-10-27T12:00:00Z",
  "updatedAt": "2023-10-27T12:00:00Z",
  "author": {
    "id": "65a94f...",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

---

### List Comments
Get paginated comments for a specific post.

* **URL:** `/api/posts/{postId}/comments`
* **Method:** `GET`
* **Auth Required:** No

**Path Parameters:** `postId`
**Query Parameters:** `page`, `limit`

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "99c34d...",
      "content": "Great photo!",
      "author": { ... },
      "createdAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 4. Reactions

### Toggle Reaction
Like or Unlike a post. If the user has already liked the post, this action removes the like.

* **URL:** `/api/posts/{postId}/reaction`
* **Method:** `POST`
* **Auth Required:** Yes

**Path Parameters:** `postId`

**Success Response (200 OK):**

```json
{
  "reacted": true,
  "reactionCount": 6
}
```
*Note: `reacted: false` indicates the like was removed.*

---

## 5. File Uploads

### Generate Presigned URL
Generate a secure S3 presigned URL to upload a file directly from the client.

* **URL:** `/api/uploads/presigned`
* **Method:** `POST`
* **Auth Required:** Yes

**Request Body:**

```json
{
  "folder": "posts/images",
  "contentType": "image/jpeg",
  "options": {
    "shorten": false
  }
}
```

**Success Response (200 OK):**

```json
{
  "presignedUrl": "https://s3.amazonaws.com/bucket-name/posts/images/file-123.jpg?AWSAccessKeyId=...",
  "fileUrl": "https://cdn.example.com/posts/images/file-123.jpg"
}
```

*   **presignedUrl**: Use this URL with a `PUT` request to upload the actual binary file.
*   **fileUrl**: Save this URL in your `Create Post` or `Update Post` request.