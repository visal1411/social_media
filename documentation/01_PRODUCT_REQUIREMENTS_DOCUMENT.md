# HobbyHub — Product Requirements Document

**Project:** HobbyHub Social Platform for Hobby & Project Sharing  
**Classes:** FESE304 (Database Management System) | FESE305 (Software App Dev Studio)  
**Date:** March 2025  
**Status:** MVP Ready for Engineering Handoff

---

## 1. Product Overview

### 1.1 Problem Statement

Most social media platforms focus on viral content and trending posts, making it hard for young adults and college students to share their hobby projects—art, music, games, coding—without getting lost in the noise from big influencers. Additionally, finding potential project collaborators and startup co-founders within your campus community is nearly impossible on generic social platforms.

**Main Problems:**
- Personal projects get buried in everyone's feeds
- Hard to find people with the same interests on campus
- No special space for hobby groups
- Tough to get helpful feedback on your work

### 1.2 Value Proposition

**HobbyHub** is a dedicated social platform for students and hobbyists to:
- ✅ Share and showcase hobby projects in a distraction-free environment
- ✅ Discover collaborators and startup co-founders with matching skills
- ✅ Get constructive feedback from community members
- ✅ Grow niche creative communities and build personal credibility
- ✅ Participate in weekly challenges and showcase opportunities

### 1.3 Target Users

| User Persona | Characteristics | Key Need |
|---|---|---|
| **Art Students** | Digital/traditional artists, designers wanting feedback | Showcase work, find design collaborators |
| **Music Producers** | Beat makers, composers, producers looking for networks | Share beats, find vocalists/remixers |
| **Game Developers** | Indie devs, game designers, pixel artists | Find team members, showcase games |
| **Startup Seekers** | CS/Engineering students with ideas | Find co-founders and early team members |
| **Hobbyists** | Anyone exploring a new skill or hobby | Community, encouragement, feedback |

### 1.4 Business Model

| Plan | Price | Features |
|---|---|---|
| **Free** | $0/month | Post projects, join up to 3 communities, like & comment, enter challenges |
| **Creator (Premium)** | $5/month | Everything in Free + Verified badge, priority search, advanced editing, exclusive challenges, featured spotlight eligibility |

---

## 2. Scope & MVP

### 2.1 Jobs-to-be-Done (JTBD)

We use JTBD to focus on what users are actually trying to accomplish:

| What I'm doing | What I need | Why it matters | Success Measure |
|---|---|---|---|
| **Start a new hobby project** | Share it and get real feedback | Improve and stay motivated | Comments within 24hrs |
| **Need a collaborator** | Discover students with matching skills | Build something together quickly | Connection made within 48hrs |
| **Feel creatively stuck** | See weekly challenges & prompts | Push my creativity forward | Challenge submitted successfully |
| **Want recognition** | Be featured on Showcase of the Week | Grow my following and credibility | Profile followers increase > 10% |

### 2.2 User Stories & Acceptance Criteria

#### **US-01: Share a Project**
**As a** student with a coding project  
**I want to** share it with the HobbyHub community  
**So that** I can get feedback and find collaborators  

**Acceptance Criteria:**
- ✅ User can create a post with title (max 200 chars), description (max 2000 chars), up to 5 tags, and one image
- ✅ Post appears in the community feed within 5 seconds of submission
- ✅ Other users can like and comment on the project
- ✅ You get a notification when someone likes or comments on your project
- ✅ App shows a clear error message if title or description is missing

#### **US-02: Join Communities**
**As a** hobbyist interested in digital art  
**I want to** join communities that match my interests  
**So that** I can discover like-minded people and see relevant content  

**Acceptance Criteria:**
- ✅ User can browse all communities sorted by member count
- ✅ User can search communities by keyword
- ✅ User can join a community with one click
- ✅ Community appears in sidebar after joining
- ✅ User can leave a community at any time
- ✅ Free users limited to 3 memberships; premium users unlimited

#### **US-03: Participate in Challenges**
**As a** creator wanting visibility  
**I want to** participate in weekly challenges  
**So that** I stay motivated and grow my visibility  

