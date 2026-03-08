# HobbyHub — How to Build This App

**Quick Guide for Developers**

---

## Architecture Diagrams

### System Architecture
```
┌─────────────────────────────────┐
│    React Web App (Frontend)     │
│  Vite + React 18 + TailwindCSS  │
└────────────────┬────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────┐
│    Node.js API Gateway          │
│  Express.js + JWT Auth + Validator
└───┬──────────────────────┬──────┘
    │                      │
    ▼                      ▼
┌──────────────┐   ┌──────────────┐
│ PostgreSQL   │   │   MongoDB    │
│  (Relational)│   │  (Documents) │
└──────────────┘   └──────────────┘
    ▲
    │ Cache Layer
    ▼
┌──────────────┐
│ Redis Cache  │
└──────────────┘
```

---

### User Registration Flow
```
┌─────────────────────────────────────┐
│ User fills Signup Form              │
│ - Email, Password, Username         │
└────────────────┬────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Client Validation  │
        │ - Email valid?     │
        │ - Password >= 8ch? │
        └────────────┬───────┘
                     │
                     ▼
    ┌────────────────────────────┐
    │ POST /auth/signup          │
    │ + email, password          │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Server Validation          │
    │ - Email unique in DB?      │
    │ - Password hash with bcrypt│
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ INSERT INTO users          │
    │ (email, password_hash,...) │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Generate JWT Token         │
    │ exp: 7 days from now       │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Response: 201 Created      │
    │ {token, user_data}         │
    └────────────┬───────────────┘
                 │
                 ▼
    User logged in! ✅
```

---

### Like/Unlike Project Flow
```
Click ❤️ Button
        │
        ▼
    Already liked?
    ✖               ✓
   │               │
   ▼               ▼
REMOVE LIKE      ADD LIKE
   │           │
   ▼           ▼
DELETE FROM   INSERT INTO
likes WHERE   likes
user=X &      (user_id,
proj=Y        project_id)
   │           │
   └──────┬────┘
          │
          ▼
    Update Redis:
    feed:user:{X}
    (cache invalid)
          │
          ▼
    React UI:
    Like count +1 or -1
    Heart icon toggles
          │
          ▼
    User sees change ✅
```

---

### Comment Submission Flow
```
User types comment
    │
    ▼
Click "Post Comment"
    │
    ▼
┌────────────────────┐
│ Client Validation  │
│ - Not empty?       │
│ - < 1000 chars?    │
└────────┬───────────┘
         │
         ▼
POST /projects/{id}/comments
├─ Check: User logged in?
├─ Check: Project exists?
└─ INSERT INTO comments
     (project_id, user_id, body, created_at)
         │
         ▼
    Generate notification:
    "{username} commented on your project"
         │
         ▼
    INSERT INTO notifications (MongoDB)
         │
         ▼
    Response: 201 Created
    {comment_id, user, body, created_at}
         │
         ▼
    React updates UI:
    ├─ Comment appears in list
    ├─ Comment count +1
    └─ Input field cleared
```

---

## How Data is Stored and Retrieved

### User, Project, Community Connections
```
┌──────────────┐
│   USERS      │
│ username     │   ┌─────────────────────────┐
│ email        ├──-→ 1 User : Many Projects │
│ bio          │   └─────────────────────────┘
│ avatar_url   │
│ plan_type    │   ┌──────────────────────────┐
│ is_verified  ├──-→ Many Users : Many Comms │
└──────────────┘   │ (via MEMBERSHIPS)       │
                   └──────────────────────────┘

              ↓ (joins)

┌────────────────────┐
│  COMMUNITIES       │
│ name: "Code & ..   │
│ icon: "💻"         │
│ color: #6366f1     │
│ members: 1240      │
└────────────────────┘

              ↓ (contains)

┌──────────────────┐
│    PROJECTS      │
│ title            │
│ description      │
│ tags: [React...] │
│ likes: 87        │
│ comments: 14     │
│ status: published│
└──────────────────┘

         ↙        ↓        ↘

    ┌────────┐ ┌────────┐ ┌────────┐
    │ LIKES  │ │COMMENTS│ │CHALLENGE
    │(M:N)  │ │(1:N)   │ │_ENTRIES
    │user: 1│ │user: 2 │ │challenge: 1
    │proj: 5│ │proj: 5 │ │proj: 5
    └────────┘ └────────┘ └────────┘
```

---

## Join Operations Explained

### Scenario: Get Home Feed for User #1

