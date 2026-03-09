# HobbyHub — Full API Endpoint Reference

**Product:** HobbyHub Social Platform
**API Version:** v1
**Base URL (Development):** `http://localhost:3001/api/v1`
**Base URL (Production):** `https://api.hobbyhub.com/api/v1`
**Date:** March 2026
**Total Endpoints:** 45

> **How to read this document:**
> - 🔓 **Public** — anyone can call this endpoint (no login required)
> - 🔐 **Protected** — must include `Authorization: Bearer <token>` in the request header
> - 🛡️ **Admin Only** — must be a logged-in admin user

---

## Quick Reference — All Endpoints at a Glance

| # | Method | Endpoint | Auth | Description |
|---|---|---|---|---|
| **AUTH** |
| 1 | POST | `/auth/signup` | 🔓 Public | Create a new account |
| 2 | POST | `/auth/login` | 🔓 Public | Log in and get a token |
| 3 | POST | `/auth/logout` | 🔐 Protected | Log out, clear session |
| 4 | POST | `/auth/refresh` | 🔐 Protected | Get a new token before expiry |
| 5 | GET | `/auth/me` | 🔐 Protected | Get my own logged-in user info |
| **USERS** |
| 6 | GET | `/users/:userId` | 🔓 Public | Get a user's public profile |
| 7 | PATCH | `/users/:userId` | 🔐 Protected | Update my own profile |
| 8 | GET | `/users/:userId/projects` | 🔓 Public | Get all projects by a user |
| 9 | GET | `/users/:userId/followers` | 🔓 Public | Get a user's followers list |
| 10 | GET | `/users/:userId/following` | 🔓 Public | Get who a user follows |
| **PROJECTS** |
| 11 | POST | `/projects` | 🔐 Protected | Create a new project |
| 12 | GET | `/projects` | 🔓 Public | List all published projects |
| 13 | GET | `/projects/:projectId` | 🔓 Public | Get one project's details |
| 14 | PATCH | `/projects/:projectId` | 🔐 Protected | Edit my project |
| 15 | DELETE | `/projects/:projectId` | 🔐 Protected | Delete my project |
| 16 | POST | `/projects/:projectId/publish` | 🔐 Protected | Publish a draft project |
| 17 | POST | `/projects/:projectId/archive` | 🔐 Protected | Archive a project |
| **LIKES** |
| 18 | POST | `/projects/:projectId/likes` | 🔐 Protected | Like a project |
| 19 | DELETE | `/projects/:projectId/likes` | 🔐 Protected | Unlike a project |
| 20 | GET | `/projects/:projectId/likes/count` | 🔓 Public | Get like count for a project |
| **COMMENTS** |
| 21 | POST | `/projects/:projectId/comments` | 🔐 Protected | Add a comment to a project |
| 22 | GET | `/projects/:projectId/comments` | 🔓 Public | Get all comments for a project |
| 23 | PATCH | `/comments/:commentId` | 🔐 Protected | Edit my comment |
| 24 | DELETE | `/comments/:commentId` | 🔐 Protected | Delete my comment |
| 25 | POST | `/comments/:commentId/replies` | 🔐 Protected | Reply to a comment |
| **COMMUNITIES** |
| 26 | GET | `/communities` | 🔓 Public | List all communities |
| 27 | GET | `/communities/:communityId` | 🔓 Public | Get community details |
| 28 | POST | `/communities/:communityId/join` | 🔐 Protected | Join a community |
| 29 | DELETE | `/communities/:communityId/join` | 🔐 Protected | Leave a community |
| 30 | GET | `/communities/:communityId/projects` | 🔓 Public | Get projects in a community |
| **FOLLOWS** |
| 31 | POST | `/users/:userId/follow` | 🔐 Protected | Follow a user |
| 32 | DELETE | `/users/:userId/follow` | 🔐 Protected | Unfollow a user |
| **CHALLENGES** |
| 33 | GET | `/challenges/active` | 🔓 Public | Get all active challenges |
| 34 | GET | `/challenges/:challengeId` | 🔓 Public | Get one challenge's details |
| 35 | POST | `/challenges/:challengeId/entries` | 🔐 Protected | Submit a project to a challenge |
| 36 | GET | `/challenges/:challengeId/leaderboard` | 🔓 Public | Get ranked leaderboard |
| **FEED & SEARCH** |
| 37 | GET | `/feed/:userId` | 🔐 Protected | Get personalized home feed |
| 38 | GET | `/search/projects` | 🔓 Public | Search projects by keyword |
| 39 | GET | `/search/users` | 🔓 Public | Search users / browse directory |
| 40 | GET | `/search/communities` | 🔓 Public | Search communities |
| **NOTIFICATIONS** |
| 41 | GET | `/notifications` | 🔐 Protected | Get my notifications |
| 42 | PATCH | `/notifications/:notificationId/read` | 🔐 Protected | Mark one notification as read |
| 43 | PATCH | `/notifications/read-all` | 🔐 Protected | Mark all notifications as read |
| **ADMIN** |
| 44 | POST | `/admin/challenges` | 🛡️ Admin | Create a new challenge |
| 45 | PATCH | `/admin/projects/:projectId/feature` | 🛡️ Admin | Mark a project as featured |

