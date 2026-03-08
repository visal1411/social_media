# HobbyHub — Database Normalization (3NF)

**Project:** HobbyHub Social Platform  
**Normalization Level:** Third Normal Form (3NF)  
**DBMS:** PostgreSQL  
**Date:** March 2026

---

## How Data is Organized (Normal Form Level 3)

All tables are organized correctly meaning:
- ✅ **Level 1:** All data is in simple columns
- ✅ **Level 2:** All columns are connected to the main ID
- ✅ **Level 3:** No unnecessary connections between non-ID columns

---

## Core Entity Tables

### 1. USERS TABLE
**What it stores:** User login, profile, and account info

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `user_id` | SERIAL | PRIMARY KEY | Unique ID for each user |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | For display and profiles |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | For login and emails |
| `password_hash` | VARCHAR(255) | NOT NULL | Super encrypted password |
| `bio` | TEXT | NULL | User's description |
| `avatar_url` | VARCHAR(500) | NULL | Profile picture |
| `plan_type` | VARCHAR(10) | DEFAULT 'free' | 'free' or 'premium' |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Premium badge |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation date |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last update date |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_username ON users(username);
```

**Sample Data:**
| user_id | username | email | plan_type | is_verified |
|---------|----------|-------|-----------|-------------|
| 1 | alex_chen | alex@college.edu | free | FALSE |
| 2 | mia_torres | mia@college.edu | premium | TRUE |
| 3 | leo_park | leo@college.edu | premium | TRUE |

---

### 2. COMMUNITIES TABLE
**What it stores:** Hobby groups like Art, Music, Code

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `community_id` | SERIAL | PRIMARY KEY | Unique ID |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Group name |
| `description` | TEXT | NULL | What the group is about |
| `icon` | VARCHAR(10) | NULL | Emoji like 🎨 |
| `color_hex` | CHAR(7) | NULL | Brand color |
| `created_by` | INT | FK → users | Who started it |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_communities_name ON communities(name);
CREATE INDEX idx_communities_created_by ON communities(created_by);
```

**Sample Data:**
| community_id | name | icon | color_hex | created_by |
|--------------|------|------|-----------|-----------|
| 1 | Code & Create | 💻 | #7c6df5 | 1 |
| 2 | Digital Art Studio | 🎨 | #ff6b6b | 2 |
| 3 | Music Producers | 🎧 | #4ecdc4 | 3 |

---

### 3. PROJECTS TABLE
**What it stores:** User posts and projects shared in communities

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `project_id` | SERIAL | PRIMARY KEY | Unique identifier |
| `user_id` | INT | NOT NULL, FK → users | Creator |
| `community_id` | INT | FK → communities | Posting community |
| `title` | VARCHAR(200) | NOT NULL | Project name (max 200 chars) |
| `description` | TEXT | NOT NULL | Full project details (max 2000 chars) |
| `tags` | TEXT[] | NULL | PostgreSQL array: {'React','AI','MVP'} |
| `image_url` | VARCHAR(500) | NULL | CDN URL to featured image |
| `type` | VARCHAR(20) | DEFAULT 'showcase' | CHECK('showcase'\|'startup') |
| `status` | VARCHAR(20) | DEFAULT 'draft' | CHECK('draft'\|'published'\|'featured'\|'archived') |
| `looking_for` | VARCHAR(200) | NULL | e.g., "UI/UX Designer, Backend Dev" |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Post creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last edit time |

**Indexes:**
```sql
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_community_id ON projects(community_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
```

**Sample Data:**
| project_id | user_id | community_id | title | type | status |
|------------|---------|--------------|-------|------|--------|
| 101 | 1 | 1 | StudyBuddy App | startup | published |
| 102 | 2 | 2 | Campus Illustrations | showcase | featured |
| 103 | 3 | 3 | LoFi Beat Pack Vol.2 | showcase | published |

---

## Relationship/Junction Tables

### 4. MEMBERSHIPS TABLE (Who joined which communities)
**What it does:** Tracks which users are members of which communities

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `membership_id` | SERIAL | PRIMARY KEY | Join record ID |
| `user_id` | INT | NOT NULL, FK → users | User joining |
| `community_id` | INT | NOT NULL, FK → communities | Community joined |
| `joined_at` | TIMESTAMP | DEFAULT NOW() | Join timestamp |
| | | UNIQUE(user_id, community_id) | Prevent duplicate memberships |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_memberships_user_community 
  ON memberships(user_id, community_id);
CREATE INDEX idx_memberships_community ON memberships(community_id);
CREATE INDEX idx_memberships_user ON memberships(user_id);
```

**Sample Data:**
| membership_id | user_id | community_id | joined_at |
|---------------|---------|--------------|-----------|
| 501 | 1 | 1 | 2025-03-01 |
| 502 | 1 | 2 | 2025-03-02 |
| 503 | 2 | 1 | 2025-03-01 |

---

### 5. FOLLOWS TABLE (Who follows who)
**What it does:** Tracks who follows who (for finding teammates)

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `follow_id` | SERIAL | PRIMARY KEY | Relationship ID |
| `follower_id` | INT | NOT NULL, FK → users | User doing the following |
| `followee_id` | INT | NOT NULL, FK → users | User being followed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Follow timestamp |
| | | UNIQUE(follower_id, followee_id) | Prevent duplicate follows |
| | | CHECK(follower_id ≠ followee_id) | Can't follow self |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_follows_follower_followee 
  ON follows(follower_id, followee_id);
CREATE INDEX idx_follows_followee ON follows(followee_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
```

