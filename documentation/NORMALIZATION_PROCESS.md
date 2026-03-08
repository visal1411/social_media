# Database Normalization Process (Unnormalized → 1NF → 2NF → 3NF)

**Project:** HobbyHub  
**Date:** March 2026  
**Purpose:** Show step-by-step how to organize messy data into clean, efficient database tables

---

## Why Normalize Data?

**Problems with messy data:**
- Repeated information wastes space
- Hard to update info (fix in 5 places!)
- Can accidentally make mistakes
- Slow queries

**What normalization does:**
- ✅ Removes duplicate data
- ✅ Makes updates easy (change once, everywhere updates)
- ✅ Prevents mistakes
- ✅ Speeds up searches

---

## STEP 1: Unnormalized Data (The Messy Starting Point)

Imagine someone just threw all the HobbyHub data into ONE giant table:

### ❌ ALL_DATA Table (BAD - This is Messy!)

| project_id | project_title | project_tags | user_id | username | user_email | user_bio | community_id | community_name | like_ids | like_count | comment_ids | comment_bodies |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 101 | StudyBuddy App | React, AI, MVP | 1 | alex_chen | alex@college.edu | CS Student | 1 | Code & Create | 2, 5, 8, 12 | 4 | 10, 15, 20 | "Cool!", "Love this", "Help me" |
| 102 | Campus Art | Drawing, Digital | 2 | mia_torres | mia@college.edu | Designer | 2 | Art Studio | 3, 7, 14 | 3 | 11, 18, 22 | "Beautiful!", "Amazing", "Teach me" |
| 105 | Beat Pack Vol 2 | Music, LoFi, Beats | 3 | leo_park | leo@college.edu | Producer | 3 | Music Lab | 1, 4, 9, 13 | 4 | 12, 19, 25 | "Fire!", "Remix?", "Tutorial" |

**Problems:**
- ❌ Tags are in ONE cell with commas (React, AI, MVP) = Hard to search!
- ❌ Like IDs are in ONE cell (2, 5, 8, 12) = Can't say who liked it
- ❌ Comment bodies are in ONE cell (repeated) = Don't know who commented
- ❌ User info repeated for every project by that user
- ❌ Community info repeated for every project in that community
- ❌ To find all React projects, you have to read ALL the data!

---

## STEP 2: First Normal Form (1NF) - Eliminate Repeating Groups

**Rule:** Each cell must have ONE value only (no lists or repeating groups)

### ✅ Split repeating data into separate rows:

#### USERS Table
| user_id | username | email | bio |
|---------|----------|-------|-----|
| 1 | alex_chen | alex@college.edu | CS Student |
| 2 | mia_torres | mia@college.edu | Designer |
| 3 | leo_park | leo@college.edu | Producer |

#### COMMUNITIES Table
| community_id | name |
|--------------|------|
| 1 | Code & Create |
| 2 | Art Studio |
| 3 | Music Lab |

#### PROJECTS Table
| project_id | title | user_id | community_id |
|---|---|---|---|
| 101 | StudyBuddy App | 1 | 1 |
| 102 | Campus Art | 2 | 2 |
| 105 | Beat Pack Vol 2 | 3 | 3 |

#### PROJECT_TAGS Table (Solved the tags problem!)
| project_id | tag |
|---|---|
| 101 | React |
| 101 | AI |
| 101 | MVP |
| 102 | Drawing |
| 102 | Digital |
| 105 | Music |
| 105 | LoFi |
| 105 | Beats |

#### LIKES Table (Solved the likes problem!)
| like_id | project_id | user_id |
|---|---|---|
| 2 | 101 | 2 |
| 5 | 101 | 3 |
| 8 | 101 | 1 |
| 12 | 101 | 2 |
| 3 | 102 | 1 |
| 7 | 102 | 2 |
| 14 | 102 | 3 |

#### COMMENTS Table (Solved the comments problem!)
| comment_id | project_id | user_id | body |
|---|---|---|---|
| 10 | 101 | 2 | "Cool!" |
| 15 | 101 | 3 | "Love this" |
| 20 | 101 | 1 | "Help me" |
| 11 | 102 | 3 | "Beautiful!" |
| 18 | 102 | 1 | "Amazing" |
| 22 | 102 | 2 | "Teach me" |

**Improvements:**
- ✅ No more lists in cells
- ✅ Each cell has one value
- ✅ PROBLEM FIXED: Can now easily search for all "React" projects

**Remaining problems:**
- ❌ User info is separate from PROJECTS, but we repeat it
- ❌ Community info is separate but we repeat it

---

## STEP 3: Second Normal Form (2NF) - Remove Partial Dependencies

**Rule:** Non-key columns must depend on the ENTIRE primary key, not just part of it

**In our case:** Make sure each table's data only depends on that table's main ID

### ✅ Now we check: Does every column depend on the table's main ID?

#### PROJECTS Table (Check ✅)
| project_id | title | user_id | community_id |
|---|---|---|---|
| 101 | StudyBuddy App | 1 | 1 |
| 102 | Campus Art | 2 | 2 |
| 105 | Beat Pack Vol 2 | 3 | 3 |