---

## Standard Response Formats

### ✅ Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_UPPER_SNAKE_CASE",
    "message": "A plain-English message shown to the user.",
    "status": 400
  }
}
```

### 🔑 Authentication Header (required for all 🔐 endpoints)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## HTTP Status Code Reference

| Code | Name | Meaning |
|---|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | New resource was created |
| `400` | Bad Request | Missing or invalid input |
| `401` | Unauthorized | Not logged in, or token expired |
| `403` | Forbidden | Logged in but not allowed |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate action (liked twice, joined twice) |
| `422` | Unprocessable Entity | Input format valid but breaks a business rule |
| `429` | Too Many Requests | Rate limit hit — slow down |
| `500` | Internal Server Error | Server bug — check logs |

---

## GROUP 1 — Auth Endpoints

---

### EP-01 · `POST /auth/signup`
**Auth:** 🔓 Public  
**Description:** Register a new user account. Returns a JWT token immediately so the user is logged in right after signing up.

**Request Body:**
```json
{
  "username": "alex_chen",
  "email": "alex@college.edu",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
| Field | Rule |
|---|---|
| `username` | Required · 3–50 chars · letters, numbers, underscores only · must be unique |
| `email` | Required · valid email format · must be unique |
| `password` | Required · minimum 8 characters · must contain at least 1 number |

**Success → `201 Created`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2026-03-16T10:30:00Z",
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `MISSING_FIELD` | Username, email, or password not provided |
| `400` | `VALIDATION_ERROR` | Password too short, invalid email format |
| `409` | `DUPLICATE_EMAIL` | Email already registered |
| `409` | `DUPLICATE_USERNAME` | Username already taken |

---

### EP-02 · `POST /auth/login`
**Auth:** 🔓 Public  
**Description:** Log in with email and password. Returns a JWT token valid for 7 days.

**Request Body:**
```json
{
  "email": "alex@college.edu",
  "password": "SecurePass123!"
}
```

**Success → `200 OK`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `MISSING_FIELD` | Email or password not provided |
| `401` | `INVALID_CREDENTIALS` | Email not found OR password is wrong |
| `429` | `RATE_LIMITED` | More than 10 login attempts in 15 minutes |

---

### EP-03 · `POST /auth/logout`
**Auth:** 🔐 Protected  
**Description:** Log out. Clears the session from Redis so the token can no longer be used.

**Request Body:** None

**Success → `200 OK`:**
```json
{
  "success": true,
  "message": "Logged out successfully. Session cleared."
}
```

---

### EP-04 · `POST /auth/refresh`
**Auth:** 🔐 Protected  
**Description:** Get a fresh JWT token before the current one expires. Extends the session by 7 more days.

**Request Body:** None (current token in header)

**Success → `200 OK`:**
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

### EP-05 · `GET /auth/me`
**Auth:** 🔐 Protected  
**Description:** Returns the full profile of the currently logged-in user. Useful for loading the app after page refresh.

**Request Body:** None

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "alex_chen",
    "email": "alex@college.edu",
    "bio": "Building cool stuff.",
    "avatar_url": null,
    "plan_type": "free",
    "is_verified": false,
    "follower_count": 342,
    "following_count": 156,
    "project_count": 3,
    "created_at": "2026-03-01T09:00:00Z"
  }
}
```

---

## GROUP 2 — User Profile Endpoints

---

### EP-06 · `GET /users/:userId`
**Auth:** 🔓 Public  
**Description:** Get a user's public profile page — their bio, skills, stats, and plan.

**URL Parameter:** `:userId` (integer)

**Example Request:** `GET /users/1`

**Success → `200 OK`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `404` | `USER_NOT_FOUND` | No user with that ID |

---

### EP-07 · `PATCH /users/:userId`
**Auth:** 🔐 Protected (only own profile)  
**Description:** Update my profile bio, skills, or avatar. Send only the fields you want to change.

**Request Body (all optional):**
```json
{
  "bio": "Updated bio — 4th year now!",
  "skills": ["React", "Python", "Node.js", "PostgreSQL"],
  "avatar_url": "https://cdn.hobbyhub.com/avatars/alex_new.jpg"
}
```

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "alex_chen",
    "bio": "Updated bio — 4th year now!",
    "skills": ["React", "Python", "Node.js", "PostgreSQL"],
    "updated_at": "2026-03-09T15:00:00Z"
  }
}
```