**Acceptance Criteria:**
- ✅ Active challenges displayed on home dashboard with countdown
- ✅ User can submit an existing project as challenge entry with one click
- ✅ Leaderboard shows entries ranked by likes in real-time
- ✅ System prevents duplicate submissions for same challenge
- ✅ After deadline, top 3 entries featured in community announcements

#### **US-04: Find Collaborators**
**As a** student starting a startup  
**I want to** find other students with complementary skills  
**So that** I can recruit co-founders and team members  

**Acceptance Criteria:**
- ✅ User can search by name, skill, major
- ✅ Profile shows follower count, shared communities, past projects
- ✅ User can send connection request with one click
- ✅ Can view other user's projects
- ✅ User can follow/unfollow other creators

#### **US-05: Receive Feedback**
**As a** project creator  
**I want to** read comments and feedback on my work  
**So that** I can improve and iterate  

**Acceptance Criteria:**
- ✅ Comments appear on project page in real-time
- ✅ User can reply to comments (threaded)
- ✅ Comments are persistent across sessions
- ✅ User can delete own comments
- ✅ Creator receives notification of new comments

### 2.3 MVP Feature Set

Prioritized by business value and technical feasibility:

| # | Feature | Why It Matters | Priority |
|---|---|---|---|
| 1 | User registration & authentication | Identity foundation for all features | **MUST HAVE** |
| 2 | Browse & post projects | Core value delivery | **MUST HAVE** |
| 3 | Communities (join/leave) | Social graph & discovery | **MUST HAVE** |
| 4 | Like & comment system | Engagement feedback loop | **MUST HAVE** |
| 5 | Search & filter projects | Content discoverability | **MUST HAVE** |
| 6 | User profiles & follow system | Collaborator discovery | **MUST HAVE** |
| 7 | Weekly challenges | Recurring engagement driver | **SHOULD HAVE** |
| 8 | Showcase of the Week | Recognition & aspiration | **SHOULD HAVE** |
| 9 | Notifications | Engagement loop completeness | **SHOULD HAVE** |
| 10 | Premium badge display | Revenue generation signal | **COULD HAVE** |

---

## 3. Functional & Non-Functional Requirements

### 3.1 Functional Requirements (What the system MUST do)

| ID | Feature Area | Requirement | How We Test It |
|---|---|---|---|
| **FR-01** | User Login | Users register with email + password, log in with secure tokens | Test login returns valid token |
| **FR-02** | User Profile | Users edit username, bio, skills, avatar | Check profile updates save correctly |
| **FR-03** | Project Post | Users create, edit, delete project posts | Test create/read/update/delete endpoints |
| **FR-04** | Community | Users browse, search, join, leave communities | Membership table updates |
| **FR-05** | Likes | One like per user per project (prevent duplicates) | UNIQUE constraint enforcement |
| **FR-06** | Comments | Users add, edit, delete comments with threading | Comment CRUD tests |
| **FR-07** | Search | Search projects, users, communities by keyword or tag | Search returns relevant results |
| **FR-08** | Challenge | View active challenges, submit project entry | Challenge entry created in DB |
| **FR-09** | Showcase | Admin marks project as "Showcase of the Week" | Featured flag set in DB |
| **FR-10** | Notifications | Receive in-app alerts for likes, comments, follows | Notification record created |
| **FR-11** | Follow | Follow/unfollow other users | Follows table record verified |
| **FR-12** | Premium Badge | Premium users display verified badge, see extended limits | Plan_type checked on badge display |

### 3.2 Non-Functional Requirements (How WELL the system performs)

| Category | Requirement | Target | How We Measure |
|---|---|---|---|
| **Performance** | API Response Time | 95th percentile < 300ms under normal load | Load testing with k6 |
| **Scalability** | Concurrent Users | Handle 10,000 concurrent users without degradation | Stress testing |
| **Security** | Password Protection | All passwords are encrypted super strong | Security check |
| **Security** | Login Sessions | Login sessions expire after 7 days | Test login expiration |
| **Availability** | Uptime | 99.5% uptime SLA | Monitoring alerts |
| **Works on All Devices** | Mobile Responsive | Works fine on phones, tablets, and large screens | Test on different devices |
| **Easy to Use** | Accessibility | All buttons and text are easy to read for everyone | Check with accessibility tools |
| **Easy to Update** | Code Quality | All code has clear comments; more than 80% tested | Test coverage reports |
| **Privacy** | Data Protection | Users can download their data or delete their account | Test delete feature |

