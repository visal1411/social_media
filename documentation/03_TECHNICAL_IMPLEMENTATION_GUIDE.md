# HobbyHub — Technical Implementation Guide & Full API Reference

**Product:** HobbyHub Social Platform for Hobby & Project Sharing
**Frontend:** React.js 18 + Vite (Web App)
**Backend:** Node.js + Express.js
**Auth:** JWT (JSON Web Tokens)
**Databases:** PostgreSQL + MongoDB + Redis
**Date:** March 2026

> **How to use this guide:** This document is meant for the development team. It covers every API endpoint, how the system works, code patterns, and what to check before going live. Plain English explanations are included for every section.

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Environment Setup](#2-environment-setup)
3. [Full API Endpoint Reference](#3-full-api-endpoint-reference)
   - [3.1 Auth Endpoints](#31-auth-endpoints)
   - [3.2 User Profile Endpoints](#32-user-profile-endpoints)
   - [3.3 Project Endpoints](#33-project-endpoints)
   - [3.4 Like Endpoints](#34-like-endpoints)
   - [3.5 Comment Endpoints](#35-comment-endpoints)
   - [3.6 Community Endpoints](#36-community-endpoints)
   - [3.7 Follow Endpoints](#37-follow-endpoints)
   - [3.8 Challenge Endpoints](#38-challenge-endpoints)
   - [3.9 Feed & Search Endpoints](#39-feed--search-endpoints)
   - [3.10 Notification Endpoints](#310-notification-endpoints)
   - [3.11 Admin Endpoints](#311-admin-endpoints)
   - [3.12 HTTP Status Code Reference](#312-http-status-code-reference)
4. [API Flow Diagrams](#4-api-flow-diagrams)
5. [Data Layer Architecture](#5-data-layer-architecture)
6. [Redis Caching Patterns](#6-redis-caching-patterns)
7. [Error Handling Standard](#7-error-handling-standard)
8. [Security Implementation](#8-security-implementation)
9. [Testing Checklist](#9-testing-checklist)
10. [Pre-Launch Checklist](#10-pre-launch-checklist)

---

## 1. System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                   USER BROWSER                                   │
│          React.js 18 + Vite (localhost:5173 in dev)             │
│  Pages: Home / Communities / Projects / Challenges / Directory / │
│         Notifications / Profile                                  │
└───────────────────────────┬──────────────────────────────────────┘
                             │ HTTPS (TLS 1.3)
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                   API GATEWAY                                    │
│    Node.js v20 + Express.js — Port 3001                         │
│    Middleware: JWT Auth, Rate Limit, Helmet, CORS, Morgan        │
│    Base URL: https://api.hobbyhub.com/api/v1                    │
├─────────────┬────────────────────┬───────────────┬──────────────┤
│ /auth       │ /users /projects   │ /communities  │ /challenges  │
│ /feed       │ /notifications     │ /search       │ /admin       │
└─────────────┴──────────┬─────────┴───────────────┴──────────────┘
                          │
            ┌─────────────┼──────────────────┐
            ▼             ▼                  ▼
┌────────────────┐  ┌──────────────┐  ┌────────────────┐
│  PostgreSQL    │  │   MongoDB    │  │  Redis Cache   │
│  Port 5432     │  │  Port 27017  │  │  Port 6379     │
│  (AWS RDS)     │  │  (Atlas)     │  │  (ElastiCache) │
│  Structured DB │  │  Documents   │  │  In-Memory     │
│  Users/Projects│  │  Notifs/Logs │  │  Feed/Sessions │
└────────────────┘  └──────────────┘  └────────────────┘
```

**How it works in plain English:**
1. The user opens HobbyHub in their browser (React.js app).
2. Every action (login, posting, liking) sends an HTTP request to our API server.
3. The API server checks the user's identity using a JWT token.
4. The server talks to the right database (PostgreSQL for main data, MongoDB for notifications, Redis for cached speed-data).
5. The server sends the result back to the browser as JSON (a simple text-based data format).
6. React.js reads the JSON and updates the page — no full-page reload needed.

---

## 2. Environment Setup

### Required `.env` File (never commit this to GitHub!)
```env
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# JWT Auth
JWT_SECRET=your-super-long-random-secret-key-here
JWT_EXPIRES_IN=7d

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=hobbyhub_db
PG_USER=hobbyhub_user
PG_PASSWORD=your-pg-password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hobbyhub_notifications

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# AWS (Production)
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=hobbyhub-media
```

### Quick Start Commands
```bash
# Install dependencies
npm install

# Run database migrations (creates all tables)
npm run db:migrate

# Seed the database with test data
npm run db:seed

# Start development server
npm run dev

# Run all tests
npm test
```

---

## 3. Full API Endpoint Reference

### Base URL
- **Development:** `http://localhost:3001/api/v1`
- **Production:** `https://api.hobbyhub.com/api/v1`

### Authentication Rule
Every "Protected" endpoint needs this header:
```
Authorization: Bearer <your_jwt_token>
```
If the token is missing or expired, the server returns `401 Unauthorized`.

---

### 3.1 Auth Endpoints

These endpoints handle creating accounts and logging in/out.

---

#### `POST /auth/signup` — Create a New Account
**Who can use it:** Public (no login needed)

**Request Body:**
```json
{
  "username": "alex_chen",
  "email": "alex@college.edu",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `username`: 3–50 characters, letters/numbers/underscores only, must be unique
- `email`: Valid email format, must be unique
- `password`: Minimum 8 characters, must contain at least 1 number

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "alex_chen",
      "email": "alex@college.edu",
      "plan_type": "free",
      "is_verified": false,
      "created_at": "2026-03-09T10:30:00Z"
    }
  }
}
```

**Error Responses:**
| Code | When It Happens |
|---|---|
| `400 Bad Request` | Missing fields or validation fails (password too short, invalid email) |
| `409 Conflict` | Email or username already exists in the database |

**What happens on the server:**
1. Validate the input data
2. Check if email/username is already taken (`SELECT` from `users`)
3. Hash the password using bcrypt (cost factor 12)
4. `INSERT` new user into PostgreSQL
5. Create a JWT token with the user's ID
6. Return the token and user data

---

#### `POST /auth/login` — Log In
**Who can use it:** Public

**Request Body:**
```json
{
  "email": "alex@college.edu",
  "password": "SecurePass123!"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2026-03-16T10:30:00Z",
    "user": {
      "user_id": 1,
      "username": "alex_chen",
      "plan_type": "free",
      "is_verified": false
    }
  }
}
```

**Error Responses:**
| Code | When It Happens |
|---|---|
| `400 Bad Request` | Missing email or password |
| `401 Unauthorized` | Email not found OR password is wrong |

---

#### `POST /auth/logout` — Log Out *(Protected)*
**Who can use it:** Logged-in users

**Request Body:** None needed (token in header identifies the user)

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Logged out successfully. Session cleared."
}
```

*What happens: The server deletes the session key from Redis: `DEL session:{user_id}`*

---

#### `POST /auth/refresh` — Refresh Login Token *(Protected)*
**Who can use it:** Logged-in users (before token expires)

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2026-03-16T10:30:00Z"
  }
}
```

---

#### `GET /auth/me` — Get My Own Info *(Protected)*
**Who can use it:** Logged-in users

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "alex_chen",
    "email": "alex@college.edu",
    "bio": "Building cool stuff. Looking for startup co-founders!",
    "avatar_url": null,
    "plan_type": "free",
    "is_verified": false,
    "created_at": "2026-03-01T09:00:00Z"
  }
}
```

---

### 3.2 User Profile Endpoints

---

#### `GET /users/:userId` — Get a User's Public Profile
**Who can use it:** Public

**URL Parameter:**
- `:userId` — the user's ID (e.g., `/users/1`)

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "alex_chen",
    "bio": "Building cool stuff. Looking for startup co-founders!",
    "avatar_url": null,
    "plan_type": "free",
    "is_verified": false,
    "skills": ["React", "Python", "UI/UX"],
    "follower_count": 342,
    "following_count": 156,
    "project_count": 3,
    "created_at": "2026-03-01T09:00:00Z"
  }
}
```

**Error Responses:**
| Code | When |
|---|---|
| `404 Not Found` | User with that ID does not exist |

---

#### `PATCH /users/:userId` — Update Profile *(Protected)*
**Who can use it:** Logged-in user (can only edit their OWN profile)

**Request Body (all fields optional — only send what you want to change):**
```json
{
  "bio": "Updated bio text here",
  "skills": ["React", "Python", "Node.js"],
  "avatar_url": "https://cdn.hobbyhub.com/avatars/alex_new.jpg"
}
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "alex_chen",
    "bio": "Updated bio text here",
    "skills": ["React", "Python", "Node.js"],
    "updated_at": "2026-03-09T15:00:00Z"
  }
}
```

**Error Responses:**
| Code | When |
|---|---|
| `403 Forbidden` | Trying to edit another user's profile |
| `422 Unprocessable Entity` | Bio exceeds 500 chars, invalid skill format |

---

#### `GET /users/:userId/projects` — Get User's Projects
**Who can use it:** Public

**Query Parameters (all optional):**
- `?status=published` — Filter by status (`published`, `featured`, `archived`)
- `?page=1&limit=12` — Pagination

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "project_id": 101,
        "title": "StudyBuddy App",
        "type": "startup",
        "status": "published",
        "tags": ["React", "AI", "Education"],
        "total_likes": 87,
        "total_comments": 14,
        "created_at": "2026-03-07T10:00:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 12
  }
}
```

---

#### `GET /users/:userId/followers` — Get User's Followers List
**Who can use it:** Public

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "followers": [
      {
        "user_id": 2,
        "username": "mia_torres",
        "avatar_url": null,
        "plan_type": "premium",
        "followed_at": "2026-03-05T08:00:00Z"
      }
    ],
    "total": 342
  }
}
```

---

#### `GET /users/:userId/following` — Get Who a User Follows
**Who can use it:** Public

*Same response structure as `/followers` but lists users they follow.*

---

### 3.3 Project Endpoints

---

#### `POST /projects` — Create a New Project *(Protected)*
**Who can use it:** Logged-in users

**Request Body:**
```json
{
  "title": "StudyBuddy App",
  "description": "AI-powered study planner that syncs with your class schedule. Looking for a designer!",
  "tags": ["React", "AI", "Education"],
  "community_id": 1,
  "type": "startup",
  "looking_for": "UI/UX Designer",
  "image_url": "https://cdn.hobbyhub.com/projects/studybuddy.jpg"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `description`: Required, max 2000 characters
- `tags`: Optional, max 5 tags, each max 30 characters
- `community_id`: Must be a valid, existing community ID
- `type`: Must be `"showcase"` or `"startup"`

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "title": "StudyBuddy App",
    "description": "AI-powered study planner...",
    "tags": ["React", "AI", "Education"],
    "community_id": 1,
    "type": "startup",
    "status": "published",
    "looking_for": "UI/UX Designer",
    "user": {
      "user_id": 1,
      "username": "alex_chen"
    },
    "total_likes": 0,
    "total_comments": 0,
    "created_at": "2026-03-09T15:30:00Z"
  }
}
```

**Error Responses:**
| Code | When |
|---|---|
| `400 Bad Request` | Missing required title or description |
| `404 Not Found` | `community_id` does not exist |
| `422 Unprocessable Entity` | Title too long, too many tags, invalid type |

*What happens on the server after creation:*
1. INSERT into PostgreSQL `projects` table
2. `DEL feed:user:{user_id}` — clears the cached feed in Redis so the new post shows up
3. MongoDB: Log activity `{type: 'new_project', actor: user_id, project_id: ...}`

---

#### `GET /projects` — List All Published Projects
**Who can use it:** Public

**Query Parameters:**
- `?type=startup` — Filter by type (`startup`, `showcase`)
- `?community_id=1` — Filter by community
- `?tag=React` — Filter by tag
- `?sort=likes` — Sort by likes count (default: `created_at`)
- `?page=1&limit=20` — Pagination (default: page 1, 20 per page)

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "project_id": 101,
        "title": "StudyBuddy App",
        "description": "AI-powered study planner...",
        "tags": ["React", "AI", "Education"],
        "type": "startup",
        "status": "published",
        "looking_for": "UI/UX Designer",
        "user": {
          "user_id": 1,
          "username": "alex_chen",
          "plan_type": "free"
        },
        "community": {
          "community_id": 1,
          "name": "Code & Create",
          "icon": "💻"
        },
        "total_likes": 87,
        "total_comments": 14,
        "created_at": "2026-03-07T10:00:00Z"
      }
    ],
    "total": 47,
    "page": 1,
    "limit": 20,
    "has_next": true
  }
}
```

---

#### `GET /projects/:projectId` — Get Single Project Details
**Who can use it:** Public

**Success Response — `200 OK`:**
Same structure as above for a single project, but also includes the first 5 comments in the response.

**Error Responses:**
| Code | When |
|---|---|
| `404 Not Found` | Project ID does not exist or project is archived |

---

#### `PATCH /projects/:projectId` — Edit a Project *(Protected)*
**Who can use it:** The project's creator only

**Request Body (send only the fields you want to change):**
```json
{
  "title": "StudyBuddy App v2",
  "description": "Updated description...",
  "tags": ["React", "AI", "Education", "Mobile"],
  "looking_for": "Backend Developer"
}
```

**Success Response — `200 OK`:** Returns the full updated project object.

**Error Responses:**
| Code | When |
|---|---|
| `403 Forbidden` | Trying to edit someone else's project |
| `404 Not Found` | Project does not exist |

---

#### `DELETE /projects/:projectId` — Delete a Project *(Protected)*
**Who can use it:** The project's creator OR an admin

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Project 'StudyBuddy App' has been deleted."
}
```

*What happens: All linked likes and comments are automatically deleted too (CASCADE in PostgreSQL). The feed cache is also cleared.*

---

#### `POST /projects/:projectId/publish` — Publish a Draft *(Protected)*
**Who can use it:** Project creator

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 101, "status": "published" }
}
```

---

#### `POST /projects/:projectId/archive` — Archive a Project *(Protected)*
**Who can use it:** Project creator

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 101, "status": "archived" }
}
```

---

### 3.4 Like Endpoints

---

#### `POST /projects/:projectId/likes` — Like a Project *(Protected)*

**Request Body:** None (user ID comes from the JWT token)

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "total_likes": 88,
    "liked_by_me": true
  }
}
```

**Error Responses:**
| Code | When |
|---|---|
| `404 Not Found` | Project does not exist |
| `409 Conflict` | User already liked this project (duplicate prevented by UNIQUE constraint) |

---

#### `DELETE /projects/:projectId/likes` — Remove Like (Unlike) *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "total_likes": 87,
    "liked_by_me": false
  }
}
```

**Error Responses:**
| Code | When |
|---|---|
| `404 Not Found` | Like record doesn't exist (user never liked this project) |

---

#### `GET /projects/:projectId/likes/count` — Get Like Count
**Who can use it:** Public

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 101, "total_likes": 87 }
}
```

---

### 3.5 Comment Endpoints

---

#### `POST /projects/:projectId/comments` — Add a Comment *(Protected)*

**Request Body:**
```json
{
  "body": "This looks amazing! I'd love to help with the UI/UX design.",
  "parent_id": null
}
```

- `body`: Required, max 1000 characters
- `parent_id`: Optional — set to a `comment_id` to make this a reply to that comment; `null` for a top-level comment

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "comment_id": 1001,
    "body": "This looks amazing! I'd love to help with the UI/UX design.",
    "parent_id": null,
    "user": {
      "user_id": 2,
      "username": "mia_torres",
      "plan_type": "premium"
    },
    "created_at": "2026-03-09T15:45:00Z"
  }
}
```

*After creating:* A MongoDB notification is inserted for the project owner. Example notification: `"mia_torres commented on your project StudyBuddy App"`

---

#### `GET /projects/:projectId/comments` — Get Comments and Replies
**Who can use it:** Public

**Query Parameters:**
- `?page=1&limit=20` — Pagination

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "comment_id": 1001,
        "body": "This looks amazing!",
        "parent_id": null,
        "depth": 0,
        "user": { "user_id": 2, "username": "mia_torres" },
        "created_at": "2026-03-09T15:45:00Z",
        "replies": [
          {
            "comment_id": 1002,
            "body": "@mia great! Let's connect",
            "parent_id": 1001,
            "depth": 1,
            "user": { "user_id": 1, "username": "alex_chen" },
            "created_at": "2026-03-09T16:00:00Z"
          }
        ]
      }
    ],
    "total": 14,
    "page": 1
  }
}
```

---

#### `PATCH /comments/:commentId` — Edit a Comment *(Protected)*

**Request Body:**
```json
{ "body": "Updated comment text here" }
```

**Success Response — `200 OK`:** Returns the updated comment object.

**Error Responses:**
| Code | When |
|---|---|
| `403 Forbidden` | Trying to edit another user's comment |
| `404 Not Found` | Comment does not exist |

---

#### `DELETE /comments/:commentId` — Delete a Comment *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "Comment deleted successfully."
}
```

*All replies to this comment are also deleted (CASCADE).*

---

#### `POST /comments/:commentId/replies` — Reply to a Comment *(Protected)*

Shorthand for posting a comment with `parent_id` set. Identical request/response to `POST /projects/:projectId/comments` with `parent_id` pre-filled.

---

### 3.6 Community Endpoints

---

#### `GET /communities` — List All Communities
**Who can use it:** Public

**Query Parameters:**
- `?sort=members` — Sort by member count (default) or `created_at`
- `?page=1&limit=12`

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "communities": [
      {
        "community_id": 1,
        "name": "Code & Create",
        "description": "A hub for developers, builders, and startup founders.",
        "icon": "💻",
        "color_hex": "#7c6df5",
        "cover_url": "https://images.unsplash.com/photo-...",
        "avatar_url": "https://images.unsplash.com/photo-...",
        "member_count": 1240,
        "tags": ["Web Dev", "Apps", "Startups"]
      }
    ],
    "total": 6
  }
}
```

---

#### `GET /communities/:communityId` — Get Community Details
**Who can use it:** Public

**Success Response — `200 OK`:**
Same as above for a single community, plus `recent_projects` (last 5 published projects in this community) and `recent_members` (last 5 users who joined).

**Error Responses:**
| Code | When |
|---|---|
| `404 Not Found` | Community ID does not exist |

---

#### `POST /communities/:communityId/join` — Join a Community *(Protected)*

**Request Body:** None

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "community_id": 1,
    "community_name": "Code & Create",
    "joined_at": "2026-03-09T15:50:00Z",
    "member_count": 1241
  },
  "message": "You joined Code & Create!"
}
```

