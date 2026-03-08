export const USERS = [
  { id: 1, name: "Alex Chen", avatar: "AC", badge: "premium", major: "Computer Science", year: "3rd Year", skills: ["React", "Python", "UI/UX"], bio: "Building cool stuff. Looking for startup co-founders!", hobbies: ["Coding", "Gaming"], followers: 342, following: 156 },
  { id: 2, name: "Mia Torres", avatar: "MT", badge: "free", major: "Fine Arts", year: "2nd Year", skills: ["Illustration", "Procreate", "Figma"], bio: "Digital artist & visual storyteller. Open for collabs!", hobbies: ["Art", "Music"], followers: 289, following: 143 },
  { id: 3, name: "Leo Park", avatar: "LP", badge: "premium", major: "Music Technology", year: "4th Year", skills: ["Ableton", "Sound Design", "Guitar"], bio: "Making beats and building audio apps.", hobbies: ["Music", "Coding"], followers: 512, following: 78 },
  { id: 4, name: "Sara Nguyen", avatar: "SN", badge: "free", major: "Game Design", year: "1st Year", skills: ["Unity", "C#", "Blender"], bio: "Indie game dev in progress. Let's build worlds together!", hobbies: ["Gaming", "Art"], followers: 167, following: 234 },
];

export const COMMUNITIES = [
  { id: 1, name: "Code & Create", icon: "💻", members: 1240, color: "#6366f1", tags: ["Web Dev", "Apps", "Startups"] },
  { id: 2, name: "Art Studio", icon: "🎨", members: 890, color: "#ec4899", tags: ["Digital Art", "Illustration", "Design"] },
  { id: 3, name: "Music Lab", icon: "🎵", members: 670, color: "#f59e0b", tags: ["Production", "Instruments", "Collab"] },
  { id: 4, name: "Game Dev Hub", icon: "🎮", members: 1050, color: "#10b981", tags: ["Unity", "Indie", "Design"] },
  { id: 5, name: "Startup Squad", icon: "🚀", members: 430, color: "#8b5cf6", tags: ["Ideas", "MVP", "Founders"] },
  { id: 6, name: "Photography", icon: "📸", members: 320, color: "#06b6d4", tags: ["DSLR", "Editing", "Portfolio"] },
];

export const BASE_PROJECTS = [
  { id: 1, user: USERS[0], title: "StudyBuddy App", desc: "AI-powered study planner that syncs with your class schedule. Looking for a designer to join!", tags: ["React", "AI", "Education"], likes: 87, comments: 14, image: "📱", community: "Code & Create", type: "startup", lookingFor: "Designer / UI-UX" },
  { id: 2, user: USERS[1], title: "Campus Life Illustrations", desc: "A series of 12 illustrations capturing student life. Open for print licensing!", tags: ["Digital Art", "Print"], likes: 142, comments: 23, image: "🖼️", community: "Art Studio", type: "showcase", lookingFor: null },
  { id: 3, user: USERS[2], title: "LoFi Beat Pack Vol.2", desc: "30 royalty-free beats for studying. Download free! Collab welcome for Vol.3.", tags: ["Music", "LoFi", "Free"], likes: 203, comments: 41, image: "🎧", community: "Music Lab", type: "showcase", lookingFor: "Co-producer" },
  { id: 4, user: USERS[3], title: "Pixel Dungeon – Indie Game", desc: "Prototype of my first indie game! Unity + hand-drawn assets. Need a story writer!", tags: ["Unity", "Indie", "RPG"], likes: 95, comments: 18, image: "🕹️", community: "Game Dev Hub", type: "startup", lookingFor: "Story Writer" },
];

export const CHALLENGES = [
  { id: 1, title: "Build a Mini App in 48hrs", icon: "⚡", deadline: "3 days left", participants: 67, prize: "Featured Badge", community: "Code & Create" },
  { id: 2, title: "Design a Student App UI", icon: "🎨", deadline: "5 days left", participants: 43, prize: "Premium Month", community: "Art Studio" },
  { id: 3, title: "Compose a 60-sec Jingle", icon: "🎵", deadline: "7 days left", participants: 29, prize: "Featured Badge", community: "Music Lab" },
];

export const DEFAULT_NOTIFICATIONS = [
  { id: 1, icon: "❤️", msg: "Mia Torres liked your project StudyBuddy App", time: "2 min ago", unread: true },
  { id: 2, icon: "💬", msg: "Leo Park commented on your project", time: "15 min ago", unread: true },
  { id: 3, icon: "🤝", msg: "Sara Nguyen wants to connect with you", time: "1 hr ago", unread: true },
  { id: 4, icon: "🏆", msg: "You earned the 'First Project' badge!", time: "3 hrs ago", unread: false },
  { id: 5, icon: "⚡", msg: "New challenge is now live", time: "1 day ago", unread: false },
];