---

## 4. User Experience & Information Architecture

### 4.1 Information Architecture

The application uses **7 main navigation pages** for flat, fast navigation (max 2 taps to any feature):

```
┌─────────────────────────────────────────────────┐
│                    HOBBYHUB                      │
├─────────────────────────────────────────────────┤
│ 🏠 HOME      │ 🌐 COMMUNITIES  │ 📂 PROJECTS    │
│ ⚡ CHALLENGES│ 🤝 FIND PEOPLE  │ 🔔 NOTIFS      │
│ 👤 MY PROFILE                                   │
└─────────────────────────────────────────────────┘
```

| Page | Purpose | Key Content |
|---|---|---|
| **🏠 Home** | Personalized feed | Projects from joined communities, active challenges, Showcase of Week |
| **🌐 Communities** | Discover & join groups | Browse all communities, search, join/leave, member counts |
| **📂 Projects** | Browse all content | Filter by type, sort by likes/date, create new project |
| **⚡ Challenges** | Weekly contests | View active challenges, leaderboard, submit entry |
| **🤝 Find People** | Discover collaborators | Search by name/skill, view profiles, connect/follow |
| **🔔 Notifications** | Stay updated | Likes, comments, follows, challenge results |
| **👤 My Profile** | Personal hub | Edit profile, view own projects, follower stats |

### 4.2 User Journey Map

**Persona: Alex Chen, 3rd-year CS student, wants to find co-founders for a startup idea.**

```
STAGE 1: DISCOVER          STAGE 2: SIGN UP         STAGE 3: EXPLORE
┌─────────────────┐       ┌─────────────────┐      ┌──────────────────┐
│ Sees HobbyHub   │──────▶│ Creates account │──────▶│ Browses "Code &  │
│ link in Discord │       │ Sets hobbies    │      │ Create" community│
│                 │       │                 │      │                  │
│ Emotion: 😐    │       │ Emotion: 😐     │      │ Emotion: 😐      │
│ Curious        │       │ Hopeful         │      │ Interested       │
└─────────────────┘       └─────────────────┘      └──────────────────┘
                                                            │
                                                            │
STAGE 4: POST IDEA        STAGE 5: CONNECT & SUCCEED
┌────────────────────┐    ┌──────────────────────────┐
│ Posts StudyBuddy   │───▶│ Receives comments within │
│ app idea + tags    │    │ 24hrs, connects with Mia│
│                    │    │ (designer)               │
│ Emotion: 😊 Excited│    │                          │
│ Action taken      │    │ Emotion: 😍 Grateful    │
└────────────────────┘    │ Problem solved!          │
                          └──────────────────────────┘
```

---

## 5. System Architecture

### 5.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                   (React 18 Web App)                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                              │
│  (Node.js + Express, JWT Auth, Input Validation)           │
├─────────────────────────────────────────────────────────────┤
│ Routes: /auth, /users, /projects, /communities, /etc        │
└────────────┬─────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────────┐   ┌────────────────────┐
│ PostgreSQL   │   │ MongoDB (No-SQL)   │
│ (Relational) │   │ - Notifications    │
│ - Users      │   │ - Media metadata   │
│ - Projects   │   │ - Activity logs    │
│ - Communities│   └────────────────────┘
└──────────────┘
    ▲
    │ Cache Layer
    ▼
