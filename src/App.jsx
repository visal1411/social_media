import { useState, useEffect } from "react";
import { USERS, COMMUNITIES, BASE_PROJECTS, CHALLENGES, DEFAULT_NOTIFICATIONS } from "./data/mockData";
import { theme } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // noop
    }
  }, [key, state]);

  return [state, setState];
}

const Badge = ({ type }) => (
  <span style={{
    background: type === "premium" ? "linear-gradient(135deg,#7c6df5,#ec4899)" : "#2e2e3e",
    color: type === "premium" ? "#fff" : theme.muted,
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    letterSpacing: 0.5, textTransform: "uppercase"
  }}>{type === "premium" ? "★ Creator" : "Free"}</span>
);

const Tag = ({ label, color }) => (
  <span style={{
    background: color ? color + "22" : "#7c6df522",
    color: color || theme.accentLight,
    border: `1px solid ${color ? color + "44" : "#7c6df544"}`,
    fontSize: 11, padding: "2px 10px", borderRadius: 20, fontWeight: 600
  }}>{label}</span>
);

const Avatar = ({ initials, size = 40, gradient = "linear-gradient(135deg,#7c6df5,#ec4899)" }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: gradient, display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, color: "#fff", fontSize: size * 0.35, flexShrink: 0
  }}>{initials}</div>
);

const Button = ({ children, primary, small, onClick = () => {}, style = {} }) => (
  <button onClick={onClick} style={{
    background: primary ? "linear-gradient(135deg,#7c6df5,#6357e8)" : "transparent",
    border: primary ? "none" : `1px solid ${theme.border}`,
    color: primary ? "#fff" : theme.muted,
    padding: small ? "6px 14px" : "10px 22px",
    borderRadius: 10, fontWeight: 700,
    fontSize: small ? 12 : 14, cursor: "pointer",
    transition: "all 0.2s", ...style
  }}>{children}</button>
);

const navItems = [
  { icon: "🏠", label: "Home", key: "home" },
  { icon: "🌐", label: "Communities", key: "communities" },
  { icon: "📂", label: "Projects", key: "projects" },
  { icon: "⚡", label: "Challenges", key: "challenges" },
  { icon: "🤝", label: "Find People", key: "people" },
  { icon: "🔔", label: "Notifications", key: "notifs" },
  { icon: "👤", label: "My Profile", key: "profile" },
];

function Sidebar({ active, setActive, isMobile, onLogout }) {
  if (isMobile) return null;
  return (
    <div style={{
      width: 220, background: theme.surface, borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0,
      position: "sticky", top: 0, height: "100vh"
    }}>
      <div style={{ padding: "0 24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7c6df5,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎯</div>
          <span style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: -0.5 }}>HobbyHub</span>
        </div>
      </div>
      {navItems.map(item => (
        <button key={item.key} onClick={() => setActive(item.key)} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "11px 24px", border: "none", cursor: "pointer",
          background: active === item.key ? theme.accent + "22" : "transparent",
          borderLeft: active === item.key ? `3px solid ${theme.accent}` : "3px solid transparent",
          color: active === item.key ? theme.accentLight : theme.muted,
          fontWeight: active === item.key ? 700 : 500, fontSize: 14,
          textAlign: "left", width: "100%"
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>{item.label}
        </button>
      ))}
      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials="YO" size={36} />
          <div><div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>You</div>
            <div style={{ color: theme.muted, fontSize: 11 }}>Demo Account</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", padding: "8px 12px", background: theme.pink + "15", border: `1px solid ${theme.pink}44`,
          borderRadius: 8, color: theme.pink, fontWeight: 600, fontSize: 12, cursor: "pointer"
        }}>👋 Logout</button>
      </div>
    </div>
  );
}

function MobileNav({ active, setActive, isMobile }) {
  if (!isMobile) return null;
  const mainItems = navItems.slice(0, 5);
  return (<div style={{
    display: "flex", justifyContent: "space-around", alignItems: "center",
    background: theme.surface, borderTop: `1px solid ${theme.border}`,
    padding: "12px 0", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100
  }}>
    {mainItems.map(item => (
      <button key={item.key} onClick={() => setActive(item.key)} style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer", padding: "8px 12px",
        color: active === item.key ? theme.accent : theme.muted
      }}>
        <span style={{ fontSize: 20 }}>{item.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
      </button>
    ))}
  </div>);
}