**Error Responses:**
| Code | When |
|---|---|
| `403 Forbidden` | Free user already has 3 memberships and is trying to join a 4th |
| `404 Not Found` | Community does not exist |
| `409 Conflict` | User is already a member of this community |

---

#### `DELETE /communities/:communityId/join` — Leave a Community *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "You left Code & Create.",
  "data": { "member_count": 1240 }
}
```

---

#### `GET /communities/:communityId/projects` — Projects in a Community
**Who can use it:** Public

**Query Parameters:**
- `?sort=likes` or `?sort=newest`
- `?page=1&limit=20`

**Success Response — `200 OK`:** Same structure as `GET /projects` but filtered to this community.

---

### 3.7 Follow Endpoints

---

#### `POST /users/:userId/follow` — Follow a User *(Protected)*

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "following": true,
    "followee_id": 2,
    "followee_username": "mia_torres"
  },
  "message": "You are now following mia_torres!"
}
```

**Error Responses:**
| Code | When |
|---|---|
| `400 Bad Request` | Trying to follow yourself |
| `404 Not Found` | Target user does not exist |
| `409 Conflict` | Already following this user |

*After creating: A MongoDB notification is inserted for the followed user: `"alex_chen started following you"`*

---

#### `DELETE /users/:userId/follow` — Unfollow a User *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "following": false, "followee_id": 2 },
  "message": "You unfollowed mia_torres."
}
```

---

### 3.8 Challenge Endpoints

---

#### `GET /challenges/active` — Get Active Challenges
**Who can use it:** Public

**Logic:** Returns challenges where `ends_at > NOW()` (deadline hasn't passed).

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "challenge_id": 1,
        "title": "Build a Mini App in 48hrs",
        "description": "Build any web app in 48 hours and share your GitHub link.",
        "prize": "Featured Badge + 3 months Premium",
        "starts_at": "2026-03-08T00:00:00Z",
        "ends_at": "2026-03-12T00:00:00Z",
        "hours_remaining": 72,
        "participant_count": 67,
        "community": {
          "community_id": 1,
          "name": "Code & Create",
          "icon": "💻"
        }
      }
    ]
  }
}
```

