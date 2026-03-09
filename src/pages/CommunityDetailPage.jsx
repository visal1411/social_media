import { useState } from "react";
import { theme } from "../theme";
import { Button, MockImage, Avatar } from "../components/UI";
import { COMMUNITIES } from "../data/mockData";
import { ProjectCard, CommentModal, NewProjectModal } from "../components/ProjectComponents";
import { useIsMobile } from "../hooks/useIsMobile";

export default function CommunityDetailPage({ communityId, projects, onBack, onLike, onComment, onAddComment, commentModalId, onAddProject, onCloseComment }) {
    const isMobile = useIsMobile();
    const community = COMMUNITIES.find(c => c.id === communityId);
    const communityProjects = projects.filter(p => p.communityId === communityId);
    const [showNewProject, setShowNewProject] = useState(false);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const currentCommentProject = commentModalId ? projects.find(p => p.id === commentModalId) : null;

    const filtered = communityProjects
        .filter(p => filter === "all" || p.type === filter)
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    if (!community) return null;

    return (
        <div>
            {/* Back */}
            <button onClick={onBack} style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer", fontSize: 13, padding: "0 0 18px", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                ← Back to Communities
            </button>

            {/* Cover */}
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20, position: "relative", height: isMobile ? 180 : 260, border: `1px solid ${theme.border}` }}>
                <MockImage hue={community.hue} label={`${community.abbr}_HOME`} height={isMobile ? 180 : 260} borderRadius={0} src={community.coverUrl} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", padding: isMobile ? "16px" : "28px", background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 100%)" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
                        <Avatar initials={community.abbr} size={isMobile ? 50 : 70} hue={community.hue} src={community.avatarUrl} />
                        <div>
                            <div style={{ fontSize: 10, color: `hsl(${community.hue},70%,75%)`, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>Community</div>
                            <h1 style={{ margin: "0 0 4px", color: "#fff", fontWeight: 800, fontSize: isMobile ? 22 : 28, letterSpacing: "-0.5px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>{community.name}</h1>
                            <div style={{ color: `hsl(${community.hue},40%,85%)`, fontSize: 13, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{(community.members / 1000).toFixed(1)}k members · {communityProjects.length} projects</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    style={{ flex: 1, minWidth: 0, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {["all", "showcase", "startup"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            padding: isMobile ? "8px 10px" : "9px 14px", borderRadius: 8, cursor: "pointer",
                            border: `1px solid ${filter === f ? theme.border : "transparent"}`,
                            background: filter === f ? theme.surface : "transparent",
                            color: filter === f ? theme.text : theme.muted,
                            fontFamily: "inherit", fontWeight: 500, fontSize: 12, textTransform: "capitalize"
                        }}>{f}</button>
                    ))}
                </div>
                <Button primary small onClick={() => setShowNewProject(true)} style={{ flexShrink: 0 }}>Post Project</Button>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, padding: isMobile ? 40 : 60, textAlign: "center" }}>
                    <div style={{ color: theme.muted, fontSize: 14, marginBottom: 16 }}>No projects here yet.</div>
                    <Button primary small onClick={() => setShowNewProject(true)}>Be the first to post</Button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                    {filtered.map(p => <ProjectCard key={p.id} project={p} onLike={() => onLike(p.id)} onComment={() => onComment(p.id)} />)}
                </div>
            )}

            {showNewProject && <NewProjectModal communityId={communityId} onClose={() => setShowNewProject(false)} onSubmit={onAddProject} />}
            {currentCommentProject && <CommentModal project={currentCommentProject} onAddComment={text => onAddComment(currentCommentProject.id, text)} onClose={onCloseComment} />}
        </div>
    );
}