┌─────────────────┐
│   Redis Cache   │
│ - Feed cache    │
│ - Session tokens│
│ - Leaderboards  │
└─────────────────┘
```

### 5.2 Key Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, TailwindCSS | Fast, responsive web app |
| **API** | Node.js, Express.js | Server that handles all requests and responses |
| **Login** | Secure Tokens | Safe login system without storing sessions on server|
| **Database** | PostgreSQL | Main database storing all important data (tables) |
| **Extra Storage** | MongoDB | Database for notifications and activity records |
| **Cache** | Redis | Session & feed caching |
| **Cloud** | AWS (EC2, RDS, ElastiCache) | Hosting & infrastructure |

---

## 6. API Flow & Sequence Diagrams

### 6.1 Posting a Project (Sequence Diagram)

```
User Browser          React App            API Gateway         PostgreSQL
    │                   │                      │                   │
    │─(1) Fill form──▶│                        │                   │
    │  and Click      │                        │                   │
    │  Submit         │                        │                   │
    │                 │─(2) POST /api/────────▶│                   │
    │                 │  projects + JWT        │                   │
    │                 │  + form data           │                   │
    │                 │                        │─(3) Validate JWT──│
    │                 │                        │                   │
    │                 │                        │─(4) INSERT INTO───▶│
    │                 │                        │  projects table    │
    │                 │                        │                   │
    │                 │                        │◀─(5) Return ID─────│
    │                 │                        │  + Project data    │
    │                 │◀(6) Return 201 Created─│                   │
    │                 │  + project JSON        │                   │
    │◀(7) Update────│                        │                   │
│  feed with          │                        │                   │
│  new project       │                        │                   │
│                   │                        │                   │
```

### 6.2 Liking a Project

```
User Clicks              API Gateway         PostgreSQL          Redux Store
"Like" Button                │                   │                   │
        │                     │                   │                   │
        │─ POST /likes ──────▶│                   │                   │
        │   projectId=5       │                   │                   │
        │   userId=1          │─ INSERT INTO─────▶│                   │
        │                     │   likes table     │                   │
        │                     │   (user,project)  │                   │
        │                     │                   │                   │
        │                     │◀─ UNIQUE          │                   │
        │                     │  Constraint OK    │                   │
        │                     │                   │                   │
        │◀─ 201 Created ──────│                   │                   │
        │   {likes: 88}       │                   │                   │
        │                     │                   │  ◀─ Update────────│
        │ (Heart Icon         │                   │    Like Count     │
        │  turns red)         │                   │                   │
```

---

## 7. Entity State Transitions

### 7.1 Project Entity Lifecycle

```
                    ┌─────────────────────┐
                    │   Project Created   │
                    │  (Draft state)      │
                    └──────────┬──────────┘
                              │
                  User clicks "Publish"
                              │
                              ▼
                    ┌─────────────────────┐
                    │    PUBLISHED        │ ◀─── Visible on feed
                    │ (Main state)        │      (Can receive likes,
                    └──────────┬──────────┘       comments, challenge
                              │                   entries)
                    ┌─────────┴──────────┐
                    │                    │
         Admin marks featured    User submits to
              or challenge entry        challenge
                    │                    │
                    ▼                    ▼
          ┌──────────────────┐ ┌──────────────────┐
          │    FEATURED      │ │  CHALLENGE_ENTRY │
          │ (Showcase Week)  │ │ (In competition) │
          └──────────────────┘ └──────────────────┘
                    │                    │
         Both can return to              │
         PUBLISHED or move to            │
              ARCHIVED                   │
                    │◀───────────────────┘
                    │
          User/Admin archives
                    │
                    ▼
          ┌─────────────────────┐
          │    ARCHIVED         │ ◀─── Hidden from feed
          │ (Can restore)       │       (Read-only)
          └─────────────────────┘
```

---

## 8. Presentation & Wireframes

### 8.1 Home Feed Page Layout

```
┌─────────────────────────────────────────────────────────┐
│       HOBBYHUB  🎯                         [User Menu]  │
├─────────────────────────────────────────────────────────┤
│ 🏠 HOME  │ 🌐 COMMUNITIES  │ 📂 PROJECTS ...            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Welcome back, Alex! 👋                                │
│                                                         │
│  ⚡ ACTIVE CHALLENGE: Build a Mini App in 48hrs       │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 67 participants · 3 days left                  │  │
│  │                 [JOIN NOW] or [JOINED ✅]      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  📂 RECENT PROJECTS                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ StudyBuddy   │  │ Campus Life  │  │ LoFi Beat    │ │
│  │ App          │  │ Illustrations│  │ Pack Vol.2   │ │
│  │ by Alex Chen │  │ by Mia Torres│  │ by Leo Park  │ │
│  │ 📱           │  │ 🖼️           │  │ 🎧           │ │
│  │ React, AI, … │  │ Digital Art… │  │ Music, LoFi… │ │
│  │              │  │              │  │              │ │
│  │ ❤️ 87  💬 14 │  │ ❤️ 142 💬 23 │  │ ❤️ 203 💬 41 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  [Load More Projects...]                              │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Project Detail Page with Comments