function CommentModal({ projectId, comments, onAddComment, onClose }) {
  const [newComment, setNewComment] = useState("");
  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(projectId, newComment);
      setNewComment("");
    }
  };
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: theme.card, borderRadius: 16, border: `1px solid ${theme.border}`,
        padding: "24px", maxWidth: 500, width: "90%", maxHeight: "80vh", overflow: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: theme.text, margin: 0 }}>💬 Comments</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: theme.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, maxHeight: 300, overflowY: "auto" }}>
          {comments.length === 0 ? (
            <div style={{ color: theme.muted, textAlign: "center", padding: "20px 10px", fontSize: 12 }}>No comments yet. Be the first!</div>
          ) : (
            comments.map((c, i) => (
              <div key={i} style={{ background: theme.surface, padding: "12px", borderRadius: 8, border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Avatar initials={c.author.avatar} size={32} />
                  <div><div style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>{c.author.name}</div>
                    <div style={{ color: theme.muted, fontSize: 10 }}>{c.time}</div>
                  </div>
                </div>
                <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.4 }}>{c.text}</div>
              </div>
            ))
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Add a comment..." style={{
              flex: 1, background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 8, padding: "10px", color: theme.text, fontSize: 14, outline: "none"
            }} />
          <Button primary small onClick={handleSubmit}>Post</Button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onLike, onComment, onConnect }) {
  return (
    <div style={{ background: theme.card, borderRadius: 16, padding: "16px", border: `1px solid ${theme.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={project.user.avatar} size={36} />
          <div><div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>{project.user.name}</div>
            <div style={{ color: theme.muted, fontSize: 11 }}>{project.community}</div>
          </div>
        </div>
        <Badge type={project.user.badge} />
      </div>
      <div style={{ background: theme.surface, borderRadius: 12, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 12 }}>
        {project.image}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, color: theme.text, marginBottom: 6 }}>{project.title}</div>
      <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{project.desc}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {project.tags.slice(0, 3).map(t => <Tag key={t} label={t} />)}
      </div>
      {project.lookingFor && (
        <div style={{ background: theme.green + "18", border: `1px solid ${theme.green}44`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: theme.green, marginBottom: 10, fontWeight: 600 }}>
          🤝 Looking for: {project.lookingFor}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={onLike} style={{ background: project.likedByMe ? theme.pink + "22" : "transparent", border: `1px solid ${project.likedByMe ? theme.pink : theme.border}`, color: project.likedByMe ? theme.pink : theme.muted, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
          {project.likedByMe ? "❤️" : "🤍"} {project.likes}
        </button>
        <button onClick={onComment} style={{ background: "transparent", border: `1px solid ${theme.border}`, color: theme.muted, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
          💬 {project.comments}
        </button>
        {project.lookingFor && (<Button primary small onClick={onConnect} style={{ marginLeft: "auto" }}>
          {project.connectedWithMe ? "Connected ✅" : "Connect 🚀"}
        </Button>)}
      </div>
    </div>
  );
}

function HomeFeed({ projects, joinedHomeChallenge, onJoinHomeChallenge, onLikeProject, onCommentProject, onConnectProject, isMobile }) {
  return (
    <div style={{ maxWidth: isMobile ? "100%" : 680, margin: "0 auto", padding: isMobile ? "0 12px 80px" : "0" }}>
      <div style={{ marginBottom: 20 }}><h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, margin: 0 }}>Good morning 👋</h1>
        <p style={{ color: theme.muted, marginTop: 4, fontSize: 12 }}>Everything is functional and stored in localStorage now.</p>
      </div>
      <div style={{ background: theme.gold + "15", border: `1px solid ${theme.gold}44`, borderRadius: 12, padding: "12px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div><div style={{ color: theme.gold, fontWeight: 700, fontSize: 11 }}>⚡ ACTIVE CHALLENGE</div>
          <div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>Build a Mini App in 48hrs</div>
          <div style={{ color: theme.muted, fontSize: 10 }}>67 participants · 3 days left</div>
        </div>
        <Button primary small onClick={onJoinHomeChallenge}>{joinedHomeChallenge ? "Joined ✅" : "Join Now"}</Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} onLike={() => onLikeProject(p.id)} onComment={() => onCommentProject(p.id)} onConnect={() => onConnectProject(p.user.id)} />
        ))}
      </div>
    </div>
  );
}

function CommunitiesPage({ joinedCommunities, onToggleCommunity, isMobile }) {
  return (
    <div style={{ padding: isMobile ? "0 12px 80px" : "0" }}>
      <h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, marginBottom: 6 }}>Communities 🌐</h1>
      <p style={{ color: theme.muted, fontSize: 12, marginBottom: 16 }}>Join/leave is persisted in localStorage.</p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(150px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {COMMUNITIES.map(c => {
          const joined = joinedCommunities.includes(c.id);
          return (
            <div key={c.id} style={{ background: theme.card, borderRadius: 12, padding: "14px", border: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.color + "22", border: `2px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
                <div><div style={{ color: theme.text, fontWeight: 800, fontSize: 13 }}>{c.name}</div>
                  <div style={{ color: theme.muted, fontSize: 10 }}>👥 {(c.members / 1000).toFixed(1)}k</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                {c.tags.slice(0, 2).map(t => <Tag key={t} label={t} color={c.color} />)}
              </div>
              <button onClick={() => onToggleCommunity(c.id)} style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: joined ? `1px solid ${c.color}` : "none", cursor: "pointer", fontWeight: 700, fontSize: 11, background: joined ? c.color + "22" : c.color, color: joined ? c.color : "#fff" }}>
                {joined ? "✓ Joined" : "+ Join"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectsPage({ projects, onLikeProject, onCommentProject, onConnectProject, onShareProject, isMobile }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "startup", "showcase"];
  const filtered = filter === "all" ? projects : projects.filter(p => p.type === filter);
  return (
    <div style={{ padding: isMobile ? "0 12px 80px" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
        <div><h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, margin: 0 }}>Projects 📂</h1>
          <p style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>You can create projects and keep them after refresh.</p>
        </div>
        <Button primary onClick={onShareProject}>+ Add</Button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 8 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 16, border: `1px solid ${filter === f ? theme.accent : theme.border}`, background: filter === f ? theme.accent + "22" : "transparent", color: filter === f ? theme.accentLight : theme.muted, cursor: "pointer", fontWeight: 600, fontSize: 11, textTransform: "capitalize", whiteSpace: "nowrap" }}>
            {f === "all" ? "All" : f === "startup" ? "🚀 Startup" : "🌟 Showcase"}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {filtered.map(p => (
          <ProjectCard key={p.id} project={p} onLike={() => onLikeProject(p.id)} onComment={() => onCommentProject(p.id)} onConnect={() => onConnectProject(p.user.id)} />
        ))}
      </div>
    </div>
  );
}