**Questions:**
- Does "title" depend on project_id? ✅ YES
- Does "user_id" depend on project_id? ✅ YES
- Does "community_id" depend on project_id? ✅ YES
- **GOOD!** This table is already in 2NF

#### COMMENTS Table (Check ✅)
| comment_id | project_id | user_id | body |
|---|---|---|---|
| 10 | 101 | 2 | "Cool!" |

**Questions:**
- Does "project_id" depend on comment_id? ✅ YES
- Does "user_id" depend on comment_id? ✅ YES
- Does "body" depend on comment_id? ✅ YES
- **GOOD!** This table is in 2NF

**Actually, for ALL our tables, once we removed repeating groups in Step 1, they became 2NF!**

**Remaining problems:**
- ❌ In some queries, we look up user info from user_id multiple times
- ❌ In some queries, we look up community info from community_id multiple times

---

## STEP 4: Third Normal Form (3NF) - Remove All Transitive Dependencies

**Rule:** Non-key columns must depend ONLY on the primary key, not on other non-key columns

**Simple version:** Don't store data that you can look up from somewhere else

### Let me check each table for hidden dependencies:

#### USERS Table
| user_id | username | email | bio |
|---------|----------|-------|-----|
| 1 | alex_chen | alex@college.edu | CS Student |

**Check:**
- Does "username" depend on user_id? ✅ YES
- Does "email" depend on user_id? ✅ YES
- Does "bio" depend on user_id? ✅ YES
- Does anything depend on something OTHER than user_id? ❌ NO
- **GOOD!** Already in 3NF

#### COMMUNITIES Table
| community_id | name |
|---|---|
| 1 | Code & Create |

**Check:**
- Does "name" depend on community_id? ✅ YES
- Does anything depend on something OTHER than community_id? ❌ NO
- **GOOD!** Already in 3NF

#### PROJECTS Table (⚠️ Check this carefully)
| project_id | title | user_id | community_id |
|---|---|---|---|
| 101 | StudyBuddy App | 1 | 1 |