```sql
User has joined communities: [1, 3, 5]

SELECT p.title, u.username, c.name
FROM projects p
  INNER JOIN users u ON p.user_id = u.user_id
  INNER JOIN communities c ON p.community_id = c.community_id
WHERE p.community_id IN (1, 3, 5)
AND p.status = 'published';

Result:
┌─────────────────────┬──────────────┬────────────────────┐
│ title               │ username     │ community_name     │
├─────────────────────┼──────────────┼────────────────────┤
│ StudyBuddy App      │ Alex Chen    │ Code & Create      │
│ Campus Illustrations│ Mia Torres   │ Art Studio         │
│ LoFi Beat Pack Vol2 │ Leo Park     │ Music Lab          │
└─────────────────────┴──────────────┴────────────────────┘
```

---

## SQL Query Patterns

### Pattern 1: Aggregation with GROUP BY
```sql
-- Show the 10 most liked projects
SELECT project_id, COUNT(*) as total_likes
FROM likes
GROUP BY project_id
ORDER BY total_likes DESC
LIMIT 10;

-- Result: Shows top 10 most-liked projects
```

### Pattern 2: Subquery for Filtering
```sql
-- Find users I haven't followed yet
SELECT u.username, u.bio FROM users u
WHERE u.user_id NOT IN (
  SELECT followee_id FROM follows WHERE follower_id = 1
)
AND u.user_id != 1;

-- Result: Suggested people to follow
```

### Pattern 3: Window Functions for Ranking
```sql
-- Show challenge leaderboard with rankings
SELECT p.title, u.username, COUNT(l.like_id) as votes,
       RANK() OVER (ORDER BY COUNT(l.like_id) DESC) as rank
FROM challenge_entries ce
  JOIN projects p ON ce.project_id = p.project_id
  JOIN users u ON p.user_id = u.user_id
  LEFT JOIN likes l ON p.project_id = l.project_id
WHERE ce.challenge_id = 1
GROUP BY ce.entry_id, p.title, u.username;

-- Result: Leaderboard with rankings
```

---

## Speed Up the App with Temporary Memory (Cache)

### What gets saved to speed up the app

```
Cache Layer 1: User Login Info
  Saved: {token, email, username, plan_type}
  Lives for: 7 days

Cache Layer 2: Home Feed (projects list)
  Lives for: 2 minutes
  
Cache Layer 3: Challenge Leaderboard
  Lives for: 30 seconds

Cache Layer 4: Community Stats
  Lives for: 10 minutes
```

**When to clear cached data:**
- When someone likes → Refresh home feeds and leaderboards
- When someone posts → Refresh home feeds for community members
- When someone joins a community → Refresh community stats

---

## Testing Checklist

### Frontend Testing
- [ ] Can user register and login?
- [ ] Does home feed load within 1 second?
- [ ] Can user create project and see it immediately?
- [ ] Can user like/unlike project (heart toggles)?
- [ ] Can user comment and see comment appear?
- [ ] Can user search projects by keyword?
- [ ] Can user join/leave community?
- [ ] Mobile responsive at 375px and 1920px?

### Backend Testing
- [ ] POST /auth/signup creates user in DB?
- [ ] POST /auth/login returns valid JWT token?
- [ ] POST /projects creates entry in projects table?
- [ ] POST /projects/{id}/like prevents duplicate likes?
- [ ] POST /projects/{id}/comments creates with foreign keys?
- [ ] GET /projects filters by status='published'?
- [ ] GET /feed/:userId returns only joined communities?
- [ ] All responses under 300ms at p95?

### Database Testing
- [ ] UNIQUE(user_id, project_id) prevents duplicate likes?
- [ ] Foreign key constraints prevent orphan records?
- [ ] Indexes speed up queries (INDEX SCAN not SEQ SCAN)?
- [ ] Cascade deletes work correctly?
- [ ] Transactions maintain data consistency?

---

## Common Pitfalls & Solutions

| Problem | Symptom | Solution |
|---|---|---|
| **Too Many Queries** | App slow, Database working hard | Use JOINs instead of separate queries |
| **Missing Speed Lookup** | Finding data takes ages | Add index on columns you search |
| **Old Data Showing** | User sees stale info | Clear the cache when data changes |
| **Duplicate Likes** | Database error | Add a rule to prevent double-likes |
| **Connections Leak** | App crashes after hours | Close database connections properly |
| **Race Problems** | Wrong count sometimes | Use transactions for updates |

---

## Things to Check Before Going Live

- [ ] Code works correctly (all tests pass)
- [ ] Speed lookups created in database
- [ ] Temporary memory system set up
- [ ] Login info configured (.env file)
- [ ] Security certificates installed
- [ ] Database backups scheduled
- [ ] Error tracking set up
- [ ] Rate limiting turned on
- [ ] Cross-site access permissions set up
- [ ] Health checks active

---

**End of Technical Implementation Guide**
