# HobbyHub Documentation — Index & Overview

**Final Project Submission for FESE304 + FESE305**  
**Students:** [Your Team Name]  
**Date:** March 2025  
**Status:** Ready for Engineering Handoff

---

## 📋 Documentation Structure

This folder contains complete product and technical documentation for HobbyHub:

### 1️⃣ **[01_PRODUCT_REQUIREMENTS_DOCUMENT.md](01_PRODUCT_REQUIREMENTS_DOCUMENT.md)**
   - Problem statement & value proposition
   - Target users & business model
   - MVP features & user stories with acceptance criteria
   - Jobs-to-be-Done framework
   - Functional & Non-Functional Requirements
   - User experience & information architecture
   - User journey maps & wireframes
   - System architecture overview
   - Sequence diagrams & state transitions
   - Success metrics & KPIs

**Time:** 12-15 minutes of 30-minute presentation

---

### 2️⃣ **[02_DATABASE_DESIGN_DOCUMENT.md](02_DATABASE_DESIGN_DOCUMENT.md)**
   - Conceptual ERD (Entity-Relationship Diagram)
   - All 9 relational schemas with SQL
   - Relationships explained (1:N, M:N, self-referencing)
   - Normalization analysis (1NF, 2NF, 3NF)
   - Intentional denormalization rationale
   - 4 key SQL queries explained:
     * Feed query with GROUP BY
     * Collaborator discovery with subqueries
     * Challenge leaderboard with window functions
     * Unified feed with UNION
   - MongoDB strategy for notifications & logs
   - Redis caching strategy
   - Performance optimization plan
   - Security & privacy (GDPR)
   - Testing strategy (pgTAP + integration tests)
   - Database scaling plan

**Time:** 12-15 minutes of 30-minute presentation

---

### 3️⃣ **[03_TECHNICAL_IMPLEMENTATION_GUIDE.md](03_TECHNICAL_IMPLEMENTATION_GUIDE.md)**
   - Architecture diagrams
   - User registration flow
   - Like/unlike flow
   - Comment submission flow
   - Data model relationships
   - JOIN operation examples
   - SQL query patterns explained
   - Caching strategy with Redis
   - Testing checklist (frontend + backend + DB)
   - Common pitfalls & solutions
   - Deployment checklist

**Time:** 3 minutes (quick reference during Q&A)

---

## 🎯 Presentation Structure (30 Minutes)

### **Segment 1: Business & Product (8 minutes)**
1. Open with problem statement & 30-second elevator pitch
2. Show target users & pain points
3. Explain value proposition  
4. Demo business model (Free vs Premium)
5. Show 2-3 user journey maps

**Slides:** 5-7 slides with visuals

---

### **Segment 2: MVP & Requirements (6 minutes)**
1. List top 5 MVP features (MUST HAVE)
2. Walk through 2 critical user stories (US-01: Post Project, US-03: Challenge)
3. Show acceptance criteria for each
4. Quick mention of functional requirements (FR-01 through FR-12)

**Slides:** 4-5 slides with user story cards

---

### **Segment 3: System Architecture (4 minutes)**
1. Show high-level 3-tier architecture diagram
2. Explain Client → API → Database layers
3. Mention tech stack (React, Node.js, PostgreSQL, Redis, MongoDB)
4. Show one sequence diagram (project posting flow)

**Slides:** 3-4 slides with architecture visuals

---

### **Segment 4: Database Design (8 minutes)** 👈 **MOST CRITICAL**
1. Show conceptual ERD (4 main entities: USERS, PROJECTS, COMMUNITIES, LIKES)
2. Explain 3 key relationships:
   - USER posts many PROJECTS (1:N)
   - USER joins many COMMUNITIES (M:N via MEMBERSHIPS)
   - PROJECT receives many LIKES (M:N via LIKES table)
3. Walk through 2 SQL queries:
   - **Feed Query:** Join projects + users + communities, COUNT likes/comments, ORDER by popularity
   - **Leaderboard Query:** Use RANK() window function for challenge ranking
4. Mention denormalization: Why store tags as TEXT[] array instead of separate table
5. Show caching strategy: Redis cache on feed (2-min TTL)
6. Performance: Indexes on user_id, community_id, status, created_at

**Slides:** 6-8 slides with ERD, sample SQL, query plans

---

### **Segment 5: Q&A Defense (10 minutes)**
Expected tough questions:
- "Why PostgreSQL instead of MongoDB?" → Relational data, ACID transactions
- "How do you prevent duplicate likes?" → UNIQUE constraint + app-level check
- "What if a project is posted while user is viewing feed?" → Redis 2-min cache + live updates with WebSocket
- "How to scale to 100K users?" → Read replicas for SELECT queries
- "What about privacy?" → GDPR right-to-delete, bcrypt password hashing

**Prep:** Be ready to go deeper on any diagram or query

---

## 📊 Grading Breakdown (100 Points)