**Errors:**
| Status | Code | When |
|---|---|---|
| `403` | `FORBIDDEN` | Trying to edit someone else's profile |
| `422` | `VALIDATION_ERROR` | Bio over 500 chars, more than 10 skills |

---

### EP-08 · `GET /users/:userId/projects`
**Auth:** 🔓 Public  
**Description:** List all published projects by a specific user. Used on the Profile page.

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `status` | string | `published` | Filter: `published`, `featured`, `archived` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `12` | Items per page |

**Success → `200 OK`:**
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
    "limit": 12,
    "has_next": false
  }
}
```

---

### EP-09 · `GET /users/:userId/followers`
**Auth:** 🔓 Public  
**Description:** Get the list of users who follow a specific user.

**Query Parameters:** `?page=1&limit=20`

**Success → `200 OK`:**
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

### EP-10 · `GET /users/:userId/following`
**Auth:** 🔓 Public  
**Description:** Get the list of users that a specific user follows.

**Success → `200 OK`:** Same structure as EP-09 (`followers` array) but shows who they follow.

---

## GROUP 3 — Project Endpoints

---

### EP-11 · `POST /projects`
**Auth:** 🔐 Protected  
**Description:** Create and publish a new project. The project is immediately published and appears on the community feed.

**Request Body:**
```json
{
  "title": "StudyBuddy App",
  "description": "AI-powered study planner that syncs with your class schedule and generates revision questions from your notes. Currently in beta with 200+ users.",
  "tags": ["React", "AI", "Education"],
  "community_id": 1,
  "type": "startup",
  "looking_for": "UI/UX Designer",
  "image_url": "https://cdn.hobbyhub.com/projects/studybuddy.jpg"
}
```

**Field Rules:**
| Field | Required | Rule |
|---|---|---|
| `title` | ✅ Yes | Max 200 characters |
| `description` | ✅ Yes | Max 2000 characters |
| `community_id` | ✅ Yes | Must be a valid community ID |
| `type` | ✅ Yes | Must be `"startup"` or `"showcase"` |
| `tags` | ❌ No | Max 5 tags, each max 30 characters |
| `looking_for` | ❌ No | Max 200 characters |
| `image_url` | ❌ No | Full URL to image (AWS S3 in production) |

**Success → `201 Created`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "title": "StudyBuddy App",
    "description": "AI-powered study planner...",
    "tags": ["React", "AI", "Education"],
    "type": "startup",
    "status": "published",
    "looking_for": "UI/UX Designer",
    "image_url": null,
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
    "total_likes": 0,
    "total_comments": 0,
    "created_at": "2026-03-09T15:30:00Z"
  }
}
```

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `MISSING_FIELD` | Title or description not provided |
| `404` | `COMMUNITY_NOT_FOUND` | `community_id` does not exist |
| `422` | `VALIDATION_ERROR` | Title too long, too many tags, invalid type |

> **What happens after creation:**
> 1. `INSERT INTO projects (...)` in PostgreSQL
> 2. `DEL feed:user:{user_id}` in Redis (clears cached feed so new post appears)
> 3. MongoDB: Log `{ type: 'new_project', user_id, project_id }`

---

### EP-12 · `GET /projects`
**Auth:** 🔓 Public  
**Description:** Browse all published projects on the platform. Supports filtering, sorting, and pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `type` | string | — | Filter: `startup` or `showcase` |
| `community_id` | integer | — | Filter by community |
| `tag` | string | — | Filter by tag (exact match) |
| `sort` | string | `created_at` | Sort by: `likes`, `comments`, `created_at` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Results per page (max 50) |

**Example:** `GET /projects?type=startup&tag=React&sort=likes&page=1&limit=20`

