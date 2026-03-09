// ─── Users ──────────────────────────────────────────────────────────── FR-01, FR-02, FR-12
export const USERS = [
  {
    id: 1, name: "Alex Chen", avatar: "AC", badge: "premium", major: "Computer Science", year: "3rd Year",
    skills: ["React", "Python", "UI/UX"], bio: "Building cool stuff. Looking for startup co-founders!",
    followers: 342, following: 156, coverHue: 220, avatarHue: 220
  },
  {
    id: 2, name: "Mia Torres", avatar: "MT", badge: "free", major: "Fine Arts", year: "2nd Year",
    skills: ["Illustration", "Procreate", "Figma"], bio: "Digital artist & visual storyteller. Open for collabs!",
    followers: 289, following: 143, coverHue: 320, avatarHue: 320
  },
  {
    id: 3, name: "Leo Park", avatar: "LP", badge: "premium", major: "Music Technology", year: "4th Year",
    skills: ["Ableton", "Sound Design", "Guitar"], bio: "Making beats and building audio apps.",
    followers: 512, following: 78, coverHue: 40, avatarHue: 40
  },
  {
    id: 4, name: "Sara Nguyen", avatar: "SN", badge: "free", major: "Game Design", year: "1st Year",
    skills: ["Unity", "C#", "Blender"], bio: "Indie game dev in progress. Let's build worlds together!",
    followers: 167, following: 234, coverHue: 140, avatarHue: 140
  },
  {
    id: 5, name: "James Wright", avatar: "JW", badge: "premium", major: "Photography", year: "2nd Year",
    skills: ["Lightroom", "Street Photography", "Editing"], bio: "Capturing life one frame at a time.",
    followers: 430, following: 91, coverHue: 190, avatarHue: 190
  },
];

// ─── Communities ──────────────────────────────────────────────────────── FR-04
export const COMMUNITIES = [
  {
    id: 1, name: "Code & Create", abbr: "C&C", hue: 220, members: 1240, tags: ["Web Dev", "Apps", "Startups"],
    desc: "A hub for developers, builders, and startup founders. Ship fast, learn faster.",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 2, name: "Art Studio", abbr: "ART", hue: 320, members: 890, tags: ["Digital Art", "Illustration", "Design"],
    desc: "For illustrators, painters, and designers sharing their visual creations.",
    coverUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://images.unsplash.com/photo-1560421683-6856fea585fe?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 3, name: "Music Lab", abbr: "MUS", hue: 40, members: 670, tags: ["Production", "Instruments", "Collab"],
    desc: "Producers, musicians, and audio engineers collaborating on sound.",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800",
    avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: 4, name: "Game Dev Hub", abbr: "GDH", hue: 140, members: 1050, tags: ["Unity", "Indie", "Design"],
    desc: "Indie game developers building and sharing their game projects."
  },
  {
    id: 5, name: "Startup Squad", abbr: "STS", hue: 270, members: 430, tags: ["Ideas", "MVP", "Founders"],
    desc: "Aspiring founders and entrepreneurs validating ideas and building MVPs."
  },
  {
    id: 6, name: "Photography", abbr: "PHO", hue: 190, members: 320, tags: ["DSLR", "Editing", "Portfolio"],
    desc: "Photographers sharing work, tips, and project feedback."
  },
];

