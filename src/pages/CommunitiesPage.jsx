import { useState } from "react";
import { theme } from "../theme";
import { Button, MockImage, Avatar } from "../components/UI";
import { COMMUNITIES } from "../data/mockData";
import { useIsMobile } from "../hooks/useIsMobile";

export default function CommunitiesPage({ joinedCommunities, onToggleCommunity, onEnterCommunity }) {
    const isMobile = useIsMobile();
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 26, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Communities</h1>
                <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Join groups to discover and post projects with like-minded creators.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                {COMMUNITIES.map(c => {
                    const joined = joinedCommunities.includes(c.id);
                    return <CommunityCard key={c.id} community={c} joined={joined} onToggle={() => onToggleCommunity(c.id)} onEnter={() => onEnterCommunity(c.id)} isMobile={isMobile} />;
                })}
            </div>
        </div>
    );
}

function CommunityCard({ community: c, joined, onToggle, onEnter, isMobile }) {
    return (
        <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            {/* Web-like Cover Image & Profile Avatar */}
            <div style={{ position: "relative" }}>
                <MockImage hue={c.hue} label={`${c.abbr}_COVER`} height={isMobile ? 80 : 100} borderRadius={0} src={c.coverUrl} />
                <div style={{ position: "absolute", bottom: -24, left: 16 }}>
                    <Avatar initials={c.abbr} size={50} hue={c.hue} src={c.avatarUrl} />
                </div>
            </div>

            <div style={{ padding: "26px 16px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                        <div style={{ color: theme.text, fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.name}</div>
                        <div style={{ color: theme.muted, fontSize: 12 }}>{(c.members / 1000).toFixed(1)}k members</div>
                    </div>
                    {joined && <span style={{ fontSize: 10, background: theme.surface, color: theme.muted, border: `1px solid ${theme.border}`, padding: "3px 8px", borderRadius: 12, fontWeight: 600, flexShrink: 0 }}>Joined</span>}
                </div>

                <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>{c.desc}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {c.tags.map(t => (
                        <span key={t} style={{ background: `hsl(${c.hue},40%,12%)`, color: `hsl(${c.hue},55%,60%)`, border: `1px solid hsl(${c.hue},35%,20%)`, fontSize: 11, padding: "2px 10px", borderRadius: 6, fontWeight: 500 }}>{t}</span>
                    ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                    {joined ? (
                        <>
                            <Button small primary onClick={onEnter} style={{ flex: 1, fontSize: 12 }}>Open Community</Button>
                            <Button small onClick={onToggle} style={{ color: theme.muted, fontSize: 12 }}>Leave</Button>
                        </>
                    ) : (
                        <Button small primary onClick={onToggle} style={{ flex: 1, fontSize: 12 }}>Join Community</Button>
                    )}
                </div>
            </div>
        </div>
    );
}