---

#### `GET /challenges/:challengeId` — Get Challenge Details
**Who can use it:** Public

**Success Response — `200 OK`:** Full challenge details plus top 3 leaderboard entries.

---

#### `POST /challenges/:challengeId/entries` — Submit a Project to a Challenge *(Protected)*

**Request Body:**
```json
{ "project_id": 101 }
```

**Validation:**
- The project must belong to the logged-in user
- The project must be `status = 'published'`
- The challenge deadline must not have passed (`ends_at > NOW()`)
- The user cannot submit the same project to the same challenge twice

**Success Response — `201 Created`:**
```json
{
  "success": true,
  "data": {
    "entry_id": 901,
    "challenge_id": 1,
    "project_id": 101,
    "submitted_at": "2026-03-09T16:00:00Z"
  },
  "message": "Challenge entered! Good luck! 🎉"
}
```

**Error Responses:**
| Code | When |
|---|---|
| `400 Bad Request` | Deadline has passed |
| `403 Forbidden` | The project does not belong to the logged-in user |
| `404 Not Found` | Project or challenge does not exist |
| `409 Conflict` | Project already submitted to this challenge |

---

#### `GET /challenges/:challengeId/leaderboard` — Get Ranked Leaderboard
**Who can use it:** Public

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "challenge_id": 1,
    "leaderboard": [
      {
        "rank": 1,
        "dense_rank": 1,
        "entry_id": 903,
        "vote_count": 203,
        "project": { "project_id": 103, "title": "LoFi Beat Pack Vol.2" },
        "user": { "user_id": 3, "username": "leo_park", "avatar_url": null }
      },
      {
        "rank": 2,
        "dense_rank": 2,
        "entry_id": 901,
        "vote_count": 87,
        "project": { "project_id": 101, "title": "StudyBuddy App" },
        "user": { "user_id": 1, "username": "alex_chen", "avatar_url": null }
      }
    ],
    "total_entries": 67,
    "cache_ttl_seconds": 30
  }
}
```

*This response is served from Redis cache with a 30-second TTL.*

---

### 3.9 Feed & Search Endpoints

---

#### `GET /feed/:userId` — Get Personalized Home Feed *(Protected)*

**URL Parameter:** `:userId` must match the logged-in user's ID.

**How the feed is built:**
1. Check Redis: `GET feed:user:{userId}` → if found, return immediately (cache HIT)
2. If not cached, run the UNION query (Query 4 in the DB Design Document):
   - Projects from communities the user has joined
   - Projects from users the user follows
3. Sort by `created_at DESC`, limit to 40 items
4. Store result in Redis: `SET feed:user:{userId} <json> EX 120`
5. Return the feed

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "feed": [
      {
        "project_id": 101,
        "title": "StudyBuddy App",
        "feed_source": "community_feed",
        "user": { "user_id": 1, "username": "alex_chen" },
        "community": { "name": "Code & Create" },
        "total_likes": 87,
        "total_comments": 14,
        "liked_by_me": false,
        "created_at": "2026-03-07T10:00:00Z"
      }
    ],
    "served_from_cache": true,
    "cache_age_seconds": 45
  }
}
```

