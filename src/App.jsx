import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { theme } from "./theme";
import { Avatar } from "./components/UI";
import { BASE_PROJECTS, COMMUNITIES, DEFAULT_NOTIFICATIONS, USERS } from "./data/mockData";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ChallengesPage from "./pages/ChallengesPage";
import DirectoryPage from "./pages/DirectoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";

// ─── Persist helper ─────────────────────────────────────────────────────────
function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { }
  }, [key, state]);
  return [state, setState];
}

// ─── NAV items & Icons ────────────────────────────────────────────────────────
const NAV = [
  { key: "home", label: "Home" },
  { key: "communities", label: "Communities" },
  { key: "projects", label: "Projects" },
  { key: "challenges", label: "Challenges" },
  { key: "directory", label: "Directory" },
  { key: "notifs", label: "Notifications" },
  { key: "profile", label: "Profile" },
];

const ICONS = {
  home: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  communities: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  projects: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  challenges: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  directory: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  notifs: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  profile: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, unreadCount, onLogout }) {
  const { user } = useAuth();
  return (
    <div style={{
      width: 230, background: theme.surface, borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: "sticky", top: 0, height: "100vh", overflowY: "auto"
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.text, display: "flex", alignItems: "center", justifyContent: "center", color: theme.bg, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>H</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: theme.text, letterSpacing: "-0.4px" }}>HobbyHub</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV.map(item => {
          const isActive = active === item.key;
          const badge = item.key === "notifs" && unreadCount > 0 ? unreadCount : null;
          return (
            <button key={item.key} onClick={() => setActive(item.key)} style={{
              display: "flex", alignItems: "center", gap: 12,
              width: "100%", padding: "10px 24px", border: "none", cursor: "pointer",
              background: isActive ? theme.border : "transparent",
              borderLeft: `3px solid ${isActive ? theme.text : "transparent"}`,
              color: isActive ? theme.text : theme.muted,
              fontWeight: isActive ? 600 : 400, fontSize: 14, textAlign: "left",
              fontFamily: "inherit", transition: "background 0.15s"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20 }}>
                {ICONS[item.key]}
              </div>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge && (
                <span style={{ background: theme.text, color: theme.bg, borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar initials={USERS[0].avatar} size={34} hue={USERS[0].avatarHue} />
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Demo User"}</div>
            <div style={{ color: theme.muted, fontSize: 11 }}>Free Plan</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", padding: "8px 0", background: "transparent", border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.muted, fontWeight: 500, fontSize: 12, cursor: "pointer", fontFamily: "inherit"
        }}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileNav({ active, setActive, unreadCount }) {
  const [showMore, setShowMore] = useState(false);
  const mainNavKeys = ["home", "communities", "projects"];
  const mainNav = NAV.filter(n => mainNavKeys.includes(n.key));
  const moreNavKeys = ["profile", "challenges", "notifs", "directory"];
  const moreNav = NAV.filter(n => moreNavKeys.includes(n.key));

  return (
    <>
      {/* Backdrop for More menu */}
      {showMore && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setShowMore(false)} />
      )}

      {/* Floating More Menu */}
      <div style={{
        position: "fixed", bottom: showMore ? 80 : 20, right: 16,
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 24, padding: "8px", zIndex: 100,
        opacity: showMore ? 1 : 0, pointerEvents: showMore ? "auto" : "none",
        transform: showMore ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transformOrigin: "bottom right",
        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
        display: "flex", flexDirection: "column", gap: 4, width: 160
      }}>
        {moreNav.map(item => {
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => { setActive(item.key); setShowMore(false); }} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: isActive ? `rgba(255,255,255,0.05)` : "transparent",
              border: "none", padding: "12px 16px", borderRadius: 16,
              color: isActive ? theme.text : theme.muted, fontFamily: "inherit",
              cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.2s"
            }}>
              <div style={{ color: isActive ? theme.text : theme.muted }}>{ICONS[item.key]}</div>
              <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, flex: 1 }}>{item.label}</span>
              {item.key === "notifs" && unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: 10, fontSize: 10, fontWeight: "bold" }}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mobile-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: theme.surface,
        borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-around",
        padding: "10px 0", zIndex: 100, paddingBottom: "max(10px, env(safe-area-inset-bottom))"
      }}>
        {mainNav.map(item => {
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => { setActive(item.key); setShowMore(false); }} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
              color: isActive ? theme.text : theme.muted, fontFamily: "inherit", flex: 1, position: "relative"
            }}>
              <div style={{ opacity: isActive ? 1 : 0.7, transform: isActive ? "scale(1.1)" : "scale(1)", transition: "all 0.2s" }}>
                {ICONS[item.key]}
              </div>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button onClick={() => setShowMore(!showMore)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          background: "none", border: "none", cursor: "pointer", padding: "4px 8px",
          color: showMore ? theme.text : theme.muted, fontFamily: "inherit", flex: 1, position: "relative"
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: showMore ? theme.text : "transparent",
            color: showMore ? theme.bg : theme.muted, border: `2px solid ${showMore ? theme.surface : theme.muted}`,
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
            boxShadow: showMore ? "0 4px 12px rgba(255,255,255,0.2)" : "none"
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" />
            </svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: showMore ? 700 : 500 }}>More</span>
          {unreadCount > 0 && <div style={{ position: "absolute", top: 2, right: "calc(50% - 16px)", width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: `2px solid ${theme.surface}` }} />}
        </button>
      </div>
    </>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function MainApp({ onLogout }) {
  const toast = useToast();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activePage, setActivePage] = useLocalStorage("hh_page", "home");
  const [activeCommunityId, setActiveCommunityId] = useState(null);

  // State
  const [projects, setProjects] = useLocalStorage("hh_projects", BASE_PROJECTS.map(p => ({ ...p, likedByMe: false, projectComments: [] })));
  const [joinedCommunities, setJoinedCommunities] = useLocalStorage("hh_communities", [1, 3]);
  const [enteredChallenges, setEnteredChallenges] = useLocalStorage("hh_challenges", []);
  const [connectedUsers, setConnectedUsers] = useLocalStorage("hh_connected", []);
  const [followingUsers, setFollowingUsers] = useLocalStorage("hh_following", []);
  const [notifications, setNotifications] = useLocalStorage("hh_notifs", DEFAULT_NOTIFICATIONS);
  const [commentModalId, setCommentModalId] = useState(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // ─── Actions (all with toasts) ────────────────────────────────────────────
  const toggleLike = (id) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const liked = !p.likedByMe;
      toast(liked
        ? { type: "success", title: "Liked!", message: `You liked "${p.title}"` }
        : { type: "info", title: "Unliked", message: `Removed like from "${p.title}"` }
      );
      return { ...p, likedByMe: liked, likes: p.likes + (liked ? 1 : -1) };
    }));
  };

  const addComment = (projectId, text) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p, comments: p.comments + 1,
        projectComments: [...(p.projectComments || []), { author: USERS[0], text, time: "just now" }]
      };
    }));
    toast({ type: "success", title: "Comment posted", message: "Your comment has been added." });
  };

  const addProject = (data) => {
    const newProject = {
      ...data, id: Date.now(), user: USERS[0], likes: 0, comments: 0,
      likedByMe: false, projectComments: [], isFeatured: false, createdAt: "just now"
    };
    setProjects(prev => [newProject, ...prev]);
    toast({ type: "success", title: "Project posted!", message: `"${data.title}" is now live.` });
  };

  const toggleCommunity = (id) => {
    const name = COMMUNITIES.find(c => c.id === id)?.name || "Community";
    setJoinedCommunities(prev => {
      const joining = !prev.includes(id);
      toast(joining
        ? { type: "success", title: "Joined!", message: `You joined ${name}.` }
        : { type: "info", title: "Left community", message: `You left ${name}.` }
      );
      return joining ? [...prev, id] : prev.filter(c => c !== id);
    });
  };

  const enterCommunity = (id) => {
    if (!joinedCommunities.includes(id)) toggleCommunity(id);
    setActiveCommunityId(id);
    setActivePage("communities");
  };

  const toggleChallenge = (id) => {
    const { title } = CHALLENGES.find(c => c.id === id) || { title: "Challenge" };
    setEnteredChallenges(prev => {
      const entering = !prev.includes(id);
      toast(entering
        ? { type: "success", title: "Challenge entered!", message: `Good luck with "${title}"` }
        : { type: "info", title: "Withdrawn", message: `You withdrew from "${title}".` }
      );
      return entering ? [...prev, id] : prev.filter(c => c !== id);
    });
  };

  const toggleConnect = (id) => {
    const name = USERS.find(u => u.id === id)?.name || "User";
    setConnectedUsers(prev => {
      const connecting = !prev.includes(id);
      toast(connecting
        ? { type: "success", title: "Connected!", message: `You connected with ${name}.` }
        : { type: "info", title: "Disconnected", message: `Removed connection with ${name}.` }
      );
      return connecting ? [...prev, id] : prev.filter(c => c !== id);
    });
  };

  const toggleFollow = (id) => {
    const name = USERS.find(u => u.id === id)?.name || "User";
    setFollowingUsers(prev => {
      const following = !prev.includes(id);
      toast(following
        ? { type: "success", title: "Following!", message: `You are now following ${name}.` }
        : { type: "info", title: "Unfollowed", message: `Unfollowed ${name}.` }
      );
      return following ? [...prev, id] : prev.filter(c => c !== id);
    });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast({ type: "info", title: "All caught up", message: "All notifications marked as read." });
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSetPage = (page) => {
    setActiveCommunityId(null);
    setActivePage(page);
  };

  // ─── Page Router ───────────────────────────────────────────────────────────
  let pageContent;

  if (activePage === "communities" && activeCommunityId) {
    pageContent = (
      <CommunityDetailPage
        communityId={activeCommunityId}
        projects={projects}
        onBack={() => setActiveCommunityId(null)}
        onLike={toggleLike}
        onComment={setCommentModalId}
        onAddComment={addComment}
        commentModalId={commentModalId}
        onCloseComment={() => setCommentModalId(null)}
        onAddProject={addProject}
      />
    );
  } else if (activePage === "home") {
    pageContent = (
      <HomePage
        projects={projects}
        joinedCommunities={joinedCommunities}
        enteredChallenges={enteredChallenges}
        onLike={toggleLike}
        onComment={setCommentModalId}
        onAddComment={addComment}
        commentModalId={commentModalId}
        onCloseComment={() => setCommentModalId(null)}
        onJoinChallenge={toggleChallenge}
        onEnterCommunity={enterCommunity}
      />
    );
  } else if (activePage === "communities") {
    pageContent = (
      <CommunitiesPage
        joinedCommunities={joinedCommunities}
        onToggleCommunity={toggleCommunity}
        onEnterCommunity={enterCommunity}
      />
    );
  } else if (activePage === "projects") {
    pageContent = (
      <ProjectsPage
        projects={projects}
        onLike={toggleLike}
        onComment={setCommentModalId}
        onAddComment={addComment}
        commentModalId={commentModalId}
        onCloseComment={() => setCommentModalId(null)}
        onAddProject={addProject}
      />
    );
  } else if (activePage === "challenges") {
    pageContent = (
      <ChallengesPage
        enteredChallenges={enteredChallenges}
        onToggleChallenge={toggleChallenge}
      />
    );
  } else if (activePage === "directory") {
    pageContent = (
      <DirectoryPage
        connectedUsers={connectedUsers}
        followingUsers={followingUsers}
        onToggleConnect={toggleConnect}
        onToggleFollow={toggleFollow}
      />
    );
  } else if (activePage === "notifs") {
    pageContent = (
      <NotificationsPage
        notifications={notifications}
        onToggleRead={id => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n))}
        onMarkAllRead={markAllRead}
        onReset={() => {
          setNotifications(DEFAULT_NOTIFICATIONS);
          toast({ type: "info", title: "Notifications reset", message: "Demo notifications restored." });
        }}
      />
    );
  } else if (activePage === "profile") {
    pageContent = <ProfilePage projects={projects} onNavigate={handleSetPage} onLogout={onLogout} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', system-ui, sans-serif" }}>
      {!isMobile && <Sidebar active={activePage} setActive={handleSetPage} unreadCount={unreadCount} onLogout={onLogout} />}

      <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px 90px" : "32px 40px", minWidth: 0 }}>
        {pageContent}
      </main>

      {isMobile && <MobileNav active={activePage} setActive={handleSetPage} unreadCount={unreadCount} />}
    </div>
  );
}

// ─── App Wrapper ──────────────────────────────────────────────────────────────
function AppContent() {
  const { user, logout } = useAuth();
  if (!user) return <LoginPage onLoginSuccess={() => { }} />;
  return <MainApp onLogout={logout} />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