**Success → `200 OK`:**
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
          "plan_type": "free",
          "is_verified": false
        },
        "community": {
          "community_id": 1,
          "name": "Code & Create",
          "icon": "💻",
          "color_hex": "#7c6df5"
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

### EP-13 · `GET /projects/:projectId`
**Auth:** 🔓 Public  
**Description:** Get full details of a single project, including its first 5 comments.

**Example:** `GET /projects/101`

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "title": "StudyBuddy App",
    "description": "AI-powered study planner...",
    "tags": ["React", "AI", "Education"],
    "type": "startup",
    "status": "published",
    "looking_for": "UI/UX Designer",
    "user": { "user_id": 1, "username": "alex_chen", "plan_type": "free" },
    "community": { "community_id": 1, "name": "Code & Create", "icon": "💻" },
    "total_likes": 87,
    "total_comments": 14,
    "liked_by_me": false,
    "comments_preview": [ ... ],
    "created_at": "2026-03-07T10:00:00Z",
    "updated_at": "2026-03-07T10:00:00Z"
  }
}
```

**Errors:**
| Status | Code | When |
|---|---|---|
| `404` | `PROJECT_NOT_FOUND` | No project with that ID, or it's archived |

---

### EP-14 · `PATCH /projects/:projectId`
**Auth:** 🔐 Protected (creator only)  
**Description:** Edit a project. Only the creator can edit their own project. Send only the fields you want to change.

**Request Body (all optional):**
```json
{
  "title": "StudyBuddy App v2",
  "description": "Updated with new features...",
  "tags": ["React", "AI", "Education", "Mobile"],
  "looking_for": "Backend Developer"
}
```

**Success → `200 OK`:** Returns the full updated project object (same shape as EP-13).

**Errors:**
| Status | Code | When |
|---|---|---|
| `403` | `FORBIDDEN` | Logged-in user is not the project creator |
| `404` | `PROJECT_NOT_FOUND` | Project does not exist |

---

### EP-15 · `DELETE /projects/:projectId`
**Auth:** 🔐 Protected (creator or admin)  
**Description:** Permanently delete a project. All linked likes, comments, and challenge entries are also deleted automatically (via `ON DELETE CASCADE` in PostgreSQL).

**Success → `200 OK`:**
```json
{
  "success": true,
  "message": "Project 'StudyBuddy App' has been permanently deleted."
}
```

---

### EP-16 · `POST /projects/:projectId/publish`
**Auth:** 🔐 Protected (creator only)  
**Description:** Move a draft project to `published` status so it appears on the community feed.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 101, "status": "published" },
  "message": "Your project is now live!"
}
```

---

### EP-17 · `POST /projects/:projectId/archive`
**Auth:** 🔐 Protected (creator only)  
**Description:** Hide a project from the feed without deleting it. Can be reversed.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": { "project_id": 101, "status": "archived" },
  "message": "Project archived. It will no longer appear in the feed."
}
```

---

## GROUP 4 — Like Endpoints

---

### EP-18 · `POST /projects/:projectId/likes`
**Auth:** 🔐 Protected  
**Description:** Like a project. A user can only like a project once — the `UNIQUE(user_id, project_id)` constraint in the database blocks duplicates.

**Request Body:** None (user ID is taken from the JWT token)

**Success → `201 Created`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `404` | `PROJECT_NOT_FOUND` | Project does not exist |
| `409` | `DUPLICATE_LIKE` | User already liked this project |

> **Side effect:** If the liked project is a challenge entry, Redis clears the leaderboard cache: `DEL challenge:board:{challenge_id}`

---

### EP-19 · `DELETE /projects/:projectId/likes`
**Auth:** 🔐 Protected  
**Description:** Remove a like from a project (unlike). Decreases the like count by 1.

**Success → `200 OK`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `404` | `LIKE_NOT_FOUND` | User never liked this project (nothing to remove) |

---

### EP-20 · `GET /projects/:projectId/likes/count`
**Auth:** 🔓 Public  
**Description:** Get the total like count for a specific project.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "project_id": 101,
    "total_likes": 87
  }
}
```

---

## GROUP 5 — Comment Endpoints

---

### EP-21 · `POST /projects/:projectId/comments`
**Auth:** 🔐 Protected  
**Description:** Add a top-level comment to a project. Set `parent_id` to make it a reply to another comment.

**Request Body:**
```json
{
  "body": "This looks amazing! I'd love to help with the UI/UX design.",
  "parent_id": null
}
```

| Field | Required | Rule |
|---|---|---|
| `body` | ✅ Yes | Max 1000 characters, cannot be empty |
| `parent_id` | ❌ No | If provided, must be a valid comment ID on the same project. `null` for a top-level comment. |

**Success → `201 Created`:**
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
      "avatar_url": null,
      "plan_type": "premium"
    },
    "created_at": "2026-03-09T15:45:00Z"
  }
}
```

> **Side effect:** Creates a MongoDB notification for the project owner:
> `{ type: "new_comment", actor: "mia_torres", project_title: "StudyBuddy App" }`

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `EMPTY_COMMENT` | Comment body is blank |
| `404` | `PROJECT_NOT_FOUND` | Project does not exist |
| `404` | `PARENT_NOT_FOUND` | `parent_id` references a non-existent comment |
| `422` | `VALIDATION_ERROR` | Comment body exceeds 1000 characters |

---

### EP-22 · `GET /projects/:projectId/comments`
**Auth:** 🔓 Public  
**Description:** Get all comments for a project. Replies are nested under their parent comment.

**Query Parameters:** `?page=1&limit=20`

**Success → `200 OK`:**
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
            "body": "@mia Great! Let's connect.",
            "parent_id": 1001,
            "depth": 1,
            "user": { "user_id": 1, "username": "alex_chen" },
            "created_at": "2026-03-09T16:00:00Z"
          }
        ]
      }
    ],
    "total": 14,
    "page": 1,
    "limit": 20
  }
}
```

