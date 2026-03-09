import { useState } from "react";
import { theme } from "../theme";
import { Button } from "../components/UI";
import { ProjectCard, CommentModal, NewProjectModal } from "../components/ProjectComponents";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ProjectsPage({ projects, onLike, onComment, onAddComment, commentModalId, onAddProject, onCloseComment }) {
    const isMobile = useIsMobile();
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [showNew, setShowNew] = useState(false);

    const currentCommentProject = commentModalId ? projects.find(p => p.id === commentModalId) : null;

    const filtered = projects
        .filter(p => filter === "all" || p.type === filter)
        .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                <div>
                    <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 26, margin: "0 0 4px", letterSpacing: "-0.5px" }}>Projects</h1>
                    <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Discover what the community is building.</p>
                </div>
                <Button primary small onClick={() => setShowNew(true)}>Post Project</Button>
            </div>

            {/* Search + Filter */}
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, marginBottom: 20 }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title or tag..."
                    style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {["all", "showcase", "startup"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            flex: isMobile ? 1 : undefined,
                            padding: "9px 14px", borderRadius: 8, cursor: "pointer",
                            border: `1px solid ${filter === f ? theme.border : "transparent"}`,
                            background: filter === f ? theme.surface : "transparent",
                            color: filter === f ? theme.text : theme.muted,
                            fontFamily: "inherit", fontWeight: 500, fontSize: 12, textTransform: "capitalize"
                        }}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, padding: 60, textAlign: "center", color: theme.muted }}>No projects found.</div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                    {filtered.map(p => <ProjectCard key={p.id} project={p} onLike={() => onLike(p.id)} onComment={() => onComment(p.id)} />)}
                </div>
            )}

            {showNew && <NewProjectModal onClose={() => setShowNew(false)} onSubmit={onAddProject} />}
            {currentCommentProject && <CommentModal project={currentCommentProject} onAddComment={text => onAddComment(currentCommentProject.id, text)} onClose={onCloseComment} />}
        </div>
    );
}