```
┌───────────────────────────────────────────┐
│ StudyBuddy App                            │
│ by Alex Chen · Code & Create community    │
│                                           │
│ 📱 [PROJECT IMAGE HERE]                  │
│                                           │
│ AI-powered study planner that syncs      │
│ with your class schedule. Looking for    │
│ a designer to join!                      │
│                                           │
│ Tags: React, AI, Education               │
│                                           │
│ ❤️ 87  💬 Comment  🤝 Looking for: UI-UX │
│                                           │
├───────────────────────────────────────────┤
│ 💬 COMMENTS (14)                          │
├───────────────────────────────────────────┤
│                                           │
│ 🧑 Mia Torres · 2 hours ago              │
│ "This looks amazing! I'd love to         │
│  help with the UI/UX design 🎨"          │
│                                           │
│ 🧑 Sara Nguyen · 5 hours ago             │
│ "How are you handling data sync?"        │
│                                           │
│ [TEXT INPUT: Add a comment...]           │
│ [Post Button]                            │
│                                           │
└───────────────────────────────────────────┘
```

### 8.3 Find People Page

```
┌─────────────────────────────────────────┐
│ Find People 🤝                          │
├─────────────────────────────────────────┤
│ [Search by name or skill...]            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Mia Torres                       │ │
│ │ NYC · Fine Arts · 2nd Year          │ │
│ │ ★ Free Creator                      │ │
│ │ Digital artist & visual story...    │ │
│ │ Skills: Illustration, Procreate...  │ │
│ │                                     │ │
│ │ 👥 289 followers  🔗 143 following  │ │
│ │                                     │ │
│ │ [👋 Connect] [⭐ Follow]            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Leo Park                         │ │
│ │ Seoul · Music Tech · 4th Year       │ │
│ │ ★★ Creator (Premium)                │ │
│ │ Making beats and building audio...  │ │
│ │ Skills: Ableton, Sound Design...    │ │
│ │                                     │ │
│ │ 👥 512 followers  🔗 78 following   │ │
│ │                                     │ │
│ │ [✅ Connected] [⭐ Following]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Success Metrics & KPIs

After launch, we track these metrics weekly to measure product-market fit:

| KPI | Target (3 months) | Why It Matters |
|---|---|---|
| **DAU / MAU Ratio** | > 30% | Stickiness (industry avg: 20%) |
| **Projects Posted / Week** | > 500 | Content creation velocity |
| **Connection Request Rate** | > 15% of active users | Platform enabling real collaborations |
| **Free → Premium Conversion** | > 5% at 6 months | Revenue & sustainability |
| **Avg Session Duration** | > 8 minutes | User engagement quality |
| **Challenge Participation** | > 20% of active users | Engagement loop success |
| **Feed Query Latency (p95)** | < 300ms | Technical performance health |

---

## 10. UML Diagrams

### 10.1 Use Case Diagram

Shows what users can do in the system:

```
                    HobbyHub System
    ┌─────────────────────────────────────────────┐
    │                                             │
    │   ○ Browse Projects                         │
    │   ○ Search Projects/Users                   │
    │   ○ View Project Details                    │
    │                                             │
    │   AUTHENTICATION                            │
    │   ○ Sign Up                                 │
    │   ○ Log In                                  │
    │   ○ Log Out                                 │
    │                                             │
    │   PROJECT MANAGEMENT                        │
    │   ○ Create Project                          │
    │   ○ Edit Project                            │
    │   ○ Delete Project                          │
    │   ○ Upload Image                            │
    │                                             │
    │   SOCIAL FEATURES                           │
    │   ○ Like Project                            │
    │   ○ Comment on Project                      │
    │   ○ Reply to Comment                        │
    │   ○ Follow User                             │
    │   ○ Unfollow User                           │
    │                                             │
    │   COMMUNITY FEATURES                        │
    │   ○ Browse Communities                      │
    │   ○ Join Community                          │
    │   ○ Leave Community                         │
    │   ○ View Community Feed                     │
    │                                             │
    │   CHALLENGES                                │
    │   ○ View Active Challenges                  │
    │   ○ Submit Project to Challenge             │
    │   ○ View Leaderboard                        │
    │                                             │
    │   PROFILE                                   │
    │   ○ Edit Profile                            │
    │   ○ View Own Projects                       │
    │   ○ View Followers/Following                │
    │   ○ Upgrade to Premium      ─────┐         │
    │                                   │         │
    └───────────────────────────────────┼─────────┘
                                        │
    👤 User (Student/Hobbyist)          │
        │                               │
        │ includes                      │
        ├── Guest User                  │
        │   (limited access)            │
        │                               │
        └── Premium User                │
            (all features + extras) <───┘


    👤 Admin User
        │
        ├── Create Challenges
        ├── Feature Projects
        ├── Manage Communities
        └── View Analytics
