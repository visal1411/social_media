# HobbyHub — Database Design Document

**Project:** HobbyHub Social Platform for Hobby & Project Sharing  
**Classes:** FESE304 (Database Management System) | FESE305 (Software App Dev Studio)  
**Database:** PostgreSQL (Relational) + MongoDB (Document Store) + Redis (Cache)  
**Date:** March 2025

---

## 1. How Tables Connect Together

### 1.1 Table Relationship Diagram

```
                          ┌──────────────┐
                          │    USERS     │
                          ├──────────────┤
                          │ user_id (PK) │
                          │ username     │
                          │ email        │
                          │ password_hash│
                          │ bio          │
                          │ avatar_url   │
                          │ plan_type    │
                          │ is_verified  │
                          │ created_at   │
                          │ updated_at   │
                          └──────┬───────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          │ (1:N) posts          │ (N:N) follows       │ (M:N) joins
          │                      │ (self-ref)          │
          ▼                      │                      ▼
    ┌──────────────┐      ┌─────────────┐      ┌─────────────────┐
    │  PROJECTS    │      │  FOLLOWS    │      │  MEMBERSHIPS    │
    ├──────────────┤      ├─────────────┤      ├─────────────────┤
    │ project_id   │      │ follower_id │      │ membership_id   │
    │ user_id (FK) │      │ followee_id │      │ user_id (FK)    │
    │ community_id │      │ created_at  │      │ community_id(FK)│
    │ title        │      └─────────────┘      │ joined_at       │
    │ description  │                          └─────────────────┘
    │ tags         │                                  ▲
    │ image_url    │                                  │
    │ type         │                                  │ (N:1) joins
    │ status       │                                  │
    │ looking_for  │         ┌──────────────────────┘
    │ created_at   │         │
    │ updated_at   │         │
    └──────┬───────┘         │
           │                 │
      (1:N)│                 │
      has  │ (M:N)           │
           │ receive    ┌────────────────┐
           │            │  COMMUNITIES   │
           │            ├────────────────┤
           │            │ community_id   │
           │            │ name           │
           │            │ description    │
           │            │ icon           │
           │            │ color_hex      │
           │            │ created_by(FK) │
           │            │ created_at     │
           │            └─────┬──────────┘
           │                  │
           │ (1:N) contains   │
           │                 │
    ┌──────────────────────────────┐
    │                              │
    ▼                              ▼
┌──────────────┐        ┌──────────────────┐
│   LIKES      │        │   CHALLENGES     │
├──────────────┤        ├──────────────────┤
│ like_id (PK) │        │ challenge_id(PK) │
│ user_id (FK) │        │ community_id(FK) │
│ project_id(FK)        │ title            │
│ created_at   │        │ description      │
└──────────────┘        │ prize            │
                        │ starts_at        │
                        │ ends_at          │
    ┌───────────────────┤ created_by (FK) │
    │ (M:N)             └──────────────────┘
    │ comments                   │
    │                           │
    ▼                    (1:N) has entries
┌──────────────┐                │
│  COMMENTS    │                ▼
├──────────────┤        ┌──────────────────┐
│ comment_id   │        │CHALLENGE_ENTRIES │
│ project_id   │        ├──────────────────┤
│ user_id (FK) │        │ entry_id (PK)    │
│ body         │        │ challenge_id(FK) │
│ parent_id    │        │ project_id (FK)  │
│ created_at   │        │ submitted_at     │
└──────────────┘        └──────────────────┘
```

### 1.2 How Tables Are Connected

| Tables | Connection Type | What It Means |
|---|---|---|
| USER → PROJECT | 1:N | User posts many projects |
| USER ↔ COMMUNITY | M:N (via MEMBERSHIP) | User joins communities, community has many users |
| PROJECT → COMMUNITY | N:1 | Project belongs to one community |
| PROJECT → LIKES | 1:N | Project receives many likes from different users |
| PROJECT → COMMENTS | 1:N | Project has many comments |
| USER → LIKES/COMMENTS | 1:N | User creates many likes and comments |
| USER ↔ USER | M:N (via FOLLOWS) | Users follow other users (self-referencing) |
| CHALLENGE → CHALLENGE_ENTRY | 1:N | Challenge has many entries |
| CHALLENGE_ENTRY → PROJECT | N:1 | Challenge entry links to one project |

---

## 2. What Each Table Looks Like

### 2.1 USERS Table (Stores user accounts)