---

#### `GET /search/projects` — Search Projects
**Who can use it:** Public

**Query Parameters:**
- `?q=react ai` — The search keyword (required)
- `?tag=React` — Filter by exact tag
- `?type=startup` — Filter by type
- `?page=1&limit=20`

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "total": 12,
    "query": "react ai",
    "page": 1
  }
}
```

---

#### `GET /search/users` — Search Users / Directory
**Who can use it:** Public

**Query Parameters:**
- `?q=Mia` — Search by name
- `?skill=React` — Filter by skill tag
- `?page=1&limit=20`

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "user_id": 2,
        "username": "mia_torres",
        "bio": "Digital artist & visual storyteller.",
        "skills": ["Illustration", "Procreate", "Figma"],
        "plan_type": "premium",
        "follower_count": 289
      }
    ],
    "total": 1,
    "page": 1
  }
}
```

---

#### `GET /search/communities` — Search Communities
**Who can use it:** Public

**Query Parameters:**
- `?q=art` — Search by name or description

**Success Response — `200 OK`:** Returns matching community objects (same shape as `GET /communities`).

---

### 3.10 Notification Endpoints

---

#### `GET /notifications` — Get My Notifications *(Protected)*

**Query Parameters:**
- `?unread_only=true` — Only return unread notifications
- `?page=1&limit=20`

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": "507f1f77bcf86cd799439011",
        "type": "new_like",
        "read": false,
        "created_at": "2026-03-09T15:30:00Z",
        "time_ago": "2 minutes ago",
        "payload": {
          "actor_username": "mia_torres",
          "project_title": "StudyBuddy App"
        },
        "message": "mia_torres liked your project StudyBuddy App"
      },
      {
        "notification_id": "507f191e810c19729de860ea",
        "type": "new_comment",
        "read": false,
        "created_at": "2026-03-09T15:00:00Z",
        "time_ago": "15 minutes ago",
        "payload": {
          "actor_username": "leo_park",
          "project_title": "StudyBuddy App",
          "comment_preview": "This looks really useful!"
        },
        "message": "leo_park commented on your project StudyBuddy App"
      }
    ],
    "unread_count": 3,
    "total": 12,
    "page": 1
  }
}
```

---

#### `PATCH /notifications/:notificationId/read` — Mark One Notification Read *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "notification_id": "507f...", "read": true }
}
```