function ChallengesPage({ enteredChallenges, onToggleChallenge, isMobile }) {
  return (
    <div style={{ padding: isMobile ? "0 12px 80px" : "0" }}>
      <h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, marginBottom: 6 }}>Challenges ⚡</h1>
      <p style={{ color: theme.muted, fontSize: 12, marginBottom: 16 }}>Challenge entry is persisted in localStorage.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHALLENGES.map(c => {
          const entered = enteredChallenges.includes(c.id);
          return (
            <div key={c.id} style={{ background: theme.card, borderRadius: 12, padding: "14px", border: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: theme.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.icon}</div>
                <div><div style={{ color: theme.text, fontWeight: 800, fontSize: 13 }}>{c.title}</div>
                  <div style={{ color: theme.muted, fontSize: 10, marginTop: 2 }}>{c.community} · 👥 {c.participants} · ⏰ {c.deadline}</div>
                  <div style={{ color: theme.gold, fontSize: 10, marginTop: 2, fontWeight: 600 }}>🏆 {c.prize}</div>
                </div>
              </div>
              <Button primary small onClick={() => onToggleChallenge(c.id)}>{entered ? "✅" : "Enter"}</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PeoplePage({ connectedUsers, onToggleConnect, onToggleFollow, followingUsers, onViewProjects, isMobile }) {
  const [search, setSearch] =useState("");
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
  return (
    <div style={{ padding: isMobile ? "0 12px 80px" : "0" }}>
      <h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, marginBottom: 6 }}>Find People 🤝</h1>
      <p style={{ color: theme.muted, fontSize: 12, marginBottom: 12 }}>Connect, follow, and find collaborators.</p>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or skill..." style={{ width: "100%", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px", color: theme.text, fontSize: 12, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(u => {
          const isConnected = connectedUsers.includes(u.id);
          const isFollowing = followingUsers.includes(u.id);
          return (
            <div key={u.id} style={{ background: theme.card, borderRadius: 12, padding: "14px", border: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Avatar initials={u.avatar} size={40} />
                <div style={{ flex: 1 }}><div style={{ color: theme.text, fontWeight: 800, fontSize: 13 }}>{u.name}</div>
                  <div style={{ color: theme.muted, fontSize: 10 }}>{u.year}</div>
                  <Badge type={u.badge} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, marginBottom: 10, color: theme.muted }}>
                <span>👥 {u.followers} followers</span>
                <span>🔗 {u.following} following</span>
              </div>
              <p style={{ color: theme.muted, fontSize: 11, lineHeight: 1.4, marginBottom: 10 }}>{u.bio.substring(0, 60)}...</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 10 }}>
                {u.skills.slice(0, 3).map(s => <Tag key={s} label={s} />)}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Button small onClick={() => onToggleConnect(u.id)} style={{ flex: 1 }}>
                  {isConnected ? "✅ Connect" : "👋 Collab"}
                </Button>
                <Button small onClick={() => onToggleFollow(u.id)} style={{ flex: 1, background: isFollowing ? theme.accent + "22" : "transparent", border: `1px solid ${isFollowing ? theme.accent : theme.border}`, color: isFollowing ? theme.accentLight : theme.muted }}>
                  {isFollowing ? "⭐ Following" : "☆ Follow"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePage({ bio, myProjects, onEditProfile, onLikeProject, onCommentProject, onConnectProject, isMobile }) {
  const me = USERS[0];
  return (
    <div style={{ maxWidth: isMobile ? "100%" : 680, margin: "0 auto", padding: isMobile ? "0 12px 80px" : "0" }}>
      <div style={{ background: "linear-gradient(135deg, #7c6df5, #ec4899)", borderRadius: 12, height: 100, marginBottom: -40, position: "relative" }}>
        <div style={{ position: "absolute", bottom: -35, left: 12 }}>
          <Avatar initials={me.avatar} size={60} gradient="linear-gradient(135deg,#1a1a24,#22222e)" />
        </div>
      </div>
      <div style={{ background: theme.card, borderRadius: 12, padding: "50px 14px 14px", border: `1px solid ${theme.border}`, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div><h2 style={{ color: theme.text, margin: 0, fontSize: isMobile ? 18 : 24, fontWeight: 900 }}>{me.name}</h2>
            <div style={{ color: theme.muted, fontSize: 12, margin: "4px 0 6px" }}>{me.major}</div>
            <Badge type={me.badge} />
          </div>
          <Button primary small onClick={onEditProfile}>Edit</Button>
        </div>
        <p style={{ color: theme.muted, fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>{bio}</p>
      </div>
      <h3 style={{ color: theme.text, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>My Projects</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
        {myProjects.map(p => (
          <ProjectCard key={p.id} project={p} onLike={() => onLikeProject(p.id)} onComment={() => onCommentProject(p.id)} onConnect={() => onConnectProject(p.user.id)} />
        ))}
      </div>
    </div>
  );
}

function NotificationsPage({ notifications, onToggleRead, onMarkAllRead, onReset, isMobile }) {
  return (
    <div style={{ maxWidth: isMobile ? "100%" : 600, padding: isMobile ? "0 12px 80px" : "0" }}>
      <h1 style={{ color: theme.text, fontWeight: 900, fontSize: isMobile ? 22 : 26, marginBottom: 10 }}>Notifications 🔔</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <Button small onClick={onMarkAllRead}>Mark all read</Button>
        <Button small onClick={onReset}>Reset</Button>
      </div>
      {notifications.map(n => (
        <button key={n.id} onClick={() => onToggleRead(n.id)} style={{ display: "flex", gap: 10, padding: "12px 14px", background: n.unread ? theme.accent + "10" : theme.card, borderRadius: 10, marginBottom: 6, border: `1px solid ${n.unread ? theme.accent + "33" : theme.border}`, width: "100%", textAlign: "left", cursor: "pointer" }}>
          <div style={{ fontSize: 18 }}>{n.icon}</div>
          <div style={{ flex: 1 }}><div style={{ color: theme.text, fontSize: 12 }}>{n.msg}</div>
            <div style={{ color: theme.muted, fontSize: 10, marginTop: 2 }}>{n.time}</div>
          </div>
          {n.unread && <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, marginTop: 4, flexShrink: 0 }} />}
        </button>
      ))}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return <App user={user} onLogout={logout} />;
}

function App({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activePage, setActivePage] = useLocalStorageState("hh_active_page", "home");
  const [projects, setProjects] = useLocalStorageState("hh_projects", BASE_PROJECTS.map(p => ({ ...p, likedByMe: false, projectComments: [] })));
  const [joinedCommunities, setJoinedCommunities] = useLocalStorageState("hh_joined_communities", [1, 3]);
  const [enteredChallenges, setEnteredChallenges] = useLocalStorageState("hh_entered_challenges", []);
  const [connectedUsers, setConnectedUsers] = useLocalStorageState("hh_connected_users", []);
  const [followingUsers, setFollowingUsers] = useLocalStorageState("hh_following_users", []);
  const [notifications, setNotifications] = useLocalStorageState("hh_notifications", DEFAULT_NOTIFICATIONS);
  const [profileBio, setProfileBio] = useLocalStorageState("hh_profile_bio", USERS[0].bio);
  const [commentModalProjectId, setCommentModalProjectId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const projectsForView = projects.map(p => ({ ...p, connectedWithMe: connectedUsers.includes(p.user.id) }));
  const myProjects = projectsForView.filter(p => p.user.id === 1);

  const toggleLikeProject = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const nextLiked = !p.likedByMe;
      return { ...p, likedByMe: nextLiked, likes: Math.max(0, p.likes + (nextLiked ? 1 : -1)) };
    }));
  };

  const addCommentToProject = (projectId, commentText) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        comments: p.comments + 1,
        projectComments: [
          ...p.projectComments,
          { author: USERS[0], text: commentText, time: "just now" }
        ]
      };
    }));
  };

  const openCommentModal = (projectId) => {
    setCommentModalProjectId(projectId);
  };

  const toggleConnectUser = (userId) => {
    setConnectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const toggleFollowUser = (userId) => {
    setFollowingUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const toggleCommunity = (communityId) => {
    setJoinedCommunities(prev => prev.includes(communityId) ? prev.filter(id => id !== communityId) : [...prev, communityId]);
  };

  const toggleChallenge = (challengeId) => {
    setEnteredChallenges(prev => prev.includes(challengeId) ? prev.filter(id => id !== challengeId) : [...prev, challengeId]);
  };

  const shareProject = () => {
    const title = window.prompt("Project title:");
    if (!title) return;
    const desc = window.prompt("Description:") || "Check out my project!";
    const type = (window.prompt("Type: startup or showcase") || "showcase").toLowerCase() === "startup" ? "startup" : "showcase";
    const newProject = {
      id: Date.now(),
      user: USERS[0],
      title,
      desc,
      tags: ["New"],
      likes: 0,
      comments: 0,
      image: "✨",
      community: "Code & Create",
      type,
      lookingFor: null,
      likedByMe: false,
      projectComments: []
    };
    setProjects(prev => [newProject, ...prev]);
    setActivePage("projects");
  };

  const editProfile = () => {
    const nextBio = window.prompt("Update your bio:", profileBio);
    if (nextBio && nextBio.trim()) setProfileBio(nextBio.trim());
  };

  const toggleNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
  };

  const pages = {
    home: <HomeFeed projects={projectsForView} joinedHomeChallenge={enteredChallenges.includes(1)} onJoinHomeChallenge={() => toggleChallenge(1)} onLikeProject={toggleLikeProject} onCommentProject={openCommentModal} onConnectProject={toggleConnectUser} isMobile={isMobile} />,
    communities: <CommunitiesPage joinedCommunities={joinedCommunities} onToggleCommunity={toggleCommunity} isMobile={isMobile} />,
    projects: <ProjectsPage projects={projectsForView} onLikeProject={toggleLikeProject} onCommentProject={openCommentModal} onConnectProject={toggleConnectUser} onShareProject={shareProject} isMobile={isMobile} />,
    challenges: <ChallengesPage enteredChallenges={enteredChallenges} onToggleChallenge={toggleChallenge} isMobile={isMobile} />,
    people: <PeoplePage connectedUsers={connectedUsers} onToggleConnect={toggleConnectUser} onToggleFollow={toggleFollowUser} followingUsers={followingUsers} onViewProjects={() => setActivePage("projects")} isMobile={isMobile} />,
    notifs: <NotificationsPage notifications={notifications} onToggleRead={toggleNotificationRead} onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))} onReset={() => setNotifications(DEFAULT_NOTIFICATIONS)} isMobile={isMobile} />,
    profile: <ProfilePage bio={profileBio} myProjects={myProjects} onEditProfile={editProfile} onLikeProject={toggleLikeProject} onCommentProject={openCommentModal} onConnectProject={toggleConnectUser} isMobile={isMobile} />,
  };

  const currentProject = commentModalProjectId ? projectsForView.find(p => p.id === commentModalProjectId) : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'Segoe UI', system-ui, sans-serif", flexDirection: isMobile ? "column" : "row" }}>
      <Sidebar active={activePage} setActive={setActivePage} isMobile={isMobile} onLogout={onLogout} />
      <main style={{ flex: 1, overflowY: "auto", paddingBottom: isMobile ? 80 : 0, fontSize: "16px" }}>
        {pages[activePage]}
      </main>
      <MobileNav active={activePage} setActive={setActivePage} isMobile={isMobile} />
      {currentProject && <CommentModal projectId={currentProject.id} comments={currentProject.projectComments} onAddComment={addCommentToProject} onClose={() => setCommentModalProjectId(null)} />}
    </div>
  );
}