**Check:**
- Does "title" depend on project_id? ✅ YES
- Does "user_id" depend on project_id? ✅ YES (who created the project)
- Does "community_id" depend on project_id? ✅ YES (where it's posted)
- Does anything depend on something OTHER than project_id? ❌ NO
  - We DON'T store the user's name here (that's in USERS table)
  - We DON'T store the community's name here (that's in COMMUNITIES table)
- **GOOD!** This is in 3NF

#### PROJECT_TAGS Table
| project_id | tag |
|---|---|
| 101 | React |

**Check:**
- Does "tag" depend on project_id? ✅ YES
- Is this the primary key? ✅ YES (project_id + tag = unique)
- Does anything depend on something OTHER than the key? ❌ NO
- **GOOD!** This is in 3NF

#### LIKES Table
| like_id | project_id | user_id |
|---|---|---|
| 2 | 101 | 2 |

**Check:**
- Does "project_id" depend on like_id? ✅ YES
- Does "user_id" depend on like_id? ✅ YES
- Does anything depend on something OTHER than like_id? ❌ NO
  - We DON'T store project title here
  - We DON'T store user name here
- **GOOD!** This is in 3NF

#### COMMENTS Table
| comment_id | project_id | user_id | body |
|---|---|---|---|
| 10 | 101 | 2 | "Cool!" |

**Check:**
- Does "project_id" depend on comment_id? ✅ YES
- Does "user_id" depend on comment_id? ✅ YES
- Does "body" depend on comment_id? ✅ YES
- Does anything depend on something OTHER than comment_id? ❌ NO
  - We DON'T store project title here
  - We DON'T store user name here
- **GOOD!** This is in 3NF

---

## Final 3NF Schema - All Clean and Organized!

```
┌──────────────────────────────────────────────┐
│              USERS                           │
├──────────────────────────────────────────────┤
│ user_id   │ username  │ email  │ bio        │
├──────────────────────────────────────────────┤
│ 1         │ alex_chen │ a@c.e  │ CS Student │
│ 2         │ mia_torre │ m@c.e  │ Designer   │
│ 3         │ leo_park  │ l@c.e  │ Producer   │
└──────────────────────────────────────────────┘
              ▲
              │ (FK: user_id)
              └──── COMES FROM HERE
                    
┌──────────────────────────────┐
│      COMMUNITIES             │
├──────────────────────────────┤
│ community_id │ name         │
├──────────────────────────────┤
│ 1            │ Code & ...   │
│ 2            │ Art Studio   │
│ 3            │ Music Lab    │
└──────────────────────────────┘
              ▲
              │ (FK: community_id)
              └──── COMES FROM HERE

┌─────────────────────────────────────────────────────┐
│              PROJECTS                               │
├─────────────────────────────────────────────────────┤
│ project_id │ title │ user_id ↓ │ community_id ↓   │
├─────────────────────────────────────────────────────┤
│ 101        │ Study │ 1         │ 1                 │
│ 102        │ Art   │ 2         │ 2                 │
│ 105        │ Beat  │ 3         │ 3                 │
└─────────────────────────────────────────────────────┘
    ▲            │            │
    │            └────────────┴────── JOINS FROM HERE
    └────────────────────────────────
         
┌────────────────────────────────┐
│       PROJECT_TAGS             │
├────────────────────────────────┤
│ project_id ↓ │ tag            │
├────────────────────────────────┤
│ 101          │ React          │
│ 101          │ AI             │
│ 102          │ Drawing        │
└────────────────────────────────┘
    │
    └──── JOINS FROM PROJECT (project_id)

┌────────────────────────────────┐
│         LIKES                  │
├────────────────────────────────┤
│ like_id │ project_id ↓ │ user_id ↓ │
├────────────────────────────────┤
│ 2       │ 101          │ 2         │
│ 5       │ 101          │ 3         │
│ 3       │ 102          │ 1         │
└────────────────────────────────┘
         │          │
         └──────────┴───── JOINS FROM PROJECT & USERS

┌──────────────────────────────────────────────┐
│           COMMENTS                           │
├──────────────────────────────────────────────┤
│ comment_id │ project_id ↓ │ user_id ↓ │ body │
├──────────────────────────────────────────────┤
│ 10         │ 101          │ 2         │ Cool!│
│ 15         │ 101          │ 3         │ Love │
│ 11         │ 102          │ 3         │ Wow! │
└──────────────────────────────────────────────┘
            │              │
            └──────────────┴───── JOINS FROM PROJECT & USERS
```

---

## Side-by-Side Comparison

### Before (Unnormalized - BAD)
```
| project_title | project_tags | user_email | community_name | like_ids | comment_bodies |
| "StudyBuddy" | "React, AI" | "alex@..." | "Code & Create" | "2,5,8" | "Cool!,Love" |
^                 ^             ^           ^                ^          ^
Lists in ONE      Lists in      One cell    One cell         Repeats    Repeats
cell (bad!)       ONE cell      (repeats)   (repeats)        user info  comment info
```

**Speed:** SLOW! 🐌 (Must check every row)
**Updates:** HARD! (Fix in 5 places to change one user's email)
**Space:** WASTEFUL! (Repeats data)

### After (3NF - GOOD)
```
USERS Table
| user_id | username | email |
| 1       | alex... | alex@... |

PROJECTS Table
| project_id | title | user_id | community_id |
| 101        | Study | 1       | 1            |

PROJECT_TAGS Table
| project_id | tag |
| 101        | React |
| 101        | AI |

LIKES Table
| like_id | project_id | user_id |
| 2       | 101        | 2       |

COMMENTS Table
| comment_id | project_id | user_id | body |
| 10         | 101        | 2       | Cool! |
```

**Speed:** FAST! ⚡ (Indexed lookups)
**Updates:** EASY! (Change once, everywhere updates)
**Space:** EFFICIENT! (No repeats)

---

## Normalization Checklist

### ✅ 1NF: Atomic Values
- [ ] No lists in cells (like "React, AI, MVP")
- [ ] No repeating groups (like "like_ids: 2,5,8")
- [ ] One value per cell

### ✅ 2NF: Depends on Entire Primary Key
- [ ] Non-key columns depend on the full primary key
- [ ] No partial dependencies
- [ ] (Usually automatic if you did 1NF correctly)

### ✅ 3NF: No Transitive Dependencies
- [ ] Non-key columns depend ONLY on the primary key
- [ ] Don't store data you can look up elsewhere
- [ ] If "A" depends on "B" and "B" is not the key, separate them

---

## Real Query Examples

### BEFORE (Unnormalized) - Hard to Query
```
-- "Find all React projects" 
-- PROBLEM: Have to search inside "React, AI, MVP" text!
SELECT * FROM ALL_DATA WHERE project_tags LIKE '%React%';

-- SLOW! Must scan every row and search for text
-- Returns: StudyBuddy App (even with extra stuff)
```

### AFTER (3NF) - Easy to Query
```
-- "Find all React projects"
-- FAST: Just look up the tag in PROJECT_TAGS!
SELECT DISTINCT p.project_id, p.title
FROM PROJECTS p
JOIN PROJECT_TAGS pt ON p.project_id = pt.project_id
WHERE pt.tag = 'React';

-- FASTER! Indexed lookup
-- Returns: Only StudyBuddy App (exact match)
```

---

## Summary: The Journey

| Stage | Data Quality | Example |
|-------|--------------|---------|
| **Start (Unnormalized)** | ❌ Messy | Lists in cells, repeating groups |
| **1NF** | ✓ Basic | Each cell has one value |
| **2NF** | ✓✓ Better | No partial key dependencies |
| **3NF** | ✓✓✓ Best | No transitive dependencies |

**Result:** Clean, fast, organized database! 🎉

---

**End of Normalization Process Document**