---

#### `PATCH /notifications/read-all` — Mark All Notifications Read *(Protected)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "message": "All notifications marked as read.",
  "data": { "updated_count": 3 }
}
```

---

### 3.11 Admin Endpoints

These endpoints require the user to have `role = 'admin'` in the database (checked via JWT claims).

---

#### `POST /admin/challenges` — Create a New Challenge *(Admin Only)*

**Request Body:**
```json
{
  "community_id": 1,
  "title": "60-Second Pitch Challenge",
  "description": "Record a 60-second pitch for your startup idea.",
  "prize": "Featured Spotlight + Premium for 1 month",
  "starts_at": "2026-03-10T00:00:00Z",
  "ends_at": "2026-03-17T23:59:59Z"
}
```

**Success Response — `201 Created`:** Returns the full new challenge object.

---

#### `PATCH /admin/projects/:projectId/feature` — Mark Project as Featured *(Admin Only)*

**Request Body:**
```json
{ "featured": true }
```

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 103, "status": "featured" },
  "message": "Project 'LoFi Beat Pack Vol.2' is now Showcase of the Week!"
}
```

---

#### `GET /admin/metrics` — View Platform Stats *(Admin Only)*

**Success Response — `200 OK`:**
```json
{
  "success": true,
  "data": {
    "total_users": 2847,
    "total_projects": 1203,
    "total_likes_today": 4521,
    "total_comments_today": 876,
    "active_challenges": 3,
    "premium_users": 142,
    "new_signups_today": 37
  }
}
```