---

### EP-23 · `PATCH /comments/:commentId`
**Auth:** 🔐 Protected (comment owner only)  
**Description:** Edit the text of my own comment.

**Request Body:**
```json
{ "body": "Updated comment text here." }
```

**Success → `200 OK`:** Returns the updated comment object.

**Errors:**
| Status | Code | When |
|---|---|---|
| `403` | `FORBIDDEN` | Trying to edit another user's comment |
| `404` | `COMMENT_NOT_FOUND` | Comment does not exist |

---

### EP-24 · `DELETE /comments/:commentId`
**Auth:** 🔐 Protected (comment owner or admin)  
**Description:** Delete a comment. All replies to this comment are also deleted (CASCADE).

**Success → `200 OK`:**
```json
{
  "success": true,
  "message": "Comment deleted."
}
```

---

### EP-25 · `POST /comments/:commentId/replies`
**Auth:** 🔐 Protected  
**Description:** Shorthand for replying directly to a specific comment. Equivalent to `POST /projects/:id/comments` with `parent_id` pre-filled.

**Request Body:**
```json
{ "body": "Thanks for the feedback!" }
```

**Success → `201 Created`:** Returns new reply comment object (same shape as EP-21).

---

## GROUP 6 — Community Endpoints

---

### EP-26 · `GET /communities`
**Auth:** 🔓 Public  
**Description:** List all communities. Used on the Communities page to display all groups.

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `sort` | string | `members` | Sort by `members` count or `created_at` |
| `page` | integer | `1` | Page number |
| `limit` | integer | `12` | Results per page |

**Success → `200 OK`:**
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
        "cover_url": "https://images.unsplash.com/photo-1555066931...",
        "avatar_url": "https://images.unsplash.com/photo-1542831371...",
        "member_count": 1240,
        "tags": ["Web Dev", "Apps", "Startups"]
      }
    ],
    "total": 6
  }
}
```

---

### EP-27 · `GET /communities/:communityId`
**Auth:** 🔓 Public  
**Description:** Get full details of one community — including recent projects and recent members.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "community_id": 1,
    "name": "Code & Create",
    "description": "A hub for developers, builders and startup founders.",
    "icon": "💻",
    "color_hex": "#7c6df5",
    "cover_url": "...",
    "avatar_url": "...",
    "member_count": 1240,
    "recent_projects": [ ... ],
    "recent_members": [ ... ],
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

**Errors:**
| Status | Code | When |
|---|---|---|
| `404` | `COMMUNITY_NOT_FOUND` | Community does not exist |

---

### EP-28 · `POST /communities/:communityId/join`
**Auth:** 🔐 Protected  
**Description:** Join a community. Inserts a row in the `memberships` table. Free users are limited to 3 communities.

**Request Body:** None

**Success → `201 Created`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `403` | `MEMBERSHIP_LIMIT` | Free user already has 3 active memberships |
| `404` | `COMMUNITY_NOT_FOUND` | Community does not exist |
| `409` | `DUPLICATE_MEMBERSHIP` | User is already a member |

> **Side effect:** Clears `community:count:{community_id}` from Redis.

---

### EP-29 · `DELETE /communities/:communityId/join`
**Auth:** 🔐 Protected  
**Description:** Leave a community. Removes the row from the `memberships` table.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": { "member_count": 1240 },
  "message": "You left Code & Create."
}
```

---

### EP-30 · `GET /communities/:communityId/projects`
**Auth:** 🔓 Public  
**Description:** Get all published projects posted within a specific community. Used on the Community Detail page.

**Query Parameters:** `?sort=likes` or `?sort=newest` · `?page=1&limit=20`

**Success → `200 OK`:** Same structure as `GET /projects` (EP-12) filtered to this community.

---

## GROUP 7 — Follow Endpoints

---

### EP-31 · `POST /users/:userId/follow`
**Auth:** 🔐 Protected  
**Description:** Follow another user. Their new projects will then appear in your home feed.

**Example:** `POST /users/2/follow` (follows user with ID 2)

**Request Body:** None

**Success → `201 Created`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `SELF_FOLLOW` | Trying to follow yourself |
| `404` | `USER_NOT_FOUND` | Target user does not exist |
| `409` | `DUPLICATE_FOLLOW` | Already following this user |

> **Side effect:**
> 1. Creates MongoDB notification for `mia_torres`: `"alex_chen started following you"`
> 2. Clears `feed:user:{follower_id}` from Redis so new followee's posts appear

---