| Category | Points | What Graders Look For |
|---|---|---|
| **Big Picture & Requirements** | 15 | Problem solved? Users identified? MVP features clear? |
| **User Experience & Flow** | 10 | Journey maps make sense? Wireframes high-quality? |
| **Architecture & Logic** | 15 | System diagram clear? Sequence diagrams accurate? |
| **Data Modeling** | 20 | ERD complete? All entity relationships shown? |
| **DB Implementation** | 20 | SQL queries working? Indexes planned? Normalization correct? |
| **QA & Metrics** | 10 | Testing strategy solid? Success metrics defined? |
| **Delivery & Defense** | 10 | Clear presentation? Defended choices in Q&A? |

**Target Score:** 85+ (A range)

---

## 🚀 How to Use This Documentation

### **Before Presentation (1 week):**
1. Read all 3 docs start-to-finish
2. Create PowerPoint slides following the 5 segments above
3. Practice delivery (time each segment to fit 30 minutes)
4. Rehearse Q&A defense on database design

### **During Presentation (30 min):**
1. Keep docs closed (reference only if stuck)
2. Walk through slides talking naturally
3. Make eye contact, show confidence in design choices
4. Have diagrams visible on screen (not reading from documents)

### **During Q&A (10 min):**
1. Listen to full question before answering
2. Refer back to specific diagrams/queries in docs if needed
3. Be honest: "Good question, we considered that but chose X because..."
4. Show domain knowledge (normalization, indexing, transactions)

---

## 📱 Presentation Tips

✅ **DO:**
- Start with "Our problem: Students can't find hobby collaborators"
- Use simple language (explain technical choices in business terms)
- Show data flow with arrows and visuals
- Practice timing (aim for 27-28 min, not full 30)
- Be passionate about the product

❌ **DON'T:**
- Read directly from documents (seems unprepared)
- Use too many technical terms without explaining
- Go into database internals unless asked in Q&A
- Apologize for design choices (commit to decisions)
- Run over 30 minutes (cut content, not speed talk)

---

## 🔍 What Graders Will Ask

### Database-Focused Questions:
✓ "Walk us through this SQL query step-by-step"  
✓ "What happens if this constraint fails?"  
✓ "How do you ensure a user can only like a project once?"  
✓ "Why TEXT[] array instead of normalized table?"  

### Architecture Questions:
✓ "If you get 100K concurrent users, what breaks first?"  
✓ "How do you keep the feed fast?"  
✓ "What if two users like the same project at the same time?"  

### Business Questions:
✓ "Who's your real competitor?"  
✓ "How will you get the first 1,000 users?"  
✓ "What if users don't turn into premium creators?"  

---

## 📂 File Manifest

```
documentation/
├── README.md  (this file)
├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md  (12KB, 10 sections)
├── 02_DATABASE_DESIGN_DOCUMENT.md  (18KB, 10 sections)
├── 03_TECHNICAL_IMPLEMENTATION_GUIDE.md  (8KB, quick reference)
└── (Optional) Presentation Slides.pptx
```

---

## ✅ Submission Checklist

Before submitting to professors:

- [ ] All 3 markdown files in documentation/ folder
- [ ] PowerPoint slides follow 5-segment structure (30 min)
- [ ] ERD diagram included and clear
- [ ] At least 3 SQL queries shown with explanations
- [ ] Wireframes or screenshots of UI included
- [ ] No spelling errors or broken links
- [ ] Team member names on presentation
- [ ] Link to working prototype (React app) included
- [ ] High-level architecture diagram visible
- [ ] All functional requirements listed (FR-01 through FR-12)

---

## 🎓 College-Level Expectations

This documentation is written for **college engineering teams**, not enterprise. That means:

✅ **Appropriate Complexity:**
- 3-tier architecture (not microservices)
- PostgreSQL + MongoDB (2 storage layers)
- Basic caching with Redis
- Simple JWT authentication

❌ **NOT Expected:**
- GraphQL (REST APIs are fine)
- Kubernetes (AWS EC2 is sufficient)
- Multi-region failover
- Machine learning recommendations
- Deep machine learning

**Reality Check:** This is the scope a small startup would build in Months 1-3 after MVP, not a Google-scale system.

---

## 🤝 Team Collaboration Tips

**Divide work by expertise:**
- **Backend Dev** → Database Design + SQL queries
- **Frontend Dev** → Product Requirements + Wireframes  
- **PM/Analyst** → User stories + KPIs
- **Everyone** → Practice together 3x before presentation

**Practice together:**
- Day 1: Read docs silently, highlight key points
- Day 2: Each person owns 7-8 minutes, practice separately
- Day 3: Full rehearsal together, get timing right
- Day 4-5: Answer tough Q&A questions as a team

---

## 📞 Questions?

If stuck on anything:

1. **Database question?** → Re-read "Data Modeling" section in 02_DATABASE_DESIGN_DOCUMENT.md
2. **Business question?** → Check "JTBD" section in 01_PRODUCT_REQUIREMENTS_DOCUMENT.md
3. **Architecture question?** → Look at diagrams in 03_TECHNICAL_IMPLEMENTATION_GUIDE.md
4. **Presentation flow?** → Follow the 5-segment structure above

---

**Good luck with your presentation! 🚀**

Remember: Professors want to see that you understand **WHY** design choices were made, not just **WHAT** was built. Connect business problems → technical solutions → database design → success metrics.

You've got this! 💪