**Sample Data:**
| follow_id | follower_id | followee_id | created_at |
|-----------|-------------|-------------|-----------|
| 601 | 1 | 2 | 2025-03-05 |
| 602 | 1 | 3 | 2025-03-06 |
| 603 | 2 | 3 | 2025-03-04 |

---

### 6. LIKES TABLE (Who liked what)
**What it does:** Tracks who liked which projects and prevents double-likes

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `like_id` | SERIAL | PRIMARY KEY | Like record ID |
| `user_id` | INT | NOT NULL, FK → users | User who liked |
| `project_id` | INT | NOT NULL, FK → projects | Project being liked |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Like timestamp |
| | | UNIQUE(user_id, project_id) | One like per user per project |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_likes_user_project 
  ON likes(user_id, project_id);
CREATE INDEX idx_likes_project ON likes(project_id);
CREATE INDEX idx_likes_user ON likes(user_id);
```

**Sample Data:**
| like_id | user_id | project_id | created_at |
|---------|---------|-----------|-----------|
| 701 | 1 | 102 | 2025-03-04 |
| 702 | 2 | 101 | 2025-03-05 |
| 703 | 3 | 101 | 2025-03-06 |

---

## Engagement Tables

### 7. COMMENTS TABLE
**What it does:** Stores comments and replies on projects

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `comment_id` | SERIAL | PRIMARY KEY | Comment ID |
| `project_id` | INT | NOT NULL, FK → projects | Project being commented on |
| `user_id` | INT | NOT NULL, FK → users | Comment author |
| `body` | TEXT | NOT NULL | Comment text (max 2000 chars) |
| `parent_id` | INT | FK → comments | None = reply to project, Set = reply to another comment |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Comment creation |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Last edit timestamp |
| `is_deleted` | BOOLEAN | DEFAULT FALSE | Soft delete flag |

**Indexes:**
```sql
CREATE INDEX idx_comments_project ON comments(project_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
```

**Sample Data:**
| comment_id | project_id | user_id | body | parent_id |
|------------|-----------|---------|------|-----------|
| 1001 | 101 | 2 | "This looks amazing! I'd love to help with UI/UX" | NULL |
| 1002 | 101 | 1 | "@mia great! Let's connect" | 1001 |

---

### 8. CHALLENGES TABLE
**What it does:** Stores weekly and monthly challenge contests

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `challenge_id` | SERIAL | PRIMARY KEY | Challenge ID |
| `community_id` | INT | FK → communities | Challenge theme |
| `title` | VARCHAR(200) | NOT NULL | Challenge name |
| `description` | TEXT | NULL | Challenge rules & prompts |
| `prize` | VARCHAR(100) | NULL | Prize description |
| `starts_at` | TIMESTAMP | NOT NULL | Challenge opens |
| `ends_at` | TIMESTAMP | NOT NULL | Challenge deadline |
| `created_by` | INT | FK → users | Challenge creator |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

**Indexes:**
```sql
CREATE INDEX idx_challenges_community ON challenges(community_id);
CREATE INDEX idx_challenges_ends_at ON challenges(ends_at);
```

**Sample Data:**
| challenge_id | community_id | title | starts_at | ends_at |
|--------------|--------------|-------|-----------|---------|
| 801 | 1 | Build a Mini App in 48hrs | 2025-03-08 | 2025-03-10 |
| 802 | 2 | Digital Art Speed Painting | 2025-03-08 | 2025-03-15 |

---

### 9. CHALLENGE_ENTRIES TABLE (Which projects entered which challenge)
**What it does:** Links projects as submissions to challenges

| Column | Type | Constraint | Notes |
|--------|------|-----------|-------|
| `entry_id` | SERIAL | PRIMARY KEY | Entry record ID |
| `challenge_id` | INT | NOT NULL, FK → challenges | Challenge entered |
| `project_id` | INT | NOT NULL, FK → projects | Project submission |
| `submitted_at` | TIMESTAMP | DEFAULT NOW() | Submission time |
| | | UNIQUE(challenge_id, project_id) | Prevent duplicate submissions |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_challenge_entries_challenge_project 
  ON challenge_entries(challenge_id, project_id);
CREATE INDEX idx_challenge_entries_challenge ON challenge_entries(challenge_id);
```

**Sample Data:**
| entry_id | challenge_id | project_id | submitted_at |
|----------|--------------|-----------|-------------|
| 901 | 801 | 101 | 2025-03-08 10:30 |
| 902 | 801 | 103 | 2025-03-09 14:15 |

---

## Event Storage (MongoDB - for notifications)

### 10. NOTIFICATIONS (Event log)
**What it does:** Stores events like "someone liked your project" (fast and simple)

```json
{
  userId: 1,
  type: "like" | "comment" | "follow" | "challenge_featured",
  from_user: 2,
  project_id: 101,
  message: "Mia Torres liked your project StudyBuddy App",
  read: false,
  created: "2025-03-06T10:30:00Z",
  expires: "2025-06-04T10:30:00Z"  // Auto delete after 90 days
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ userId: 1, createdAt: -1 });
db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
```

---

## How All Tables Connect (Visual)

```
                            ┌─────────────────┐
                            │     USERS       │
                            │ (Core Entity)   │
                            └────────┬────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        │ 1:N (posts)                │ 1:N (creates)              │
        │                            │                            │
    ┌───┴──────────┐  ┌──────────────┴─────────┐  ┌───────────────┴──────┐
    │  PROJECTS    │  │  COMMUNITIES (1:N creates) │  CHALLENGES    │
    └───┬──────────┘  └──────────────┬──────────┘  └───────────────┬──────┘
        │                    ▲                                    │
        │                    │                                    │
        │ M:N (via           │ M:N (via                           │ 1:N
        │ COMMENTS)          │ MEMBERSHIPS)    ┌──────────────────┘
        │                    │                │
        ├─ 1:N               └─────────────────┤
        │ has                                  │ has
        ├─── COMMENTS (1:1 to user via FK)    │
        │                                     │
        ├─── LIKES (M:N via LIKES table)      │
        │                                     │
        ├─── CHALLENGE_ENTRIES ──────────────┘
        │    (M:N via table)
        │
        └─── Aggregates:
             - Like count
             - Comment count
             - Challenge ranking


        Self-Referencing:
        ┌────────────────────┐
        │      USERS         │
        ├────────────────────┤
        │ ↓ (FOLLOWS table)  │ ← M:N self-join
        │ ↑ (follower_id,    │
        │   followee_id)     │
        └────────────────────┘
```

---

## Query Examples Demonstrating Normalized Design

### Find All Projects Posted by Alex Chen
```sql
SELECT p.project_id, p.title, p.status, COUNT(l.like_id) as like_count
FROM projects p
LEFT JOIN users u ON p.user_id = u.user_id
LEFT JOIN likes l ON p.project_id = l.project_id
WHERE u.username = 'alex_chen'
GROUP BY p.project_id
ORDER BY p.created_at DESC;
```

### Find All Communities Alex Chen Has Joined
```sql
SELECT c.community_id, c.name, COUNT(m.membership_id) as member_count
FROM communities c
INNER JOIN memberships m ON c.community_id = m.community_id
INNER JOIN users u ON m.user_id = u.user_id
WHERE u.username = 'alex_chen';
```

### Find All Comments on a Specific Project (Threaded)
```sql
SELECT c.comment_id, c.body, u.username, c.parent_id, c.created_at
FROM comments c
INNER JOIN users u ON c.user_id = u.user_id
WHERE c.project_id = 101
ORDER BY COALESCE(c.parent_id, c.comment_id), c.created_at;
```

### Find Who Alex Chen Is Following (Collaborator Discovery)
```sql
SELECT u.user_id, u.username, u.bio, COUNT(p.project_id) as project_count
FROM follows f
INNER JOIN users u ON f.followee_id = u.user_id
LEFT JOIN projects p ON u.user_id = p.user_id
WHERE f.follower_id = (SELECT user_id FROM users WHERE username = 'alex_chen')
GROUP BY u.user_id
ORDER BY project_count DESC;
```

### Leaderboard for Active Challenge
```sql
SELECT p.project_id, p.title, u.username, COUNT(l.like_id) as likes
FROM challenge_entries ce
INNER JOIN projects p ON ce.project_id = p.project_id
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN likes l ON p.project_id = l.project_id
WHERE ce.challenge_id = 801
GROUP BY p.project_id, p.title, u.username
ORDER BY likes DESC
LIMIT 3;
```

---

## Rules to Keep Data Safe

| Rule | What It Does | Type |
|------|-----------|------|
| UNIQUE(username, email) | No duplicate accounts | Basic rule |
| UNIQUE(user_id, community_id) | User can only join community once | Basic rule |
| UNIQUE(user_id, project_id) | User can only like same project once | Basic rule |
| CHECK(follower_id ≠ followee_id) | Can't follow yourself | Basic rule |
| UNIQUE(challenge_id, project_id) | Can't submit same project twice | Basic rule |
| Delete user = delete projects | User data cleanup | Auto rule |
| Delete user = keep community | Community stays when member leaves | Auto rule |

---

## How We Speed Up the Database

1. **Tags as lists:** Storing tags together is faster than separate table
2. **Quick tag search:** Special tool for searching tags without checking every row
3. **Sort by date:** Index for quick showing newest posts first
4. **Multi-column speed lookup:** Combined email + username lookup is fast
5. **Mark deleted:** Comments marked "deleted" instead of removed (can be restored)

---

**End of Normalization Document**