### EP-32 · `DELETE /users/:userId/follow`
**Auth:** 🔐 Protected  
**Description:** Unfollow a user. Their new projects will no longer appear in your feed.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": { "following": false, "followee_id": 2 },
  "message": "You unfollowed mia_torres."
}
```

---

## GROUP 8 — Challenge Endpoints

---

### EP-33 · `GET /challenges/active`
**Auth:** 🔓 Public  
**Description:** Get all challenges where `ends_at > NOW()` (deadline not yet passed). Used on the Challenges page.

**Success → `200 OK`:**
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
          "icon": "💻",
          "color_hex": "#7c6df5"
        }
      }
    ],
    "total": 3
  }
}
```

---

### EP-34 · `GET /challenges/:challengeId`
**Auth:** 🔓 Public  
**Description:** Full details of one challenge including the top 3 leaderboard entries.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "challenge_id": 1,
    "title": "Build a Mini App in 48hrs",
    "description": "Build any web app in 48 hours...",
    "prize": "Featured Badge + 3 months Premium",
    "starts_at": "2026-03-08T00:00:00Z",
    "ends_at": "2026-03-12T00:00:00Z",
    "hours_remaining": 72,
    "participant_count": 67,
    "community": { "community_id": 1, "name": "Code & Create" },
    "top_entries": [
      {
        "rank": 1,
        "vote_count": 203,
        "project": { "project_id": 103, "title": "LoFi Beat Pack Vol.2" },
        "user": { "user_id": 3, "username": "leo_park" }
      }
    ]
  }
}
```

---

### EP-35 · `POST /challenges/:challengeId/entries`
**Auth:** 🔐 Protected  
**Description:** Submit one of my published projects as an entry to an active challenge.

**Request Body:**
```json
{ "project_id": 101 }
```

**Validation Rules:**
- The project must belong to the logged-in user
- The project `status` must be `"published"`
- The challenge `ends_at` must be in the future
- The same project cannot be submitted to the same challenge twice

**Success → `201 Created`:**
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

**Errors:**
| Status | Code | When |
|---|---|---|
| `400` | `CHALLENGE_CLOSED` | The challenge deadline has already passed |
| `403` | `NOT_PROJECT_OWNER` | The project does not belong to the logged-in user |
| `403` | `PROJECT_NOT_PUBLISHED` | The project is still a draft |
| `404` | `CHALLENGE_NOT_FOUND` | Challenge does not exist |
| `404` | `PROJECT_NOT_FOUND` | Project does not exist |
| `409` | `DUPLICATE_ENTRY` | This project is already submitted to this challenge |

---

### EP-36 · `GET /challenges/:challengeId/leaderboard`
**Auth:** 🔓 Public  
**Description:** Get all challenge entries ranked by their total like count. Results are cached in Redis for 30 seconds.

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "challenge_id": 1,
    "challenge_title": "Build a Mini App in 48hrs",
    "leaderboard": [
      {
        "rank": 1,
        "dense_rank": 1,
        "entry_id": 903,
        "vote_count": 203,
        "project": {
          "project_id": 103,
          "title": "LoFi Beat Pack Vol.2",
          "image_url": null
        },
        "user": {
          "user_id": 3,
          "username": "leo_park",
          "avatar_url": null,
          "plan_type": "premium"
        }
      },
      {
        "rank": 2,
        "dense_rank": 2,
        "entry_id": 901,
        "vote_count": 87,
        "project": {
          "project_id": 101,
          "title": "StudyBuddy App"
        },
        "user": {
          "user_id": 1,
          "username": "alex_chen",
          "plan_type": "free"
        }
      }
    ],
    "total_entries": 67,
    "served_from_cache": true,
    "cache_ttl_seconds": 30
  }
}
```

---

## GROUP 9 — Feed & Search Endpoints

---

### EP-37 · `GET /feed/:userId`
**Auth:** 🔐 Protected  
**Description:** Get the personalized home feed for the logged-in user. Combines projects from joined communities and followed users, ordered by newest first. Served from Redis cache when available.

**Cache behavior:**
- **Cache HIT** (key `feed:user:{userId}` exists in Redis) → response in < 5ms
- **Cache MISS** → runs full JOIN + UNION SQL query (~150ms) → stores result in Redis for 120 seconds

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "feed": [
      {
        "project_id": 101,
        "title": "StudyBuddy App",
        "description": "AI-powered study planner...",
        "tags": ["React", "AI"],
        "type": "startup",
        "feed_source": "community_feed",
        "user": { "user_id": 1, "username": "alex_chen", "plan_type": "free" },
        "community": { "community_id": 1, "name": "Code & Create" },
        "total_likes": 87,
        "total_comments": 14,
        "liked_by_me": false,
        "created_at": "2026-03-07T10:00:00Z"
      }
    ],
    "total": 34,
    "served_from_cache": true,
    "cache_age_seconds": 45
  }
}
```

> `feed_source` is either `"community_feed"` (from a joined community) or `"following_feed"` (from a followed user).

---

### EP-38 · `GET /search/projects`
**Auth:** 🔓 Public  
**Description:** Full-text search for projects by keyword. Uses a PostgreSQL GIN index for fast results. Also supports tag and type filtering.

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `q` | string | ✅ Yes | Search keyword (e.g., `react ai`) |
| `tag` | string | ❌ No | Filter by exact tag |
| `type` | string | ❌ No | `startup` or `showcase` |
| `page` | integer | ❌ No | Page number (default: 1) |
| `limit` | integer | ❌ No | Results per page (default: 20) |

**Example:** `GET /search/projects?q=react+ai&type=startup&page=1`

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "project_id": 101,
        "title": "StudyBuddy App",
        "relevance_score": 0.89,
        "tags": ["React", "AI", "Education"],
        "type": "startup",
        "total_likes": 87,
        "user": { "username": "alex_chen" },
        "community": { "name": "Code & Create" }
      }
    ],
    "total": 12,
    "query": "react ai",
    "page": 1
  }
}
```

