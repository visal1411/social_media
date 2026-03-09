import { useState } from "react";
import { theme } from "../theme";
import { Avatar, Badge, Button, Tag } from "../components/UI";
import { USERS } from "../data/mockData";
import { useIsMobile } from "../hooks/useIsMobile";

export default function DirectoryPage({ connectedUsers, followingUsers, onToggleConnect, onToggleFollow }) {
    const isMobile = useIsMobile();
    const [search, setSearch] = useState("");

    const filtered = USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 26, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Directory</h1>
                <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Find collaborators and expand your network.</p>
            </div>
            <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or skill..."
                style={{ width: "100%", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "12px 16px", color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 20, boxSizing: "border-box" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {filtered.map(u => {
                    const isConnected = connectedUsers.includes(u.id);
                    const isFollowing = followingUsers.includes(u.id);
                    return (
                        <div key={u.id} style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                            {/* Cover */}
                            <div style={{ height: 50, background: `linear-gradient(135deg, hsl(${u.avatarHue},30%,10%), hsl(${u.avatarHue},45%,18%))` }} />
                            <div style={{ padding: "0 16px 16px" }}>
                                <div style={{ marginTop: -22, marginBottom: 10 }}>
                                    <Avatar initials={u.avatar} size={44} hue={u.avatarHue} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                                    <div>
                                        <div style={{ color: theme.text, fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                                        <div style={{ color: theme.muted, fontSize: 11, marginTop: 1 }}>{u.major} · {u.year}</div>
                                    </div>
                                    <Badge type={u.badge} />
                                </div>
                                <p style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 10px" }}>{u.bio}</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                                    {u.skills.slice(0, 3).map(s => <Tag key={s} label={s} />)}
                                </div>
                                <div style={{ display: "flex", gap: 14, color: theme.muted, fontSize: 11, marginBottom: 14 }}>
                                    <span>{u.followers} followers</span>
                                    <span>{u.following} following</span>
                                </div>
                                {u.id !== 1 && (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <Button small primary={!isConnected} onClick={() => onToggleConnect(u.id)} style={{
                                            flex: 1, fontSize: 12,
                                            background: isConnected ? "transparent" : theme.text,
                                            color: isConnected ? theme.muted : theme.bg,
                                            border: isConnected ? `1px solid ${theme.border}` : "none"
                                        }}>
                                            {isConnected ? "Connected" : "Connect"}
                                        </Button>
                                        <Button small onClick={() => onToggleFollow(u.id)} style={{
                                            flex: 1, fontSize: 12,
                                            background: isFollowing ? theme.surface : "transparent",
                                            border: `1px solid ${theme.border}`,
                                            color: isFollowing ? theme.text : theme.muted
                                        }}>
                                            {isFollowing ? "Following" : "Follow"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