---

### 3.12 HTTP Status Code Reference

| Code | Name | When to Use |
|---|---|---|
| `200 OK` | Success | Successful `GET`, `PATCH`, `DELETE` |
| `201 Created` | Resource Created | Successful `POST` (new data was created) |
| `400 Bad Request` | Invalid Input | Missing required field, wrong data format |
| `401 Unauthorized` | Not Logged In | No JWT token, or token is expired |
| `403 Forbidden` | No Permission | Logged in, but not allowed to do this action |
| `404 Not Found` | Doesn't Exist | The resource (user, project, etc.) was not found |
| `409 Conflict` | Duplicate | Tried to do something twice (like a project twice, join a community twice) |
| `422 Unprocessable Entity` | Validation Failed | Input format is correct but value breaks a business rule (e.g., bio too long) |
| `429 Too Many Requests` | Rate Limited | Too many requests in a short time (rate limiter kicked in) |
| `500 Internal Server Error` | Server Crash | Unexpected bug on the server — check the logs! |

**Standard Error Response Format (all errors look like this):**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_LIKE",
    "message": "You have already liked this project.",
    "status": 409
  }
}
```

**Total MVP Endpoint Count:**
- Core MVP endpoints: **42**
- Admin endpoints: **3**
- **Total: 45 documented endpoints**

---

## 4. API Flow Diagrams

### Login & Feed Load Flow

```
User opens HobbyHub
         │
         ▼
┌──────────────────────────┐
│ Browser checks localStorage│
│ for saved JWT token        │
└────────────┬─────────────┘
             │
       ┌─────┴──────┐
       │              │
    No Token      Token Found
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────────────────┐
│ Show Login  │  │ GET /auth/me + JWT        │
│ Page        │  │ (Verify token is valid)   │
└──────┬──────┘  └─────────────┬────────────┘
       │                        │
       │User logs in            │ 200 OK → token valid
       │POST /auth/login        │ 401 → token expired → show login
       │                        │
       ▼                        ▼
┌─────────────────────────────────────────┐
│  GET /feed/:userId                      │
│  Request hits API Server                │
│                                         │
│  1. Check Redis: GET feed:user:1        │
│     ├─ Cache HIT  → Return JSON ✅ <5ms │
│     └─ Cache MISS → Run SQL query       │
│          ↓                              │
│          JOIN projects + memberships    │
│          UNION follows                  │
│          ORDER BY created_at DESC       │
│          LIMIT 40                       │
│          ↓                              │
│          SET feed:user:1 EX 120 (Redis) │
│          Return JSON ✅ ~150ms          │
└─────────────────────────────────────────┘
         │
         ▼
