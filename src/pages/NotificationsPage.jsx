import { theme } from "../theme";
import { Button, Avatar } from "../components/UI";
import { useIsMobile } from "../hooks/useIsMobile";
import { USERS } from "../data/mockData";

export default function NotificationsPage({ notifications, onToggleRead, onMarkAllRead, onReset }) {
    const isMobile = useIsMobile();
    return (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                <div>
                    <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 26, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Notifications</h1>
                    <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Stay updated on your projects and communities.</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Button small onClick={onReset} style={{ color: theme.muted, fontSize: 12 }}>Reset</Button>
                    <Button primary small onClick={onMarkAllRead} style={{ fontSize: 12 }}>Mark all read</Button>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {notifications.map(n => {
                    const author = USERS.find(u => u.name === n.user) || USERS[1];
                    let Icon = "·";
                    let color = theme.muted;
                    if (n.type === "like") { Icon = "♥"; color = "#f43f5e"; }
                    if (n.type === "comment") { Icon = "💬"; color = "#3b82f6"; }
                    if (n.type === "join") { Icon = "👋"; color = "#10b981"; }
                    if (n.type === "system") { Icon = "⚡"; color = "#f59e0b"; }

                    return (
                        <div key={n.id} onClick={() => onToggleRead(n.id)} style={{
                            display: "flex", gap: 14, padding: isMobile ? "12px" : "16px 20px",
                            background: n.unread ? theme.surface : theme.card,
                            border: `1px solid ${n.unread ? theme.border : "transparent"}`,
                            borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
                            opacity: n.unread ? 1 : 0.7, alignItems: "flex-start"
                        }}>
                            <div style={{ position: "relative" }}>
                                <Avatar initials={author.avatar} size={isMobile ? 36 : 42} hue={author.avatarHue} />
                                <div style={{
                                    position: "absolute", bottom: -2, right: -2, width: 16, height: 16,
                                    borderRadius: "50%", background: theme.card, display: "flex",
                                    alignItems: "center", justifyContent: "center", fontSize: 9, color
                                }}>{Icon}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: theme.text, fontSize: 14, lineHeight: 1.5 }}>
                                    <span style={{ fontWeight: 600 }}>{n.user}</span> {n.action} <span style={{ fontWeight: 600 }}>{n.target}</span>
                                </div>
                                <div style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>{n.time}</div>
                            </div>
                            {n.unread && <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.text, flexShrink: 0, marginTop: 6 }} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