```

---

### 10.2 Activity Diagram - Posting a Project

Shows the step-by-step flow when a user posts a project:

```
    START
      │
      ▼
   ┌──────────────┐
   │ User clicks  │
   │ "New Project"│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────┐
   │ Check: Logged   │
   │ in?             │
   └─────┬───────────┘
         │
    ┌────┴────┐
    │         │
   NO        YES
    │         │
    ▼         ▼
┌───────┐  ┌─────────────────┐
│Redirect│  │ Show Create     │
│to Login│  │ Project Form    │
└───────┘  └────────┬─────────┘
    │               │
    │               ▼
    │        ┌──────────────┐
    │        │ User fills:  │
    │        │ - Title      │
    │        │ - Description│
    │        │ - Tags       │
    │        │ - Image      │
    │        │ - Community  │
    │        └──────┬───────┘
    │               │
    │               ▼
    │        ┌──────────────────┐
    │        │ Click "Submit"   │
    │        └──────┬───────────┘
    │               │
    │               ▼
    │        ┌──────────────────┐
    │        │ Validate Form    │
    │        │ - Title filled?  │
    │        │ - Description?   │
    │        └──────┬───────────┘
    │               │
    │          ┌────┴────┐
    │          │         │
    │        FAIL       PASS
    │          │         │
    │          ▼         ▼
    │    ┌─────────┐  ┌────────────────┐
    │    │ Show    │  │ Upload image   │
    │    │ Error   │  │ to server      │
    │    └────┬────┘  └────────┬───────┘
    │         │                │
    │         └────────┐       ▼
    │                  │  ┌────────────────┐
    │                  │  │ Save project   │
    │                  │  │ to database    │
    │                  │  └────────┬───────┘
    │                  │           │
    │                  │           ▼
    │                  │  ┌────────────────┐
    │                  │  │ Update cache   │
    │                  │  │ (feed refresh) │
    │                  │  └────────┬───────┘
    │                  │           │
    │                  │           ▼
    │                  │  ┌────────────────┐
    │                  │  │ Show success   │
    │                  │  │ "Project posted│
    │                  │  │    ✅"         │
    │                  │  └────────┬───────┘
    │                  │           │
    └──────────────────┴───────────┘
                       │
                       ▼
                     END
```

---

### 10.3 Activity Diagram - Like/Unlike Flow

```
    START: User clicks ❤️
      │
      ▼
   ┌──────────────┐
   │ Check: User  │
   │ logged in?   │
   └──────┬───────┘
          │
     ┌────┴────┐
     │         │
    NO        YES
     │         │
     ▼         ▼
┌────────┐  ┌─────────────────┐
│Redirect│  │ Query database: │
│to Login│  │ Already liked?  │
└────────┘  └────────┬─────────┘
              ┌──────┴────────┐
              │               │
            YES              NO
              │               │
              ▼               ▼
    ┌──────────────┐   ┌──────────────┐
    │ UNLIKE ACTION│   │ LIKE ACTION  │
    │              │   │              │
    │ DELETE FROM  │   │ INSERT INTO  │
    │ likes table  │   │ likes table  │
    └──────┬───────┘   └──────┬───────┘
           │                  │
           └────────┬─────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Update cache    │
           │ (like count)    │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Send response   │
           │ to frontend     │
           └────────┬────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Update UI:      │
           │ - Heart icon    │
           │ - Like count    │
           └────────┬────────┘
                    │
                    ▼
                   END
