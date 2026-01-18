# Comment System API

An enterprise-grade RESTful API for a comment system built with Node.js, Express.js, MongoDB, and JWT authentication. This system provides secure, scalable, and maintainable architecture following industry best practices and clean code principles.

## Features

### Core Functionality
- User authentication and authorization with JWT
- Create, read, update, and delete comments
- Like and dislike system with duplicate prevention
- Nested comments (replies to comments)
- Comment sorting (most liked, most disliked, newest, oldest)
- Pagination support for optimal performance
- Secure ownership-based authorization

## Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB v4.4 or higher
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/tasnimayan/comment-system-api.git
   cd comment-system-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/comment-system
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas cloud service
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify installation**
   Navigate to `http://localhost:5000/api/health` to check if the API is running.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Authentication Endpoints

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

---

### Comment Endpoints

#### Create a comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a great post!",
  "pageId": "blog-post-123",
  "parentCommentId": null
}
```

#### Get comments for a page
```http
GET /api/comments?pageId=blog-post-123&page=1&limit=10&sort=newest
Authorization: Bearer <token>
```

**Query Parameters:**
- `pageId` (required): ID of the page/post
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sort` (optional): Sort order - `newest`, `oldest`, `mostLiked`, `mostDisliked` (default: newest)
- `parentCommentId` (optional): Get replies to a specific comment

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f1234567890abcdef12345",
      "content": "This is a great post!",
      "author": {
        "_id": "65f1234567890abcdef11111",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "pageId": "blog-post-123",
      "likes": [],
      "dislikes": [],
      "likesCount": 0,
      "dislikesCount": 0,
      "isEdited": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "pageSize": 10,
    "totalCount": 47,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get a specific comment
```http
GET /api/comments/:id
Authorization: Bearer <token>
```

#### Update a comment
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

#### Delete a comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

#### Like a comment
```http
POST /api/comments/:id/like
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Comment liked successfully",
  "data": {
    "_id": "65f1234567890abcdef12345",
    "content": "This is a great post!",
    "likesCount": 1,
    "dislikesCount": 0
  }
}
```

#### Dislike a comment
```http
POST /api/comments/:id/dislike
Authorization: Bearer <token>
```

#### Get replies to a comment
```http
GET /api/comments/:id/replies?page=1&limit=10&sort=newest
Authorization: Bearer <token>
```

---

## Error Handling

The API uses standard HTTP status codes and returns errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error


## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on the GitHub repository.