---

### EP-39 · `GET /search/users`
**Auth:** 🔓 Public  
**Description:** Search users by name or filter by skill. Powers the Directory page.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Search by username or bio |
| `skill` | string | Filter by skill tag (e.g., `?skill=React`) |
| `page` | integer | Page number |
| `limit` | integer | Results per page |

**Example:** `GET /search/users?skill=React&page=1`

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "user_id": 1,
        "username": "alex_chen",
        "bio": "Building cool stuff.",
        "skills": ["React", "Python", "UI/UX"],
        "plan_type": "free",
        "is_verified": false,
        "follower_count": 342,
        "project_count": 3
      }
    ],
    "total": 5,
    "page": 1
  }
}
```

---

### EP-40 · `GET /search/communities`
**Auth:** 🔓 Public  
**Description:** Search communities by name or description keyword.

**Query Parameters:** `?q=art` · `?page=1&limit=12`

**Success → `200 OK`:** Same structure as `GET /communities` (EP-26) filtered by search results.

---

## GROUP 10 — Notification Endpoints

---

### EP-41 · `GET /notifications`
**Auth:** 🔐 Protected  
**Description:** Get my notifications from MongoDB, sorted by newest first. Supports filtering by unread only.

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `unread_only` | boolean | `false` | If `true`, only return unread notifications |
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Results per page |

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": "507f1f77bcf86cd799439011",
        "type": "new_like",
        "read": false,
        "time_ago": "2 minutes ago",
        "created_at": "2026-03-09T15:30:00Z",
        "message": "mia_torres liked your project StudyBuddy App",
        "payload": {
          "actor_id": 2,
          "actor_username": "mia_torres",
          "project_id": 101,
          "project_title": "StudyBuddy App"
        }
      },
      {
        "notification_id": "507f191e810c19729de860ea",
        "type": "new_comment",
        "read": false,
        "time_ago": "15 minutes ago",
        "created_at": "2026-03-09T15:00:00Z",
        "message": "leo_park commented on your project StudyBuddy App",
        "payload": {
          "actor_username": "leo_park",
          "project_id": 101,
          "project_title": "StudyBuddy App",
          "comment_preview": "This looks really useful for students!"
        }
      },
      {
        "notification_id": "507f191e810c19729de860eb",
        "type": "new_follow",
        "read": true,
        "time_ago": "1 hour ago",
        "created_at": "2026-03-09T14:30:00Z",
        "message": "sara_nguyen started following you",
        "payload": {
          "actor_id": 4,
          "actor_username": "sara_nguyen"
        }
      }
    ],
    "unread_count": 3,
    "total": 12,
    "page": 1,
    "limit": 20
  }
}
```

**Notification Types Reference:**
| `type` | When it's created |
|---|---|
| `new_like` | Someone likes my project |
| `new_comment` | Someone comments on my project |
| `new_follow` | Someone follows me |
| `new_reply` | Someone replies to my comment |
| `challenge_result` | A challenge I entered has ended |
| `showcase_featured` | My project was selected as Showcase of the Week |

---

### EP-42 · `PATCH /notifications/:notificationId/read`
**Auth:** 🔐 Protected  
**Description:** Mark a single notification as read. Updates the `read` field to `true` in MongoDB.

