# HobbyHub — Database Normalization Document

**Project:** HobbyHub Social Platform
**Purpose:** Show the complete step-by-step journey of turning messy, real-world data into a clean, efficient 3NF database schema.
**DBMS:** PostgreSQL
**Date:** March 2026

> **Plain-English Ground Rule:** Normalization is the process of organizing a database to remove repeated information and prevent mistakes. Think of it like cleaning up a messy notebook — you stop writing the same person's phone number on every page, and instead put it in one place. We go through 4 steps: Unnormalized → 1NF → 2NF → 3NF.

---

## Table of Contents
1. [Why Normalize?](#1-why-normalize)
2. [Step 0: Start — Unnormalized Form (UNF)](#2-step-0-the-messy-starting-point-unnormalized-form)
3. [Step 1: First Normal Form (1NF)](#3-step-1-first-normal-form-1nf)
4. [Step 2: Second Normal Form (2NF)](#4-step-2-second-normal-form-2nf)
5. [Step 3: Third Normal Form (3NF)](#5-step-3-third-normal-form-3nf)
6. [Functional Dependency Diagrams](#6-functional-dependency-diagrams)
7. [Final 3NF Schema Summary](#7-final-3nf-schema-summary--all-tables)
8. [Intentional Denormalization Decision](#8-intentional-denormalization-decision)
9. [Normalization Verification Checklist](#9-normalization-verification-checklist)
10. [Quick-Reference Comparison Table](#10-quick-reference-comparison-table)

---

## 1. Why Normalize?

Imagine storing ALL of HobbyHub's data in ONE giant spreadsheet. Here's what goes wrong:

| Problem | What Happens | Example |
|---|---|---|
| **Repeated Data** | Same information is stored in many rows | "Code & Create" community name stored in 200 project rows |
| **Update Anomaly** | Change one thing, must update 200 rows | Rename "Code & Create" → update 200 rows, miss 3 → data inconsistency |
| **Insert Anomaly** | Can't add a community without a project | Community with 0 projects can't exist in the table |
| **Delete Anomaly** | Deleting a project accidentally deletes a user | Last project deleted → user data disappears from the table |
| **Slow Searches** | Must read entire table to find data | "Find all React projects" → read 10,000 rows |

**What proper normalization gives us:**
- ✅ Each piece of information is stored in exactly ONE place
- ✅ Change a community name → update 1 row → instantly correct everywhere
- ✅ Fast queries using indexed lookups
- ✅ No accidental data loss

---

## 2. Step 0: The Messy Starting Point — Unnormalized Form

**Scenario:** A new student developer throws all HobbyHub data into a single "ALL_DATA" spreadsheet after their first week. This is what it looks like:

### UNF Table: ALL_DATA (The Bad Version — Never Do This!)

| project_id | project_title | project_description | project_tags | project_type | user_id | username | email | user_bio | user_plan | community_id | community_name | community_color | like_user_ids | like_count | comment_ids | comment_texts | comment_user_names |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 101 | StudyBuddy App | AI study planner... | React, AI, MVP | startup | 1 | alex_chen | alex@c.edu | CS Student | free | 1 | Code & Create | #7c6df5 | 2, 3, 5 | 3 | 1001, 1002 | "Cool!", "Love this" | mia_torres, leo_park |
| 102 | Campus Art | Street illustrations... | Digital, Art | showcase | 2 | mia_torres | mia@c.edu | Designer | premium | 2 | Art Studio | #ff6b6b | 1, 3 | 2 | 1003 | "Beautiful!" | leo_park |
| 103 | LoFi Beat Pack | 30 royalty-free beats... | Music, LoFi | showcase | 3 | leo_park | leo@c.edu | Producer | premium | 3 | Music Lab | #4ecdc4 | 1, 2, 4 | 3 | 1004, 1005 | "Fire!", "Collab?" | alex_chen, mia_torres |
| 104 | Campus Finder | Events aggregator app | React, Firebase | startup | 1 | alex_chen | alex@c.edu | CS Student | free | 1 | Code & Create | #7c6df5 | 2 | 1 | 1006 | "Useful!" | mia_torres |

**Identified Problems (Annotated Analysis):**

| Column(s) | Problem Type | Description |
|---|---|---|
| `project_tags` (React, AI, MVP) | **Repeating Group in Cell** | Multiple values in one cell. Can't search for "React" efficiently. Violates Atomicity. |
| `like_user_ids` (2, 3, 5) | **Repeating Group in Cell** | Multiple IDs in one cell. Who liked what? Can't tell. Violates Atomicity. |
| `comment_ids` + `comment_texts` + `comment_user_names` | **Repeating Groups** | Three columns that repeat together. Breaks the first rule of tabular data. |
| `username`, `email`, `user_bio`, `user_plan` (rows 101 and 104) | **Repeating Rows** | Alex Chen's data (username, email, bio) is stored twice. Update anomaly risk. |
| `community_name`, `community_color` (rows 101 and 104) | **Repeating Rows** | "Code & Create" community data stored twice. Update anomaly risk. |

---

## 3. Step 1: First Normal Form (1NF)

### The Rule of 1NF:
> Every column must hold **exactly ONE value**. No lists, no comma-separated values, no repeating groups.

### What We Fix in 1NF:
1. Split `project_tags` (was "React, AI, MVP") → create a separate row per tag
2. Split `like_user_ids` (was "2, 3, 5") → create a separate row per like
3. Split comment data → create a separate row per comment
4. Split user data into its own table (no more repeating user info per project row)
5. Split community data into its own table

### Tables After 1NF:

#### USERS Table (1NF)
| user_id *(PK)* | username | email | bio | plan_type |
|---|---|---|---|---|
| 1 | alex_chen | alex@c.edu | CS Student | free |
| 2 | mia_torres | mia@c.edu | Designer | premium |
| 3 | leo_park | leo@c.edu | Producer | premium |

> ✅ Each cell has exactly ONE value. Each user appears ONCE.

---

#### COMMUNITIES Table (1NF)
| community_id *(PK)* | name | color_hex |
|---|---|---|
| 1 | Code & Create | #7c6df5 |
| 2 | Art Studio | #ff6b6b |
| 3 | Music Lab | #4ecdc4 |

> ✅ Community data is now in ONE place. Rename a community → update 1 row.

---

#### PROJECTS Table (1NF)
| project_id *(PK)* | user_id | community_id | title | description | type |
|---|---|---|---|---|---|
| 101 | 1 | 1 | StudyBuddy App | AI study planner... | startup |
| 102 | 2 | 2 | Campus Art | Street illustrations... | showcase |
| 103 | 3 | 3 | LoFi Beat Pack | 30 royalty-free beats... | showcase |
| 104 | 1 | 1 | Campus Finder | Events aggregator app | startup |

> ✅ No more repeated user or community data. We use foreign keys (user_id, community_id) instead.

---

#### PROJECT_TAGS Table (1NF — NEW table for tags)
| project_id *(FK)* | tag | *(Composite PK: project_id + tag)* |
|---|---|---|
| 101 | React | ← |
| 101 | AI | ← |
| 101 | MVP | ← |
| 102 | Digital | ← |
| 102 | Art | ← |
| 103 | Music | ← |
| 103 | LoFi | ← |
| 104 | React | ← |
| 104 | Firebase | ← |

> ✅ Each tag is on its own row. Now we can query `WHERE tag = 'React'` instantly.

---

#### LIKES Table (1NF — NEW table for likes)
| like_id *(PK)* | project_id *(FK)* | user_id *(FK)* |
|---|---|---|
| 1 | 101 | 2 |
| 2 | 101 | 3 |
| 3 | 101 | 5 |
| 4 | 102 | 1 |
| 5 | 102 | 3 |

> ✅ Each like is one row. We know EXACTLY who liked what and when.

---

#### COMMENTS Table (1NF — NEW table for comments)
| comment_id *(PK)* | project_id *(FK)* | user_id *(FK)* | body |
|---|---|---|---|
| 1001 | 101 | 2 | "Cool!" |
| 1002 | 101 | 3 | "Love this" |
| 1003 | 102 | 3 | "Beautiful!" |
| 1004 | 103 | 1 | "Fire!" |
| 1005 | 103 | 2 | "Collab?" |

> ✅ Each comment is one row. We know who wrote it, when, and what they said.

---

### 1NF Improvement Summary

| Before (UNF) | After (1NF) |
|---|---|
| 4 rows, 18 columns, 1 giant table | 6 tables, each focused on one entity |
| Tags: `"React, AI, MVP"` in one cell | Tags: one row each in PROJECT_TAGS |
| Likes: `"2, 3, 5"` in one cell | Likes: one row each in LIKES |
| Comments: `"Cool!, Love this"` in one cell | Comments: one row each in COMMENTS |
| User info repeated 2 times (Alex Chen in rows 101 & 104) | User info stored ONCE in USERS table |
| Community info repeated 2 times | Community info stored ONCE in COMMUNITIES |

---

## 4. Step 2: Second Normal Form (2NF)

### The Rule of 2NF:
> Must be in 1NF. AND every non-key column must depend on the **ENTIRE primary key** — not just part of it.

> This rule only applies to tables that have a **composite primary key** (two or more columns together form the primary key).

### Which of our tables have composite keys?

| Table | Primary Key(s) | Is it Composite? |
|---|---|---|
| USERS | `user_id` | No — single column |
| COMMUNITIES | `community_id` | No — single column |
| PROJECTS | `project_id` | No — single column |
| LIKES | `like_id` | No — single column (though UNIQUE on user_id + project_id) |
| COMMENTS | `comment_id` | No — single column |
| PROJECT_TAGS | `project_id + tag` | **YES — composite key** |

### 2NF Analysis of PROJECT_TAGS:

| Column | Depends on `project_id` alone? | Depends on `tag` alone? | Depends on `project_id + tag` together? | Verdict |
|---|---|---|---|---|
| `tag` | ✅ No (tag doesn't just depend on the project) | N/A — it IS part of the key | ✅ YES — the combination is unique | ✅ Already in 2NF |

> Conclusion: `PROJECT_TAGS` is already in 2NF. There are no non-key columns — the entire row IS the key.

### 2NF Analysis of PROJECTS:

| Column | Depends on `project_id` alone? | Any partial dependency? | Verdict |
|---|---|---|---|
| `user_id` | ✅ YES — a project has exactly one creator | ❌ None | ✅ 2NF |
| `community_id` | ✅ YES — a project belongs to exactly one community | ❌ None | ✅ 2NF |
| `title` | ✅ YES — title belongs to the project | ❌ None | ✅ 2NF |
| `description` | ✅ YES | ❌ None | ✅ 2NF |
| `type` | ✅ YES | ❌ None | ✅ 2NF |

> **Conclusion for all tables:** After our 1NF cleanup, ALL our tables were already in 2NF. This is because we gave every "wide" table (PROJECTS, LIKES, COMMENTS) a single-column primary key (`project_id`, `like_id`, `comment_id`). Partial dependencies can only exist with composite keys, which we minimized by design.

### What if we had made a mistake?

Let's imagine we had a BAD version of MEMBERSHIPS with a composite key:

**❌ BAD MEMBERSHIPS (violates 2NF):**
| user_id *(PK)* | community_id *(PK)* | community_name | community_color | joined_at |
|---|---|---|---|---|
| 1 | 1 | Code & Create | #7c6df5 | 2026-03-01 |
| 2 | 1 | Code & Create | #7c6df5 | 2026-03-02 |
| 1 | 2 | Art Studio | #ff6b6b | 2026-03-03 |

**Problem:** `community_name` and `community_color` depend ONLY on `community_id` — not on the full composite key `(user_id + community_id)`. This is a partial dependency — exactly what 2NF forbids.

**✅ FIXED (2NF-compliant MEMBERSHIPS):**
| user_id *(PK)* | community_id *(PK, FK → COMMUNITIES)* | joined_at |
|---|---|---|
| 1 | 1 | 2026-03-01 |
| 2 | 1 | 2026-03-02 |
| 1 | 2 | 2026-03-03 |

> Now `community_name` and `community_color` live only in the COMMUNITIES table. Memberships just holds the relationship.

---

## 5. Step 3: Third Normal Form (3NF)

### The Rule of 3NF:
> Must be in 2NF. AND non-key columns must depend **ONLY** on the primary key — NOT on other non-key columns.
> In other words: eliminate **transitive dependencies** (when Column C depends on Column B, and Column B depends on the primary key, but C doesn't directly need the primary key).

### 3NF Analysis: USERS Table

**Scenario check — what if we included plan pricing in USERS?**

**❌ BAD USERS (violates 3NF — hypothetical):**
| user_id *(PK)* | username | email | plan_type | monthly_price_usd |
|---|---|---|---|---|
| 1 | alex_chen | alex@c.edu | free | $0 |
| 2 | mia_torres | mia@c.edu | premium | $5 |
| 3 | leo_park | leo@c.edu | premium | $5 |

**Transitive Dependency Found:**
```
user_id → plan_type → monthly_price_usd
```
`monthly_price_usd` depends on `plan_type`, NOT directly on `user_id`.
This is a transitive dependency — it **violates 3NF**.

**Problem:** Change the premium price from $5 to $7 → must update EVERY premium user row. Miss one → data is inconsistent.

**✅ FIXED (3NF-compliant — separate the pricing):**

USERS Table (3NF):
| user_id *(PK)* | username | email | plan_type *(FK → PLANS)* |
|---|---|---|---|
| 1 | alex_chen | alex@c.edu | free |
| 2 | mia_torres | mia@c.edu | premium |
| 3 | leo_park | leo@c.edu | premium |

PLANS Table (3NF — NEW):
| plan_key *(PK)* | monthly_price_usd | max_communities | features |
|---|---|---|---|
| free | $0 | 3 | Basic |
| premium | $5 | unlimited | All Features |

> ✅ Now change the premium price once in PLANS → instantly correct for all 2 million premium users.

---

### 3NF Analysis: PROJECTS Table

| Column | Depends Directly on `project_id`? | Any transitive dependency? | Verdict |
|---|---|---|---|
| `user_id` | ✅ YES — who created this project | ❌ None detected | ✅ 3NF |
| `community_id` | ✅ YES — where it's posted | ❌ None detected | ✅ 3NF |
| `title` | ✅ YES — the project's name | ❌ None detected | ✅ 3NF |
| `description` | ✅ YES | ❌ None detected | ✅ 3NF |
| `type` | ✅ YES — "startup" or "showcase" | ❌ None detected | ✅ 3NF |
| `status` | ✅ YES — current lifecycle state | ❌ None detected | ✅ 3NF |

**Would anything violate 3NF here?**
If we stored `username` or `community_name` in PROJECTS, that would be transitive:
```
project_id → user_id → username        ← TRANSITIVE (violates 3NF!)
project_id → community_id → name       ← TRANSITIVE (violates 3NF!)
```
We avoided this by using foreign keys (`user_id`, `community_id`) and looking up the name through a JOIN.

---

### 3NF Analysis: LIKES Table

| Column | Depends Directly on `like_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `user_id` | ✅ YES — who gave the like | ❌ None | ✅ 3NF |
| `project_id` | ✅ YES — which project was liked | ❌ None | ✅ 3NF |
| `created_at` | ✅ YES — when the like happened | ❌ None | ✅ 3NF |

We do NOT store `username` or `project_title` in LIKES — that would create a transitive dependency.

---

### 3NF Analysis: COMMENTS Table

| Column | Depends Directly on `comment_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `project_id` | ✅ YES — which project was commented on | ❌ None | ✅ 3NF |
| `user_id` | ✅ YES — who wrote the comment | ❌ None | ✅ 3NF |
| `body` | ✅ YES — the actual comment text | ❌ None | ✅ 3NF |
| `parent_id` | ✅ YES — for threaded replies | ❌ None | ✅ 3NF |
| `created_at` | ✅ YES — when it was posted | ❌ None | ✅ 3NF |

---

### 3NF Analysis: MEMBERSHIPS Table

| Column | Depends Directly on `membership_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `user_id` | ✅ YES | ❌ None | ✅ 3NF |
| `community_id` | ✅ YES | ❌ None | ✅ 3NF |
| `joined_at` | ✅ YES | ❌ None | ✅ 3NF |

---

### 3NF Analysis: FOLLOWS Table

| Column | Depends Directly on `follow_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `follower_id` | ✅ YES | ❌ None | ✅ 3NF |
| `followee_id` | ✅ YES | ❌ None | ✅ 3NF |
| `created_at` | ✅ YES | ❌ None | ✅ 3NF |

---

### 3NF Analysis: CHALLENGES Table

| Column | Depends Directly on `challenge_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `community_id` | ✅ YES — where the challenge is hosted | ❌ None | ✅ 3NF |
| `title` | ✅ YES | ❌ None | ✅ 3NF |
| `description` | ✅ YES | ❌ None | ✅ 3NF |
| `prize` | ✅ YES — specific to this challenge | ❌ None | ✅ 3NF |
| `starts_at` | ✅ YES | ❌ None | ✅ 3NF |
| `ends_at` | ✅ YES | ❌ None | ✅ 3NF |
| `created_by` | ✅ YES — admin who set it up | ❌ None | ✅ 3NF |

---

### 3NF Analysis: CHALLENGE_ENTRIES Table

| Column | Depends Directly on `entry_id`? | Transitive dependency? | Verdict |
|---|---|---|---|
| `challenge_id` | ✅ YES | ❌ None | ✅ 3NF |
| `project_id` | ✅ YES | ❌ None | ✅ 3NF |
| `submitted_at` | ✅ YES | ❌ None | ✅ 3NF |

---

## 6. Functional Dependency Diagrams

**What is a Functional Dependency?**
We say "A → B" (A determines B) when knowing the value of A tells you exactly what B's value is.
For example: `user_id → email` means every user has exactly one email — knowing the user ID tells you what email it is.

### USERS Table — Functional Dependencies
```
user_id ───────────────→ username
         ───────────────→ email
         ───────────────→ password_hash
         ───────────────→ bio
         ───────────────→ avatar_url
         ───────────────→ plan_type
         ───────────────→ is_verified
         ───────────────→ created_at

All arrows go FROM user_id (the primary key).
No column depends on another non-key column. ✅ 3NF confirmed.
```

### PROJECTS Table — Functional Dependencies
```
project_id ─────────────→ user_id
           ─────────────→ community_id
           ─────────────→ title
           ─────────────→ description
           ─────────────→ tags[ ]
           ─────────────→ type
           ─────────────→ status
           ─────────────→ looking_for
           ─────────────→ created_at

           ❌ NOT stored (would be transitive):
           ─────────────✗ username    (username depends on user_id, not project_id)
           ─────────────✗ community_name (depends on community_id, not project_id)

All arrows go FROM project_id. ✅ 3NF confirmed.
```

### Transitive Dependency Examples (What We Avoided)
```
❌ TRANSITIVE CHAIN (violated 3NF if we had stored these):

project_id → user_id → username    [BAD: username depends on user_id, not project_id]
project_id → user_id → email       [BAD]
project_id → community_id → name   [BAD: community name depends on community_id]
user_id    → plan_type → price     [BAD: price depends on plan_type, not user_id]

✅ HOW WE FIXED IT:
Instead of storing username in PROJECTS → we store user_id and JOIN the USERS table.
Instead of storing community name → we store community_id and JOIN COMMUNITIES.
Instead of plan pricing in USERS → we keep PLANS as a separate table (for future use).
```

---

## 7. Final 3NF Schema Summary — All Tables

All 9 tables reaching Third Normal Form (3NF):

### Table 1: USERS
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| user_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| username | VARCHAR(50) | UNIQUE, NOT NULL | ✅ YES | ❌ NO |
| email | VARCHAR(255) | UNIQUE, NOT NULL | ✅ YES | ❌ NO |
| password_hash | VARCHAR(255) | NOT NULL | ✅ YES | ❌ NO |
| bio | TEXT | nullable | ✅ YES | ❌ NO |
| avatar_url | VARCHAR(500) | nullable | ✅ YES | ❌ NO |
| plan_type | VARCHAR(10) | DEFAULT 'free' | ✅ YES | ❌ NO |
| is_verified | BOOLEAN | DEFAULT FALSE | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| updated_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| user_id | username | email | plan_type | is_verified | created_at |
|---|---|---|---|---|---|
| 1 | alex_chen | alex@college.edu | free | FALSE | 2026-03-01 09:00:00 |
| 2 | mia_torres | mia@college.edu | premium | TRUE | 2026-03-01 10:00:00 |
| 3 | leo_park | leo@college.edu | premium | TRUE | 2026-03-02 08:30:00 |

---

### Table 2: COMMUNITIES
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| community_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| name | VARCHAR(100) | UNIQUE, NOT NULL | ✅ YES | ❌ NO |
| description | TEXT | nullable | ✅ YES | ❌ NO |
| icon | VARCHAR(10) | nullable | ✅ YES | ❌ NO |
| color_hex | CHAR(7) | nullable | ✅ YES | ❌ NO |
| cover_url | VARCHAR(500) | nullable | ✅ YES | ❌ NO |
| avatar_url | VARCHAR(500) | nullable | ✅ YES | ❌ NO |
| created_by | INT | FK → users | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| community_id | name | icon | color_hex | created_by |
|---|---|---|---|---|
| 1 | Code & Create | 💻 | #7c6df5 | 1 |
| 2 | Art Studio | 🎨 | #ff6b6b | 2 |
| 3 | Music Lab | 🎧 | #4ecdc4 | 3 |

---

### Table 3: PROJECTS
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| project_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| user_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| community_id | INT | FK → communities | ✅ YES | ❌ NO |
| title | VARCHAR(200) | NOT NULL | ✅ YES | ❌ NO |
| description | TEXT | NOT NULL | ✅ YES | ❌ NO |
| tags | TEXT[] | nullable | ✅ YES | ❌ NO (see Section 8) |
| image_url | VARCHAR(500) | nullable | ✅ YES | ❌ NO |
| type | VARCHAR(20) | CHECK IN (showcase, startup) | ✅ YES | ❌ NO |
| status | VARCHAR(20) | CHECK IN (draft, published...) | ✅ YES | ❌ NO |
| looking_for | VARCHAR(200) | nullable | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| updated_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| project_id | user_id | community_id | title | type | status | tags |
|---|---|---|---|---|---|---|
| 101 | 1 | 1 | StudyBuddy App | startup | published | {React, AI, Education} |
| 102 | 2 | 2 | Campus Art | showcase | featured | {Digital Art, Print} |
| 103 | 3 | 3 | LoFi Beat Pack | showcase | published | {Music, LoFi} |
| 104 | 1 | 1 | Campus Finder | startup | published | {React, Firebase} |

---

### Table 4: MEMBERSHIPS (Junction Table — Users ↔ Communities)
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| membership_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| user_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| community_id | INT | FK → communities, NOT NULL | ✅ YES | ❌ NO |
| joined_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| — | — | UNIQUE(user_id, community_id) | Prevents duplicate joins | — |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| membership_id | user_id | community_id | joined_at |
|---|---|---|---|
| 501 | 1 | 1 | 2026-03-01 09:30:00 |
| 502 | 1 | 2 | 2026-03-02 14:00:00 |
| 503 | 2 | 1 | 2026-03-01 11:00:00 |
| 504 | 2 | 2 | 2026-03-01 11:30:00 |
| 505 | 3 | 3 | 2026-03-02 09:00:00 |

> **Free plan rule (enforced at API level):** One user can have at most 3 rows in MEMBERSHIPS.

---

### Table 5: LIKES (Junction Table — Users ↔ Projects)
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| like_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| user_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| project_id | INT | FK → projects, NOT NULL | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| — | — | UNIQUE(user_id, project_id) | One like per user per project | — |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| like_id | user_id | project_id | created_at |
|---|---|---|---|
| 701 | 2 | 101 | 2026-03-05 10:00:00 |
| 702 | 3 | 101 | 2026-03-05 11:30:00 |
| 703 | 1 | 102 | 2026-03-06 09:00:00 |
| 704 | 3 | 102 | 2026-03-06 14:00:00 |
| 705 | 1 | 103 | 2026-03-07 08:00:00 |
| 706 | 2 | 103 | 2026-03-07 09:00:00 |

> **Database constraint in action:** If user 2 tries to like project 101 again, PostgreSQL throws a `UNIQUE constraint violation` error. Our API catches this and returns `409 Conflict`.

---

### Table 6: COMMENTS
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| comment_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| project_id | INT | FK → projects, NOT NULL | ✅ YES | ❌ NO |
| user_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| body | TEXT | NOT NULL | ✅ YES | ❌ NO |
| parent_id | INT | FK → comments (self-ref) | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| comment_id | project_id | user_id | body | parent_id |
|---|---|---|---|---|
| 1001 | 101 | 2 | "This looks amazing! I'd love to help with UI/UX" | NULL |
| 1002 | 101 | 1 | "@mia Great! Let's connect via the directory" | 1001 |
| 1003 | 101 | 3 | "Love the AI angle here!" | NULL |
| 1004 | 102 | 3 | "Beautiful illustrations!" | NULL |
| 1005 | 103 | 1 | "Fire! Can we collab on Vol.3?" | NULL |

> **Thread structure:** Comment 1002 has `parent_id = 1001` — it is a reply to comment 1001. This is a self-referencing foreign key, which allows one level of thread nesting.

---

### Table 7: FOLLOWS (Self-Referencing — Users ↔ Users)
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| follow_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| follower_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| followee_id | INT | FK → users, NOT NULL | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| — | — | UNIQUE(follower_id, followee_id) | Can't follow same person twice | — |
| — | — | CHECK (follower_id != followee_id) | Can't follow yourself | — |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| follow_id | follower_id | followee_id | created_at | Meaning |
|---|---|---|---|---|
| 601 | 1 | 2 | 2026-03-05 | Alex follows Mia |
| 602 | 1 | 3 | 2026-03-06 | Alex follows Leo |
| 603 | 2 | 3 | 2026-03-04 | Mia follows Leo |

---

### Table 8: CHALLENGES
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| challenge_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| community_id | INT | FK → communities, NOT NULL | ✅ YES | ❌ NO |
| title | VARCHAR(200) | NOT NULL | ✅ YES | ❌ NO |
| description | TEXT | nullable | ✅ YES | ❌ NO |
| prize | VARCHAR(200) | nullable | ✅ YES | ❌ NO |
| starts_at | TIMESTAMP | NOT NULL | ✅ YES | ❌ NO |
| ends_at | TIMESTAMP | NOT NULL | ✅ YES | ❌ NO |
| created_by | INT | FK → users | ✅ YES | ❌ NO |
| created_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| challenge_id | community_id | title | prize | starts_at | ends_at |
|---|---|---|---|---|---|
| 801 | 1 | Build a Mini App in 48hrs | Featured Badge + 3mo Premium | 2026-03-08 | 2026-03-10 |
| 802 | 2 | Digital Art Speed Painting | Premium Month | 2026-03-08 | 2026-03-15 |
| 803 | 3 | Compose a 60-sec Jingle | Studio Session Credit | 2026-03-08 | 2026-03-15 |

---

### Table 9: CHALLENGE_ENTRIES (Junction Table — Projects ↔ Challenges)
| Column | Data Type | Constraint | Depends on PK? | Transitive Dep? |
|---|---|---|---|---|
| entry_id | SERIAL | PRIMARY KEY | ← IS the PK | — |
| challenge_id | INT | FK → challenges, NOT NULL | ✅ YES | ❌ NO |
| project_id | INT | FK → projects, NOT NULL | ✅ YES | ❌ NO |
| submitted_at | TIMESTAMP | DEFAULT NOW() | ✅ YES | ❌ NO |
| — | — | UNIQUE(challenge_id, project_id) | No duplicate submissions | — |
| **Normal Form Level** | | | | **✅ 3NF** |

**Sample Data:**
| entry_id | challenge_id | project_id | submitted_at |
|---|---|---|---|
| 901 | 801 | 101 | 2026-03-08 10:30:00 |
| 902 | 801 | 104 | 2026-03-09 08:15:00 |
| 903 | 803 | 103 | 2026-03-08 14:00:00 |

> **Leaderboard logic:** To rank challenge entries, we JOIN this table with LIKES and count likes on each `project_id`. The project with the most likes in a challenge is ranked #1.

---

## 8. Intentional Denormalization Decision

Not all normalization decisions are about achieving the "technically purest" form. Sometimes, for performance reasons, a controlled denormalization is the right engineering choice.

### Decision: `tags TEXT[]` in PROJECTS table

**Fully Normalized Alternative (3NF — technically correct but slower):**

PROJECT_TAGS Table:
| project_id *(FK)* | tag |
|---|---|
| 101 | React |
| 101 | AI |
| 101 | Education |
| 104 | React |
| 104 | Firebase |

**Query needed to get project + tags (requires JOIN every time):**
```sql
SELECT p.title, ARRAY_AGG(pt.tag) AS tags
FROM projects p
JOIN project_tags pt ON p.project_id = pt.project_id
WHERE p.status = 'published'
GROUP BY p.project_id;
-- Requires a JOIN on every project card load. 20 cards = 20 JOIN operations.
```

---

**Our Choice (Controlled Denormalization — stored as `TEXT[]`):**

PROJECTS Table with tags array:
| project_id | title | tags |
|---|---|---|
| 101 | StudyBuddy App | {React, AI, Education} |
| 104 | Campus Finder | {React, Firebase} |

**Query with array (no JOIN needed):**
```sql
SELECT project_id, title, tags FROM projects WHERE status = 'published';
-- No JOIN. Simpler, faster, one query gets everything.
```

**Searching by tag is still fast with a GIN index:**
```sql
-- Find all React projects:
SELECT * FROM projects WHERE tags @> ARRAY['React'];
-- Uses GIN index. Fast even with 1 million rows.
```

**Decision Reasoning:**

| Factor | Normalized (Separate Table) | Denormalized (Array Column) | Our Choice |
|---|---|---|---|
| Query simplicity for feed | Low — requires JOIN | High — single SELECT | ✅ Array wins |
| Read speed (feed loads 20+ cards) | Slower — JOIN × 20 | Faster — single scan | ✅ Array wins |
| Write speed (adding/removing a tag) | Faster | Slightly slower | — Normalized wins |
| Read:Write ratio in our app | — | 100:1 (read-heavy) | ✅ Optimize for reads |
| Tag search speed | Fast with B-Tree index | Fast with GIN index | Tie |
| Storage efficiency | Slightly more efficient | Minimal overhead | Negligible |

> **Verdict:** Tags are read 100 times for every 1 time they are updated. Optimizing for reads (the dominant operation) with a `TEXT[]` array column is the correct engineering trade-off. We document this as **intentional denormalization**, clearly flagged in our schema comments.

---

## 9. Normalization Verification Checklist

Use this checklist to verify any new table added to HobbyHub passes all normal forms.

### ✅ 1NF Checklist
- [ ] Every column has exactly ONE value (no comma-separated lists)
- [ ] There are no repeating column groups (e.g., tag1, tag2, tag3)
- [ ] Each row is unique (there is a primary key)
- [ ] All rows have the same number of columns

### ✅ 2NF Checklist
*(Skip if the table has a single-column primary key — 2NF is automatically satisfied)*
- [ ] If using a composite primary key, every non-key column depends on ALL columns of the key
- [ ] No non-key column depends on only PART of the primary key
- [ ] If there's a partial dependency → split into a new table with its own key

### ✅ 3NF Checklist
- [ ] No non-key column depends on another non-key column
- [ ] No "chain" of dependencies: `PK → Col_A → Col_B` where Col_B is derived from Col_A
- [ ] If you find a transitive dependency → move the dependent columns to a new table
- [ ] All columns that are "facts about other tables" use foreign keys instead of duplicated data

### ✅ Final Cross-Table Checks
- [ ] Every foreign key references a valid primary key in another table
- [ ] Deleting a parent row has the correct cascade behavior (CASCADE or SET NULL)
- [ ] No table stores data that can be calculated from another table's data
- [ ] Each table represents exactly ONE type of entity or ONE type of relationship

---

## 10. Quick-Reference Comparison Table

### Before vs. After — Full Summary

| Aspect | UNF (Start) | 1NF | 2NF | 3NF (Final) |
|---|---|---|---|---|
| **Tables** | 1 giant table | 6 tables | 6 tables (same) | 9 tables |
| **Tags storage** | `"React, AI, MVP"` in one cell | Separate PROJECT_TAGS table | Same | Array `{React, AI}` (intentional denorm) |
| **Likes storage** | `"2,3,5"` in one cell | Separate LIKES table (one row per like) | Same | Same |
| **Comments** | All in one cell | Separate COMMENTS table | Same | Same |
| **User info repeated?** | YES (in every project row) | NO (separate USERS table) | NO | NO |
| **Community info repeated?** | YES (in every project row) | NO (separate COMMUNITIES table) | NO | NO |
| **Plan pricing location** | Would be in USERS (transitive dep) | Would be in USERS | Would be in USERS | Separate PLANS table (FK only) |
| **Update anomaly risk** | VERY HIGH | Low | Low | None |
| **Insert anomaly risk** | HIGH | Low | None | None |
| **Delete anomaly risk** | HIGH | Low | None | None |
| **Query speed** | SLOW (full table scan) | Medium | Medium | FAST (indexed lookups) |
| **Data integrity** | Low | Medium | High | Very High |
| **Normal Form reached** | ❌ UNF | ✅ 1NF | ✅ 2NF | ✅ 3NF |

---

*End of Database Normalization Document*
*For the EER Diagram and complete SQL queries, see `02_DATABASE_DESIGN_DOCUMENT.md`.*
*For the API endpoints and technical setup, see `03_TECHNICAL_IMPLEMENTATION_GUIDE.md`.*