// ─── Projects ────────────────────────────────────────────────────────── FR-03, FR-05, FR-06, FR-09
export const BASE_PROJECTS = [
  {
    id: 1, communityId: 1, user: USERS[0],
    title: "StudyBuddy App", desc: "AI-powered study planner that syncs with your class schedule and generates revision questions from your notes. Currently in beta with 200+ users.",
    tags: ["React", "AI", "Education"], likes: 87, comments: 14,
    imageHue: 220, imageLabel: "StudyBuddy", type: "startup", lookingFor: "Designer / UI-UX",
    isFeatured: true, createdAt: "2 days ago"
  },
  {
    id: 2, communityId: 2, user: USERS[1],
    title: "Campus Life Illustrations", desc: "A series of 12 illustrations capturing student life across four seasons. Open for print licensing and editorial use.",
    tags: ["Digital Art", "Print", "Illustration"], likes: 142, comments: 23,
    imageHue: 320, imageLabel: "Illustr.", type: "showcase", lookingFor: null,
    isFeatured: false, createdAt: "5 days ago"
  },
  {
    id: 3, communityId: 3, user: USERS[2],
    title: "LoFi Beat Pack Vol.2", desc: "30 royalty-free beats for studying, streaming, and content creation. Collab welcome for Vol.3 — DM me!",
    tags: ["Music", "LoFi", "Free"], likes: 203, comments: 41,
    imageHue: 40, imageLabel: "LoFi", type: "showcase", lookingFor: "Co-producer",
    isFeatured: true, createdAt: "1 week ago"
  },
  {
    id: 4, communityId: 4, user: USERS[3],
    title: "Pixel Dungeon – Indie Game", desc: "Prototype of my first indie game built in Unity with custom hand-drawn pixel assets. Currently 3 playable levels.",
    tags: ["Unity", "Indie", "RPG"], likes: 95, comments: 18,
    imageHue: 140, imageLabel: "Pixel", type: "startup", lookingFor: "Story Writer",
    isFeatured: false, createdAt: "3 days ago"
  },
  {
    id: 5, communityId: 1, user: USERS[3],
    title: "Campus Event Finder", desc: "A React Native app that aggregates all campus events in one place, with reminders and RSVPs.",
    tags: ["React Native", "Firebase", "Events"], likes: 61, comments: 9,
    imageHue: 195, imageLabel: "CampusEF", type: "startup", lookingFor: "Backend Developer",
    isFeatured: false, createdAt: "6 days ago"
  },
  {
    id: 6, communityId: 2, user: USERS[4],
    title: "Street Portraits Series", desc: "A photo essay documenting street life in 5 cities. Shot on a Fujifilm X-T4, edited in Lightroom.",
    tags: ["Photography", "Portrait", "Travel"], likes: 178, comments: 32,
    imageHue: 190, imageLabel: "Streets", type: "showcase", lookingFor: null,
    isFeatured: true, createdAt: "4 days ago"
  },
];

// ─── Challenges ───────────────────────────────────────────────────────── FR-08
export const CHALLENGES = [
  {
    id: 1, title: "Build a Mini App in 48hrs", communityId: 1, hue: 220,
    deadline: "3 days left", participants: 67, prize: "Featured Badge + 3 months Premium", desc: "Build any web or mobile app in 48 hours and share your GitHub link."
  },
  {
    id: 2, title: "Design a Student App UI", communityId: 2, hue: 320,
    deadline: "5 days left", participants: 43, prize: "Premium Month", desc: "Create a complete UI design for a student productivity app in Figma."
  },
  {
    id: 3, title: "Compose a 60-sec Jingle", communityId: 3, hue: 40,
    deadline: "7 days left", participants: 29, prize: "Studio Session Credit", desc: "Compose a 60-second original jingle for a fictional brand of your choice."
  },
];

// ─── Notifications ────────────────────────────────────────────────────── FR-10
export const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: "like", msg: "Mia Torres liked your project StudyBuddy App", time: "2 min ago", unread: true },
  { id: 2, type: "comment", msg: "Leo Park commented on your project", time: "15 min ago", unread: true },
  { id: 3, type: "follow", msg: "Sara Nguyen started following you", time: "1 hr ago", unread: true },
  { id: 4, type: "badge", msg: "You earned the 'First Project' badge!", time: "3 hrs ago", unread: false },
  { id: 5, type: "challenge", msg: "New challenge is live in Code & Create", time: "1 day ago", unread: false },
  { id: 6, type: "showcase", msg: "LoFi Beat Pack Vol.2 is Showcase of the Week!", time: "2 days ago", unread: false },
];