```

---

### 10.4 Sequence Diagram - User Registration Flow

```
User            Browser         API Server      Database        Email Service
 │                 │                 │              │                 │
 │ Fill form       │                 │              │                 │
 │────────────────>│                 │              │                 │
 │                 │                 │              │                 │
 │ Click Submit    │                 │              │                 │
 │────────────────>│                 │              │                 │
 │                 │                 │              │                 │
 │                 │ POST /signup    │              │                 │
 │                 │ {email,pass}    │              │                 │
 │                 │────────────────>│              │                 │
 │                 │                 │              │                 │
 │                 │                 │ Check email  │                 │
 │                 │                 │ unique?      │                 │
 │                 │                 │─────────────>│                 │
 │                 │                 │              │                 │
 │                 │                 │<─────────────│                 │
 │                 │                 │ OK / UNIQUE  │                 │
 │                 │                 │              │                 │
 │                 │                 │ Hash password│                 │
 │                 │                 │ (bcrypt)     │                 │
 │                 │                 │              │                 │
 │                 │                 │ INSERT user  │                 │
 │                 │                 │─────────────>│                 │
 │                 │                 │              │                 │
 │                 │                 │<─────────────│                 │
 │                 │                 │ user_id: 123 │                 │
 │                 │                 │              │                 │
 │                 │                 │ Create JWT   │                 │
 │                 │                 │ token        │                 │
 │                 │                 │              │                 │
 │                 │                 │ Send welcome email              │
 │                 │                 │──────────────────────────────>│
 │                 │                 │              │                 │
 │                 │<────────────────│              │                 │
 │                 │ 201 Created     │              │                 │
 │                 │ {token, user}   │              │                 │
 │                 │                 │              │                 │
 │<────────────────│                 │              │                 │
 │ Show dashboard  │                 │              │                 │
 │ (logged in ✅)  │                 │              │                 │
```

---

### 10.5 Sequence Diagram - Challenge Submission

```
User         Browser      API Server    Projects DB   Challenges DB   Cache
 │              │              │              │              │          │
 │ Browse       │              │              │              │          │
 │ active       │              │              │              │          │
 │ challenges   │              │              │              │          │
 │─────────────>│              │              │              │          │
 │              │              │              │              │          │
 │              │ GET /challenges/active      │              │          │
 │              │─────────────>│              │              │          │
 │              │              │              │              │          │
 │              │              │ SELECT * WHERE ends_at > NOW()         │
 │              │              │──────────────────────────>│            │
 │              │              │              │              │          │
 │              │              │<────────────────────────────│          │
 │              │              │ [Challenge list]            │          │
 │              │              │              │              │          │
 │              │<─────────────│              │              │          │
 │              │ 200 OK       │              │              │          │
 │<─────────────│ [Challenges] │              │              │          │
 │              │              │              │              │          │
 │ Select       │              │              │              │          │
 │ project      │              │              │              │          │
 │ & submit     │              │              │              │          │
 │─────────────>│              │              │              │          │
 │              │              │              │              │          │
 │              │ POST /challenges/801/submit │              │          │
 │              │ {project_id: 101}           │              │          │
 │              │─────────────>│              │              │          │
 │              │              │              │              │          │
 │              │              │ Check: project exists?      │          │
 │              │              │─────────────>│              │          │
 │              │              │<─────────────│              │          │
 │              │              │ YES          │              │          │
 │              │              │              │              │          │
 │              │              │ Check: already submitted?   │          │
 │              │              │──────────────────────────>│            │
 │              │              │              │              │          │
 │              │              │<────────────────────────────│          │
 │              │              │ NO (good!)   │              │          │
 │              │              │              │              │          │
 │              │              │ INSERT challenge_entry      │          │
 │              │              │──────────────────────────>│            │
 │              │              │              │              │          │
 │              │              │ Invalidate leaderboard cache│          │
 │              │              │──────────────────────────────────────>│
 │              │              │              │              │          │
 │              │<─────────────│              │              │          │
 │              │ 201 Created  │              │              │          │
 │              │ "Submitted!" │              │              │          │
 │<─────────────│              │              │              │          │
 │ Show success │              │              │              │          │
 │ message ✅   │              │              │              │          │