**Request Body:** None

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "notification_id": "507f1f77bcf86cd799439011",
    "read": true
  }
}
```

---

### EP-43 · `PATCH /notifications/read-all`
**Auth:** 🔐 Protected  
**Description:** Mark ALL of my notifications as read at once. Used when the user clicks "Mark All Read."

**Request Body:** None

**Success → `200 OK`:**
```json
{
  "success": true,
  "message": "All 3 notifications marked as read.",
  "data": { "updated_count": 3 }
}
```

---

## GROUP 11 — Admin Endpoints

> These endpoints require the user's account to have `role = 'admin'` stored in the database. Regular users receive `403 Forbidden` even if they are logged in.

---

### EP-44 · `POST /admin/challenges`
**Auth:** 🛡️ Admin Only  
**Description:** Create a new weekly/monthly challenge inside a community.

**Request Body:**
```json
{
  "community_id": 1,
  "title": "60-Second Pitch Challenge",
  "description": "Record a 60-second pitch for your startup idea and post it as a project.",
  "prize": "Featured Spotlight + Premium for 1 month",
  "starts_at": "2026-03-10T00:00:00Z",
  "ends_at": "2026-03-17T23:59:59Z"
}
```

| Field | Required | Rule |
|---|---|---|
| `community_id` | ✅ Yes | Must be a valid community ID |
| `title` | ✅ Yes | Max 200 characters |
| `starts_at` | ✅ Yes | Must be a valid future timestamp |
| `ends_at` | ✅ Yes | Must be after `starts_at` |
| `description` | ❌ No | Challenge rules and prompt |
| `prize` | ❌ No | Max 200 characters |

**Success → `201 Created`:**
```json
{
  "success": true,
  "data": {
    "challenge_id": 4,
    "community_id": 1,
    "title": "60-Second Pitch Challenge",
    "prize": "Featured Spotlight + Premium for 1 month",
    "starts_at": "2026-03-10T00:00:00Z",
    "ends_at": "2026-03-17T23:59:59Z",
    "created_at": "2026-03-09T16:30:00Z"
  }
}
```

**Errors:**
| Status | Code | When |
|---|---|---|
| `403` | `NOT_ADMIN` | Logged-in user is not an admin |
| `404` | `COMMUNITY_NOT_FOUND` | `community_id` does not exist |
| `422` | `INVALID_DATE_RANGE` | `ends_at` is before `starts_at` |

---

### EP-45 · `PATCH /admin/projects/:projectId/feature`
**Auth:** 🛡️ Admin Only  
**Description:** Mark a project as "Showcase of the Week" (featured). It will appear at the top of the home feed with a highlight banner.

**Request Body:**
```json
{ "featured": true }
```

Set `"featured": false` to remove the featured status (returns the project to `published`).

**Success → `200 OK`:**
```json
{
  "success": true,
  "data": {
    "project_id": 103,
    "title": "LoFi Beat Pack Vol.2",
    "status": "featured"
  },
  "message": "Project 'LoFi Beat Pack Vol.2' is now the Showcase of the Week!"
}
```

---

## Error Code Master List

| Error Code | HTTP Status | Meaning |
|---|---|---|
| `MISSING_FIELD` | 400 | A required field is missing from the request body |
| `VALIDATION_ERROR` | 400 | Field value breaks a rule (too long, wrong format) |
| `EMPTY_COMMENT` | 400 | Comment body is blank |
| `INVALID_DATE_RANGE` | 422 | `ends_at` is before `starts_at` |
| `CHALLENGE_CLOSED` | 400 | Challenge deadline has passed |
| `PROJECT_NOT_PUBLISHED` | 403 | Tried to submit a draft to a challenge |
| `SELF_FOLLOW` | 400 | Tried to follow yourself |
| `INVALID_TOKEN` | 401 | JWT token is missing or corrupted |
| `TOKEN_EXPIRED` | 401 | JWT token is expired — log in again |
| `NOT_ADMIN` | 403 | Route requires admin privileges |
| `FORBIDDEN` | 403 | Action not allowed for this user |
| `NOT_PROJECT_OWNER` | 403 | Project does not belong to this user |
| `MEMBERSHIP_LIMIT` | 403 | Free user hit 3-community limit |
| `PROJECT_NOT_FOUND` | 404 | Project does not exist or is archived |
| `USER_NOT_FOUND` | 404 | User does not exist |
| `COMMUNITY_NOT_FOUND` | 404 | Community does not exist |
| `COMMENT_NOT_FOUND` | 404 | Comment does not exist |
| `PARENT_NOT_FOUND` | 404 | `parent_id` comment does not exist |
| `CHALLENGE_NOT_FOUND` | 404 | Challenge does not exist |
| `LIKE_NOT_FOUND` | 404 | Like record does not exist |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `DUPLICATE_USERNAME` | 409 | Username already taken |
| `DUPLICATE_LIKE` | 409 | Already liked this project |
| `DUPLICATE_MEMBERSHIP` | 409 | Already a member of this community |
| `DUPLICATE_FOLLOW` | 409 | Already following this user |
| `DUPLICATE_ENTRY` | 409 | Project already submitted to this challenge |
| `RATE_LIMITED` | 429 | Too many requests — slow down |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

*End of API Endpoint Reference*
*Total: **45 endpoints** across **11 groups***
*See `03_TECHNICAL_IMPLEMENTATION_GUIDE.md` for implementation details, architecture, and testing checklists.*