```sql
CREATE TABLE users (
  user_id         SERIAL PRIMARY KEY,
  username        VARCHAR(50) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  bio             TEXT,
  avatar_url      VARCHAR(500),
  plan_type       VARCHAR(10) DEFAULT 'free' 
                  CHECK (plan_type IN ('free', 'premium')),
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Speed up finding users by email and username
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

**What it does:** Stores user login info, profile, and account type
**Rules:** Each email and username can only be used once

---

### 2.2 COMMUNITIES Table

```sql
CREATE TABLE communities (
  community_id    SERIAL PRIMARY KEY,
  name            VARCHAR(100) UNIQUE NOT NULL,
  description     TEXT,
  icon            VARCHAR(10),
  color_hex       CHAR(7),  -- e.g., #7c6df5
  created_by      INT REFERENCES users(user_id) ON DELETE SET NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Speed up finding communities by name
CREATE INDEX idx_communities_name ON communities(name);
```

**What it does:** Stores hobby groups like "Code & Create" or "Art Studio"
**Note:** `icon` is the emoji (🎨), `color_hex` is the brand color

---

### 2.3 PROJECTS Table (Stores user posts/projects)

```sql
CREATE TABLE projects (
  project_id      SERIAL PRIMARY KEY,
  user_id         INT NOT NULL REFERENCES users(user_id),
  community_id    INT REFERENCES communities(community_id) 
                  ON DELETE SET NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT NOT NULL,
  tags            TEXT[],  -- Array of tags: {'React', 'AI', 'MVP'}
  image_url       VARCHAR(500),
  type            VARCHAR(20) DEFAULT 'showcase' 
                  CHECK (type IN ('showcase', 'startup')),
  status          VARCHAR(20) DEFAULT 'draft' 
                  CHECK (status IN ('draft', 'published', 'featured', 'archived')),
  looking_for     VARCHAR(200),  -- e.g., "UI/UX Designer"
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- Speed up searches for projects
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_community_id ON projects(community_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(type);
CREATE INDEX idx_projects_created_at ON projects(created_at);
```

**What it does:** Stores all the posts/projects users share
**Important:**
- `tags` is stored as a list for quick searching
- `status` shows the state: draft → published → featured or archived
- `type` shows if it's a portfolio piece or startup idea

---

### 2.4 MEMBERSHIPS Table (Who joined which community)

```sql
CREATE TABLE memberships (
  membership_id   SERIAL PRIMARY KEY,
  user_id         INT NOT NULL REFERENCES users(user_id) 
                  ON DELETE CASCADE,
  community_id    INT NOT NULL REFERENCES communities(community_id) 
                  ON DELETE CASCADE,
  joined_at       TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, community_id)  -- Prevents duplicate memberships
);

-- Indexes for queries
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_community_id ON memberships(community_id);
```

**What it does:** Tracks which users are members of which communities
**Rule:** Can't join the same community twice

---

### 2.5 LIKES Table (Who liked what)

```sql
CREATE TABLE likes (
  like_id         SERIAL PRIMARY KEY,
  user_id         INT NOT NULL REFERENCES users(user_id) 
                  ON DELETE CASCADE,
  project_id      INT NOT NULL REFERENCES projects(project_id) 
                  ON DELETE CASCADE,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id)  -- One like per user per project
);

-- Indexes for counting likes fast
CREATE INDEX idx_likes_project_id ON likes(project_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
```

**What it does:** Tracks who liked which projects
**Rule:** Each user can only like the same project once

---

### 2.6 COMMENTS Table (Comments with replies)

```sql
CREATE TABLE comments (
  comment_id      SERIAL PRIMARY KEY,
  project_id      INT NOT NULL REFERENCES projects(project_id) 
                  ON DELETE CASCADE,
  user_id         INT NOT NULL REFERENCES users(user_id) 
                  ON DELETE CASCADE,
  body            TEXT NOT NULL,
  parent_id       INT REFERENCES comments(comment_id) 
                  ON DELETE CASCADE,  -- For threaded replies
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Speed up finding comments on projects
CREATE INDEX idx_comments_project_id ON comments(project_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
```

**What it does:** Stores comments and replies on projects
**Special:** `parent_id` lets people reply to other comments

---

### 2.7 FOLLOWS Table (Who follows who)

```sql
CREATE TABLE follows (
  follow_id       SERIAL PRIMARY KEY,
  follower_id     INT NOT NULL REFERENCES users(user_id) 
                  ON DELETE CASCADE,
  followee_id     INT NOT NULL REFERENCES users(user_id) 
                  ON DELETE CASCADE,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, followee_id),  -- One follow per pair
  CHECK (follower_id != followee_id)  -- Can't follow yourself
);

-- Speed up finding followers
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followee_id ON follows(followee_id);
```

**What it does:** Tracks who follows who (for finding teammates)
**Rules:**
- Can't follow the same person twice
- Can't follow yourself

---

### 2.8 CHALLENGES Table

```sql
CREATE TABLE challenges (
  challenge_id    SERIAL PRIMARY KEY,
  community_id    INT NOT NULL REFERENCES communities(community_id) 
                  ON DELETE CASCADE,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  prize           VARCHAR(200),
  starts_at       TIMESTAMP NOT NULL,
  ends_at         TIMESTAMP NOT NULL,
  created_by      INT REFERENCES users(user_id),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Find active challenges
CREATE INDEX idx_challenges_ends_at ON challenges(ends_at);
```

**What it does:** Stores weekly challenges in communities
**Note:** You can find active challenges by checking which `ends_at` date is in the future

---

### 2.9 CHALLENGE_ENTRIES Table (Which projects entered which challenge)

```sql
CREATE TABLE challenge_entries (
  entry_id        SERIAL PRIMARY KEY,
  challenge_id    INT NOT NULL REFERENCES challenges(challenge_id) 
                  ON DELETE CASCADE,
  project_id      INT NOT NULL REFERENCES projects(project_id) 
                  ON DELETE CASCADE,
  submitted_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE(challenge_id, project_id)  -- Prevent duplicate submissions
);

-- Speed up finding challenge entries
CREATE INDEX idx_challenge_entries_challenge_id 
  ON challenge_entries(challenge_id);
CREATE INDEX idx_challenge_entries_project_id 
  ON challenge_entries(project_id);
```

**What it does:** Links projects as submissions to challenges
**Rule:** Can't submit the same project to the same challenge twice

---

## 3. Normalization Analysis

### 3.1 Normal Form Compliance

| Normal Form | Rule | HobbyHub Compliance |
|---|---|---|
| **1NF** | No repeating groups; all attributes atomic | ✅ All columns hold single values. `tags` uses PostgreSQL TEXT[] — a deliberate denormalization for performance |
| **2NF** | No partial dependencies on composite keys | ✅ All tables use single-column surrogate PK (SERIAL). No composite PKs |
| **3NF** | No transitive dependencies | ✅ Each non-key attribute depends only on PK (e.g., community name stored only in communities table, not duplicated in projects) |

### 3.2 Intentional Denormalization

**Why denormalize `tags`?**

❌ **Fully Normalized (BAD for performance):**
```sql
CREATE TABLE project_tags (
  project_id INT REFERENCES projects(project_id),
  tag VARCHAR(50),
  PRIMARY KEY (project_id, tag)
);
-- Every project load requires: SELECT * FROM projects 
--   LEFT JOIN project_tags ...  (extra I/O)
```

✅ **Denormalized in HobbyHub (GOOD for performance):**
```sql
-- projects.tags TEXT[] = {'React', 'AI', 'Education'}
-- Single query, no JOIN needed!
SELECT * FROM projects WHERE project_id = 5;
```

**Trade-off:** Slightly higher INSERT complexity (need to update array), but massive win on SELECT speed (projects are read 100× more than written).

---

## 4. Key Database Implementation Queries

### 4.1 Feed Query: Top Projects with Stats (JOIN + GROUP BY)

**Business Logic:** Fetch top 20 most-liked projects for home feed

```sql
SELECT 
  p.project_id,
  p.title,
  p.description,
  p.tags,
  p.type,
  p.looking_for,
  p.created_at,
  u.user_id,
  u.username,
  u.avatar_url,
  u.is_verified,
  u.plan_type,
  c.community_id,
  c.name AS community_name,
  c.icon AS community_icon,
  COUNT(DISTINCT l.like_id) AS total_likes,
  COUNT(DISTINCT cm.comment_id) AS total_comments
FROM projects p
INNER JOIN users u ON p.user_id = u.user_id
INNER JOIN communities c ON p.community_id = c.community_id
LEFT JOIN likes l ON p.project_id = l.project_id
LEFT JOIN comments cm ON p.project_id = cm.project_id
WHERE p.status = 'published'
GROUP BY p.project_id, u.user_id, c.community_id
ORDER BY total_likes DESC, p.created_at DESC
LIMIT 20;
```

**Why this query matters:**
- **INNER JOIN** on users & communities ensures project has valid creator and community
- **LEFT JOIN** on likes & comments counts them even if zero exist
- **GROUP BY** aggregates likes and comments per project
- **ORDER BY total_likes DESC** shows most popular first
- Runs on every home page load (needs indexing!)

**Performance Optimization:** Cache this result in Redis with 2-minute TTL

---

### 4.2 Find Suggested Collaborators (Subquery + NOT IN)

**Business Logic:** Find users in MY communities who I'm NOT already following

```sql
SELECT 
  u.user_id,
  u.username,
  u.avatar_url,
  u.bio,
  u.plan_type,
  ARRAY_AGG(DISTINCT c.name) AS shared_communities,
  COUNT(DISTINCT m.community_id) AS community_count
FROM users u
INNER JOIN memberships m ON u.user_id = m.user_id
INNER JOIN communities c ON m.community_id = c.community_id
WHERE m.community_id IN (
  -- Communities current user has joined
  SELECT community_id 
  FROM memberships 
  WHERE user_id = $1  -- Current user ID
)
AND u.user_id NOT IN (
  -- Users current user already follows
  SELECT followee_id 
  FROM follows 
  WHERE follower_id = $1
)
AND u.user_id != $1  -- Exclude current user
GROUP BY u.user_id
ORDER BY community_count DESC  -- Most communities in common first
LIMIT 10;
```

**Why this works:**
- **WHERE ... IN (subquery)** filters communities current user joined
- **NOT IN (subquery)** excludes already-followed users
- **GROUP BY** + **ARRAY_AGG** collects all shared communities
- **ORDER BY community_count DESC** ranks by most relevant first

---

### 4.3 Challenge Leaderboard (Window Function RANK)

**Business Logic:** Rank challenge entries by like count (for leaderboard page)

```sql
SELECT 
  ce.entry_id,
  p.project_id,
  p.title AS project_title,
  u.user_id,
  u.username,
  u.avatar_url,
  COUNT(l.like_id) AS vote_count,
  RANK() OVER (
    ORDER BY COUNT(l.like_id) DESC
  ) AS leaderboard_rank,
  DENSE_RANK() OVER (
    ORDER BY COUNT(l.like_id) DESC
  ) AS dense_rank
FROM challenge_entries ce
INNER JOIN projects p ON ce.project_id = p.project_id
INNER JOIN users u ON p.user_id = u.user_id
LEFT JOIN likes l ON p.project_id = l.project_id
WHERE ce.challenge_id = $1  -- Specific challenge ID
GROUP BY ce.entry_id, p.project_id, u.user_id
ORDER BY leaderboard_rank;
```

**Why window functions?**
- **RANK() OVER (ORDER BY vote_count DESC)** assigns rank without collapsing rows
- Allows showing "You are ranked #1 out of 67" without another query
- **DENSE_RANK** handles ties differently (both count for #1, next is #2)

---

### 4.4 Unified Feed (UNION of Two Sources)

**Business Logic:** Combine projects from (1) my communities AND (2) users I follow

```sql
-- Projects from communities I've joined
SELECT 
  p.project_id,
  p.title,
  'community_feed' AS source,
  p.created_at
FROM projects p
INNER JOIN memberships m ON p.community_id = m.community_id
WHERE m.user_id = $1  -- Current user
AND p.status = 'published'

UNION

-- Projects from users I follow
SELECT 
  p.project_id,
  p.title,
  'following_feed' AS source,
  p.created_at
FROM projects p
INNER JOIN follows f ON p.user_id = f.followee_id
WHERE f.follower_id = $1  -- Current user
AND p.status = 'published'

ORDER BY created_at DESC
LIMIT 40;
```

**Why UNION?**
- **UNION** automatically removes duplicates (project appears in both community and following?)
- **UNION ALL** would keep duplicates (faster but incorrect)
- `source` column helps UI distinguish where each project came from

---

## 5. NoSQL Strategy (MongoDB + Redis)

### 5.1 MongoDB — Flexible Document Store

**Used for:** Notifications, media metadata, activity logs

#### Example Notification Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "user_id": 42,
  "type": "new_like",
  "read": false,
  "created_at": ISODate("2025-03-08T10:30:00Z"),
  "payload": {
    "actor_id": 15,
    "actor_username": "mia_torres",
    "actor_avatar": "https://cdn.hobbyhub.com/avatars/mia.jpg",
    "project_id": 7,
    "project_title": "StudyBuddy App",
    "project_image": "https://cdn.hobbyhub.com/projects/studybuddy.png"
  }
}
```

**Why MongoDB?**
- Different notification types have different payloads (like, comment, follow, challenge result)
- Relational DB would need NULLs or separate tables
- Document store = schema-flexible, fast writes, natural JSON to frontend

#### MongoDB Indexes
```javascript
// Index notifications for fast user lookups + sorting
db.notifications.createIndex({ user_id: 1, created_at: -1 });
db.notifications.createIndex({ user_id: 1, read: 1 });
```

---

### 5.2 Redis — In-Memory Cache

**Used for:** Feed caching, session tokens, rate limiting

| Use Case | Key Pattern | TTL | Rationale |
|---|---|---|---|
| User Feed Cache | `feed:user:{user_id}` | 2 min | Feed changes often, but 2 min freshness acceptable |
| Session Token | `session:{user_id}` | 7 days | JWT expires in 7 days; Redis backup |
| Community Member Count | `community:count:{id}` | 10 min | Slow to query, safe to cache 10 min |
| User Profile Cache | `user:profile:{user_id}` | 5 min | Frequently accessed, low change rate |
| Challenge Leaderboard | `challenge:board:{id}` | 30 sec | Updated frequently with new likes |
| Rate Limiting | `ratelimit:{user}:{endpoint}` | 60 sec | Sliding window counter per endpoint |

**Example Feed Cache (Redis stored as JSON):**
```json
KEY: feed:user:1
VALUE: [
  {
    "project_id": 7,
    "title": "StudyBuddy App",
    "user": { "username": "alex_chen", "avatar": "..." },
    "stats": { "likes": 87, "comments": 14 }
  },
  ...more projects...
]
```

---

## 6. Performance Optimization Strategy

### 6.1 Indexing Plan

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users USING GIN (to_tsvector('english', username));

-- Projects (most critical)
CREATE INDEX idx_projects_status ON projects(status) WHERE status = 'published';
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_community_id ON projects(community_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Likes and Comments (high cardinality)
CREATE INDEX idx_likes_project_id ON likes(project_id);
CREATE INDEX idx_likes_user_project ON likes(user_id, project_id) UNIQUE;
CREATE INDEX idx_comments_project ON comments(project_id);

-- Memberships
CREATE INDEX idx_memberships_user_community ON memberships(user_id, community_id) UNIQUE;

-- Follows
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followee ON follows(followee_id);
```

### 6.2 Query Optimization Strategy

| Technique | What | When |
|---|---|---|
| **Connection Pooling** | PgBouncer with max 100 connections | Prevents DB overwhelm during traffic spikes |
| **Cursor-Based Pagination** | Use created_at timestamp for pagination | Avoids OFFSET slowness at large page numbers |
| **EXPLAIN ANALYZE** | Analyze query plans before production | Ensure Index Scans, not Seq Scans on large tables |
| **Read Replicas** | PostgreSQL replication for SELECT queries | Feed queries → replica; writes → primary |
| **Full-Text Search** | PostgreSQL pg_trgm + GIN indexes | Fuzzy search on project titles, usernames |

### 6.3 Example Query Optimization

❌ **BAD (O(n) scan):**
```sql
SELECT * FROM projects 
WHERE title LIKE '%react%'  -- Linear search on all rows
LIMIT 20;
```

✅ **GOOD (O(log n) with index):**
```sql
CREATE INDEX idx_projects_title_search 
  ON projects USING gin (to_tsvector('english', title));

SELECT * FROM projects 
WHERE to_tsvector('english', title) @@ plainto_tsquery('react')
LIMIT 20;
```

**Result:** Sub-10ms vs 500ms+ on large datasets

---

## 7. Data Relationships Flowchart

### 7.1 Create Project Flow (Data Movement)

```
User Submits Form
      │
      ▼
┌──────────────────────┐
│ Form Validation      │
│ - Title not empty    │
│ - Desc not empty     │
│ - Tags max 5         │
└──────────┬───────────┘
           │ ✅ Valid
           ▼
┌──────────────────────┐
│ PostgreSQL INSERT    │
│ INSERT projects(     │
│   user_id,           │
│   community_id,      │
│   title, desc, ...   │
│ )                    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Return project_id    │
│ with 201 Created     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Redis: Invalidate    │
│ feed:user:{user}     │
│ (clear cache)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ MongoDB: Log event   │
│ type: 'new_project'  │
│ actor: user_id       │
└──────────┬───────────┘
           │
           ▼
React App Updates Feed
```

### 7.2 Like Project Flow

```
User Clicks Like Button
        │
        ▼
   Check: Already liked?
   └─ Query: SELECT * FROM likes WHERE user_id=X AND project_id=Y
        │
    ┌───┴───┐
    │       │
   No      Yes (toggle = unlike)
    │       │
    ▼       ▼
INSERT     DELETE
├─ INSERT INTO likes       ├─ DELETE FROM likes
│  VALUES (user, project)  │  WHERE user_id=X AND project_id=Y
└─ Get like_count          │
   ├─ COUNT(*) fast        └─ Get updated like_count
   │  because of index     │
   └─ Update Redis cache   └─ Update Redis cache
      feed:user:{user}        feed:user:{user}

Later: Home Feed Query
└─ Reads from Redis (cached)
   └─ Shows updated like count
```

---

## 8. Database Scaling Plan

### 8.1 Vertical Scaling (Before Horizontal)

| Stage | DB Size | Recommended Action |
|---|---|---|
| **MVP (0-10K users)** | < 5GB | Single PostgreSQL instance (AWS RDS db.t3.medium) |
| **Growth (10K-100K)** | 5-50GB | Upgrade to db.r5.large (more RAM for caching) |
| **Scale (100K+)** | 50GB+ | Add read replica for read-heavy queries |

### 8.2 Read Replica Architecture (100K+ users)

```
                    Primary PostgreSQL
                    (Writes only)
                          │
                          │ Replication
                    ┌─────┴─────┐
                    ▼           ▼
            Read Replica 1   Read Replica 2
            (Feed queries) (Search queries)
                    │           │
                    └─────┬─────┘
                          │
                    Application
                    (Route reads
                    to replicas)
```

---

## 9. Security & Compliance

### 9.1 Password Security

```sql
-- Hashing with bcrypt (cost 12)
UPDATE users 
SET password_hash = bcrypt(password, cost=12)
WHERE user_id = $1;

-- Never store plain passwords!
-- bcrypt automatically salts
```

**Why bcrypt?**
- Slow hash (prevents brute force)
- Automatic salt (each password unique even if same plaintext)
- Cost factor 12 = ~250ms per hash (acceptable for login, too slow for brute force)

### 9.2 Data Privacy (GDPR Right to Deletion)

```sql
-- User requests account deletion
BEGIN TRANSACTION;

-- Anonymize user record
UPDATE users 
SET username = 'user_' || user_id,
    email = 'deleted_' || user_id,
    password_hash = NULL,
    bio = NULL,
    avatar_url = NULL
WHERE user_id = $1;

-- Keep projects (as anon), but delete personal data
UPDATE users 
SET updated_at = NOW()
WHERE user_id = $1;

-- Log deletion event
INSERT INTO audit_log (user_id, action, created_at)
VALUES ($1, 'account_deletion', NOW());

COMMIT;
```

---

## 10. Testing Strategy for Database

### 10.1 Unit Tests (pgTAP - PostgreSQL Test Protocol)

```sql
-- Test: UNIQUE constraint on likes
BEGIN;
INSERT INTO likes (user_id, project_id) VALUES (1, 5);
INSERT INTO likes (user_id, project_id) VALUES (1, 5);  -- Should error!
-- Test passes if 2nd INSERT rejected

-- Test: Foreign key constraint
INSERT INTO projects (user_id, community_id, title, description)
VALUES (999, 1, 'Test', 'Test');  -- user_id=999 doesn't exist!
-- Test passes if INSERT rejected
```

### 10.2 Integration Tests (Supertest on Node.js)

```javascript
describe('POST /api/projects', () => {
  it('should create project and count likes correctly', async () => {
    // Create project
    const project = await api.post('/projects')
      .send({ title: 'Test', description: 'Test', communityId: 1 });
    
    // Like project 3 times from different users
    await api.post(`/projects/${project.id}/like`)
      .set('userId', 'user1');
    await api.post(`/projects/${project.id}/like`)
      .set('userId', 'user2');
    await api.post(`/projects/${project.id}/like`)
      .set('userId', 'user3');
    
    // Verify like count
    const stats = await api.get(`/projects/${project.id}/stats`);
    expect(stats.likes).toBe(3);  // ✅ Passes if COUNT query works
  });
});
```

---

**End of Database Design Document**