```

---

### 10.6 Class Diagram (Domain Model)

Shows the main objects and their relationships:

```
┌─────────────────────────────┐
│          User               │
├─────────────────────────────┤
│ - user_id: int              │
│ - username: string          │
│ - email: string             │
│ - password_hash: string     │
│ - bio: text                 │
│ - plan_type: string         │
│ - is_verified: boolean      │
├─────────────────────────────┤
│ + register()                │
│ + login()                   │
│ + updateProfile()           │
│ + follow(user_id)           │
│ + unfollow(user_id)         │
└──────────┬──────────────────┘
           │ 1
           │ posts
           │ *
           ▼
┌─────────────────────────────┐
│         Project             │
├─────────────────────────────┤
│ - project_id: int           │
│ - title: string             │
│ - description: text         │
│ - tags: array               │
│ - image_url: string         │
│ - status: string            │
│ - created_at: timestamp     │
├─────────────────────────────┤
│ + create()                  │
│ + edit()                    │
│ + delete()                  │
│ + publish()                 │
│ + addToChallenge()          │
└──────────┬──────────────────┘
           │ *
           │ belongs to
           │ 1
           ▼
┌─────────────────────────────┐
│        Community            │
├─────────────────────────────┤
│ - community_id: int         │
│ - name: string              │
│ - description: text         │
│ - icon: string              │
│ - member_count: int         │
├─────────────────────────────┤
│ + create()                  │
│ + addMember(user_id)        │
│ + removeMember(user_id)     │
└─────────────────────────────┘

┌─────────────────────────────┐
│          Like               │
├─────────────────────────────┤
│ - like_id: int              │
│ - user_id: int              │
│ - project_id: int           │
│ - created_at: timestamp     │
├─────────────────────────────┤
│ + add()                     │
│ + remove()                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│         Comment             │
├─────────────────────────────┤
│ - comment_id: int           │
│ - body: text                │
│ - parent_id: int (nullable) │
│ - created_at: timestamp     │
├─────────────────────────────┤
│ + create()                  │
│ + edit()                    │
│ + delete()                  │
│ + reply()                   │
└─────────────────────────────┘

┌─────────────────────────────┐
│        Challenge            │
├─────────────────────────────┤
│ - challenge_id: int         │
│ - title: string             │
│ - starts_at: timestamp      │
│ - ends_at: timestamp        │
│ - prize: string             │
├─────────────────────────────┤
│ + create()                  │
│ + submitEntry(project_id)   │
│ + getLeaderboard()          │
│ + close()                   │
└─────────────────────────────┘
```

---

### 10.7 State Diagram - Project Lifecycle

Shows different states a project can be in:

```
                 ┌──────────────┐
          ┌──────│ DRAFT        │◄──────┐
          │      │ (Initial)    │       │
          │      └──────┬───────┘       │
          │             │               │
          │   [User clicks "Publish"]   │
          │             │               │
          │             ▼               │
          │      ┌──────────────┐       │
          │      │ PUBLISHED    │       │
          │      │ (Live)       │       │
          │      └──────┬───────┘       │
          │             │               │
          │       ┌─────┴─────┐         │
          │       │           │         │
          │   [Admin          │         │
          │   features]   [Challenge]   │
          │       │           │         │
          ▼       ▼           ▼         │
    ┌─────────┐ ┌─────────┐ ┌─────────┐│
    │ ARCHIVED│ │FEATURED │ │COMPETING││
    │ (Hidden)│ │(Showcase│ │ (Entry) ││
    └─────────┘ └─────────┘ └─────────┘│
          │       │           │         │
          │       └───────┬───┘         │
          │               │             │
          │        [Time passes/        │
          │         Admin action]       │
          │               │             │
          └───────────────┴─────────────┘
```

---

## 11. Product Roadmap (Future Phases)

### Phase 2 (3 months post-launch)
- Direct messaging between users
- Portfolio builder for showcasing best projects
- Email digest of trending projects

### Phase 3 (6 months post-launch)
- Mobile app (iOS/Android)
- Live streams during launch events
- Marketplace for paid commissions

### Phase 4 (12+ months)
- AI-powered project recommendations
- Virtual meetups & collaboration rooms
- Internship & hiring board for companies

---

**End of PRD Document**