React.js renders the Home Feed with project cards
```

---

### Post Project Flow

```
User clicks "+ New Project"
         │
         ▼
┌──────────────────────────────┐
│ Project Form Modal opens     │
│ Fields: title, description,  │
│ tags, community, type, image │
└────────────┬─────────────────┘
             │
         User fills in form and clicks "Submit"
             │
             ▼
┌──────────────────────────────┐
│ React Client-Side Validation │
│ ✔ Title not empty            │
│ ✔ Description not empty      │
│ ✔ Tags ≤ 5                  │
└────────────┬─────────────────┘
             │
        ┌────┴────┐
      FAIL       PASS
        │           │
        ▼           ▼
  Show inline  POST /projects + JWT
  error msgs   {title, desc, tags, community_id, type}
                    │
                    ▼
             API Server Checks:
             ✔ JWT token valid?
             ✔ community_id exists?
             ✔ type is valid?
                    │
                    ▼
             INSERT INTO projects (...)
             → Returns project_id = 101
                    │
                    ▼
             DEL feed:user:{user_id}  [Redis]
             (clears cached feed)
                    │
                    ▼
             MongoDB: Log {type: 'new_project'}
                    │
                    ▼
        Response: 201 Created
        {project_id: 101, title: "...", ...}
                    │
                    ▼
         React adds card to top of feed
         Toast: "Project posted! 🎉"
```

---

## 5. Data Layer Architecture

### When Data Goes Where

| User Action | PostgreSQL | MongoDB | Redis |
|---|---|---|---|
| Register / Login | ✅ INSERT/SELECT users | — | ✅ SET session token |
| View home feed | ✅ Complex JOIN query | — | ✅ Cache result 2 min |
| Post project | ✅ INSERT projects | ✅ Log activity | ✅ DEL feed cache |
| Like project | ✅ INSERT likes | ✅ Insert notification | ✅ DEL feed cache |
| Post comment | ✅ INSERT comments | ✅ Insert notification | — |
| Follow user | ✅ INSERT follows | ✅ Insert notification | ✅ DEL feed cache |
| Join community | ✅ INSERT memberships | — | ✅ DEL community count |
| Enter challenge | ✅ INSERT challenge_entries | — | ✅ DEL leaderboard cache |
| View leaderboard | ✅ (if cache miss) | — | ✅ Cache result 30 sec |
| View notifications | — | ✅ SELECT notifications | — |

---

## 6. Redis Caching Patterns

### Cache Keys Used in HobbyHub

| Key Pattern | What it stores | TTL | When to DELETE it |
|---|---|---|---|
| `feed:user:{user_id}` | Home feed JSON array | 120s (2 min) | On new project post, on new follow |
| `challenge:board:{challenge_id}` | Leaderboard JSON | 30s | On new like to an entry project |
| `community:count:{community_id}` | Member count integer | 600s (10 min) | On join or leave |
| `user:profile:{user_id}` | User profile JSON | 300s (5 min) | On profile update |
| `session:{user_id}` | JWT token string | 604800s (7 days) | On logout |
| `ratelimit:{user_id}:{endpoint}` | Request count integer | 60s | Auto-expires |

### Example Cache Read/Write in Node.js
```javascript
// Pseudocode for feed endpoint
async function getFeed(userId) {
  const cacheKey = `feed:user:${userId}`;

  // Step 1: Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { data: JSON.parse(cached), served_from_cache: true };
  }

  // Step 2: Cache miss → query the database
  const feedData = await db.query(`
    SELECT p.*, u.username, COUNT(l.like_id) as total_likes
    FROM projects p
    JOIN memberships m ON p.community_id = m.community_id
    JOIN users u ON p.user_id = u.user_id
    LEFT JOIN likes l ON p.project_id = l.project_id
    WHERE m.user_id = $1 AND p.status = 'published'
    GROUP BY p.project_id, u.user_id
    ORDER BY p.created_at DESC LIMIT 40
  `, [userId]);

  // Step 3: Store in cache for next time
  await redis.set(cacheKey, JSON.stringify(feedData), 'EX', 120);

  return { data: feedData, served_from_cache: false };
}
```

---

## 7. Error Handling Standard

All server errors follow this consistent pattern so the frontend always knows what to expect.

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_IN_UPPER_SNAKE_CASE",
    "message": "A plain-English message the UI can display to the user.",
    "status": 400,
    "details": {}
  }
}
```

### Common Error Codes

| Error Code | HTTP Status | Plain-English Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | One or more form fields failed validation |
| `MISSING_FIELD` | 400 | A required field is not in the request |
| `INVALID_TOKEN` | 401 | JWT token is missing or corrupted |
| `TOKEN_EXPIRED` | 401 | JWT token has been valid but is now past its 7-day expiry |
| `FORBIDDEN` | 403 | Logged in but not allowed to perform this action |
| `NOT_FOUND` | 404 | The thing you're looking for doesn't exist |
| `DUPLICATE_LIKE` | 409 | Already liked this project |
| `DUPLICATE_MEMBERSHIP` | 409 | Already a member of this community |
| `DUPLICATE_FOLLOW` | 409 | Already following this user |
| `DUPLICATE_ENTRY` | 409 | Already submitted this project to this challenge |
| `MEMBERSHIP_LIMIT` | 403 | Free user has reached the 3-community limit |
| `CHALLENGE_CLOSED` | 400 | Challenge deadline has already passed |
| `RATE_LIMITED` | 429 | Too many requests — slow down! |
| `INTERNAL_ERROR` | 500 | Unexpected bug — server team should investigate |

