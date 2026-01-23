# Social Backend - Setup Guide

This is a RESTful API built with Node.js, Express, TypeScript, MongoDB (Mongoose), and AWS S3.

## 1. Prerequisites

Ensure you have the following installed on your machine:
*   **Node.js** (v18 or higher recommended)
*   **npm** (Node Package Manager)
*   **Git**

## 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd social-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 3. Environment Configuration

Create a file named `.env` in the root directory. Copy the variables below and fill them in with your **new, secure** credentials.

**File:** `.env`
```env
# Application Settings
PORT=5500
NODE_ENV=development

# Database Connection (MongoDB Atlas)
# Replace <password> and <dbname> with your actual details
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=social-web-app

# AWS Configuration (S3 & CloudFront)
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_new_access_key_id
AWS_SECRET_ACCESS_KEY=your_new_secret_access_key
AWS_S3_BUCKET_NAME=khant-project-assets
AWS_CLOUDFRONT_ENDPOINT=d2yfy0hrhqx5fs.cloudfront.net
```

### How to get these credentials:
*   **MongoDB URI:** Go to MongoDB Atlas > Database > Connect > Drivers > Node.js.
*   **AWS Keys:** Go to AWS IAM > Users > Security Credentials > Create Access Key.
*   **S3 Bucket:** Create a bucket in the AWS S3 Console.

## 4. Running the Application

### Development Mode
This runs the application with hot-reloading (restarts automatically when you save files).

```bash
npm run dev
```
*   **URL:** `http://localhost:5500`
*   **Swagger Docs:** `http://localhost:5500/api-docs`

### Production Build
To test the production build locally:

1.  **Compile TypeScript to JavaScript:**
    ```bash
    npm run build
    ```
    *(This creates a `dist/` folder)*

2.  **Run the compiled code:**
    ```bash
    npm start
    ```

## 5. API Documentation

The project includes Swagger UI for interactive API documentation.

1.  Start the server (`npm run dev`).
2.  Navigate to **`http://localhost:5500/api-docs`**.
3.  You can test endpoints directly from this interface.
4. You can also find the API documentation in the `DOCS.md` file.

## 6. Project Structure

```text
.
├── src
│   ├── config/             # Configuration logic
│   ├── databases/          # DB connection logic (init.ts)
│   ├── middlewares/        # Express middlewares (auth, errors)
│   ├── routes/             # API Route definitions
│   ├── utils/              # Helper functions & Error classes
│   ├── server.ts           # Entry point & App setup
│   └── swagger.ts          # Swagger configuration
├── dist/                   # Compiled JavaScript (generated on build)
├── .env                    # Environment variables (DO NOT COMMIT)
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 7. Troubleshooting

*   **MongoDB Connection Error:**
    *   Check if your IP address is whitelisted in MongoDB Atlas (Network Access).
    *   Ensure the username and password in `MONGODB_URI` are correct (special characters in passwords must be URL encoded).
*   **AWS S3 Upload Error:**
    *   Ensure your IAM User has `AmazonS3FullAccess` or specific write permissions to the bucket.
    *   Check that the Bucket Name and Region match exactly in `.env`.
*   **Port 5500 in use:**
    *   Change the `PORT` variable in your `.env` file to something else (e.g., 4000).