---

## 8. Security Implementation

### Password Security
```javascript
// Never store plain passwords. Always hash with bcrypt.
const bcrypt = require('bcrypt');
const BCRYPT_ROUNDS = 12; // Higher = slower = harder to crack

// On signup:
const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);

// On login:
const isMatch = await bcrypt.compare(plainPassword, storedHash);
// isMatch will be true if the password is correct
```

### JWT Token Structure
```
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "user_id": 1, "username": "alex_chen", "exp": 1741686000 }
Secret:  YOUR_JWT_SECRET_FROM_ENV_FILE (never hardcoded!)
```

### Rate Limiting Rules
| Endpoint Group | Limit | Window |
|---|---|---|
| `POST /auth/login` | 10 requests | 15 minutes (prevents brute-force attacks) |
| `POST /auth/signup` | 5 requests | 60 minutes |
| `POST /projects/:id/likes` | 30 requests | 60 seconds |
| All other endpoints | 100 requests | 60 seconds |

### Other Security Measures
- **HTTPS only** — all traffic is encrypted using TLS
- **Helmet.js** — sets secure HTTP headers automatically
- **CORS** — only requests from `FRONTEND_URL` are accepted
- **SQL Injection Prevention** — all DB queries use parameterized values (`$1`, `$2`)
- **Input Sanitization** — all user text input is stripped of HTML tags before saving

---

## 9. Testing Checklist

### ✅ Frontend Tests (React.js)
- [ ] User can register with valid email and password
- [ ] Error message shows when email is already taken
- [ ] Home feed loads and displays project cards
- [ ] Like button toggles: heart icon changes color, count updates immediately
- [ ] Comment modal opens, comment submitted and appears in list
- [ ] "+ New Project" form validates required fields before sending
- [ ] Community join/leave button toggles and shows success toast
- [ ] Directory search filters users in real-time
- [ ] Notifications page shows unread count badge on bell icon
- [ ] Mobile view (375px) shows bottom navigation with "More" button
- [ ] Desktop view (1280px+) shows full left sidebar

### ✅ Backend API Tests (Postman / Jest)
- [ ] `POST /auth/signup` → 201 Created, token returned
- [ ] `POST /auth/login` → 200 OK with correct user, 401 with wrong password
- [ ] `POST /projects` without token → 401 Unauthorized
- [ ] `POST /projects` with valid token → 201 Created, project appears in DB
- [ ] `POST /projects/{id}/likes` twice → second returns 409 Conflict
- [ ] `DELETE /projects/{id}/likes` → 200 OK, like removed from DB
- [ ] `GET /feed/:userId` → cached response on second request (check Redis)
- [ ] `GET /challenges/{id}/leaderboard` → projects ranked by likes correctly
- [ ] `POST /communities/{id}/join` 4th time as free user → 403 Forbidden
- [ ] `GET /search/projects?q=react` → returns only projects with "React" tag

### ✅ Database Tests
- [ ] `UNIQUE(user_id, project_id)` on likes table prevents duplicates
- [ ] `UNIQUE(user_id, community_id)` on memberships prevents duplicates
- [ ] `CHECK (follower_id != followee_id)` on follows prevents self-follows
- [ ] `ON DELETE CASCADE`: delete a user → their projects, likes, comments all deleted
- [ ] `ON DELETE SET NULL`: delete a community creator → community still exists
- [ ] Indexes are being used (EXPLAIN ANALYZE shows "Index Scan", not "Seq Scan")

---

## 10. Pre-Launch Checklist

- [ ] All API endpoints tested and returning correct responses
- [ ] All database indexes created (`npm run db:migrate`)
- [ ] Redis cache configured and connected
- [ ] Environment variables set in production (`.env` NOT in GitHub)
- [ ] HTTPS / SSL certificate installed on the server
- [ ] Rate limiting enabled on all auth endpoints
- [ ] CORS configured to only allow requests from `https://hobbyhub.com`
- [ ] Database backups scheduled (daily automated snapshots)
- [ ] Error monitoring set up (e.g., Sentry — alerts team when 500 errors occur)
- [ ] `EXPLAIN ANALYZE` run on Queries 1, 3, 7 — confirmed "Index Scan" (not "Seq Scan")
- [ ] Load test run with k6 — confirmed p95 response time < 300ms at 500 concurrent users
- [ ] Admin can create challenges and mark projects as featured
- [ ] User can delete their account and all data is removed (GDPR compliance)

---

*End of Technical Implementation Guide*
*See `04_DATABASE_NORMALIZATION.md` for the full normalization walkthrough with sample data tables.*
*See `02_DATABASE_DESIGN_DOCUMENT.md` for the ERD, SQL queries, and NoSQL plan.*
