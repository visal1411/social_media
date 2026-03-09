import { useState } from "react";
import { theme } from "../theme";
import { Avatar, Badge, Button, MockImage, Tag, Input, Modal, PageHeader } from "../components/UI";
import { COMMUNITIES, USERS } from "../data/mockData";
import { useIsMobile } from "../hooks/useIsMobile";

// ─── Project Card (shared) ─────────────────────────────────────────────────
export function ProjectCard({ project, onLike, onComment }) {
    const isMobile = useIsMobile();
    return (
        <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <MockImage hue={project.imageHue} label={project.imageLabel} height={180} borderRadius={0} />
            <div style={{ padding: isMobile ? "16px" : "20px" }}>
                {/* Author row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={project.user.avatar} size={isMobile ? 32 : 36} hue={project.user.avatarHue} />
                        <div>
                            <div style={{ color: theme.text, fontWeight: 600, fontSize: 13 }}>{project.user.name}</div>
                            <div style={{ color: theme.muted, fontSize: 11 }}>{project.createdAt}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 6, alignItems: "center" }}>
                        <Badge type={project.user.badge} />
                        {project.isFeatured && (
                            <span style={{ background: "#854d0e40", color: "#fbbf24", border: "1px solid #854d0e", fontSize: 10, padding: "2px 8px", borderRadius: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Featured</span>
                        )}
                    </div>
                </div>

                {/* Community label */}
                {project.communityId && (
                    <div style={{ color: theme.muted, fontSize: 11, marginBottom: 10 }}>
                        in <span style={{ color: theme.text, fontWeight: 600 }}>{COMMUNITIES.find(c => c.id === project.communityId)?.name}</span>
                    </div>
                )}

                <h3 style={{ color: theme.text, fontWeight: 700, fontSize: 16, margin: "0 0 8px", letterSpacing: "-0.3px" }}>{project.title}</h3>
                <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.65, margin: "0 0 14px" }}>{project.desc}</p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {project.tags.map(t => <Tag key={t} label={t} />)}
                </div>

                {/* Looking for */}
                {project.lookingFor && (
                    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: theme.muted, marginBottom: 16, lineHeight: 1.5 }}>
                        Looking for: <span style={{ color: theme.text, fontWeight: 600 }}>{project.lookingFor}</span>
                    </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, paddingTop: 16, borderTop: `1px solid ${theme.border}`, flexWrap: "wrap" }}>
                    <button onClick={onLike} style={{
                        flex: isMobile ? 1 : undefined,
                        background: project.likedByMe ? theme.text : "transparent",
                        border: `1px solid ${project.likedByMe ? theme.text : theme.border}`,
                        color: project.likedByMe ? theme.bg : theme.muted,
                        padding: "8px 18px", borderRadius: 8, cursor: "pointer",
                        fontWeight: 500, fontSize: 13, transition: "all 0.15s", fontFamily: "inherit"
                    }}>
                        {project.likedByMe ? "Liked" : "Like"} · {project.likes}
                    </button>
                    <button onClick={onComment} style={{
                        flex: isMobile ? 1 : undefined,
                        background: "transparent", border: `1px solid ${theme.border}`,
                        color: theme.muted, padding: "8px 18px", borderRadius: 8,
                        cursor: "pointer", fontWeight: 500, fontSize: 13, fontFamily: "inherit"
                    }}>
                        Comment · {project.comments}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Comment Modal ─────────────────────────────────────────────────────────
export function CommentModal({ project, onAddComment, onClose }) {
    const isMobile = useIsMobile();
    const [text, setText] = useState("");
    const allComments = project.projectComments || [];

    return (
        <Modal title={`Comments`} onClose={onClose} wide>
            {/* Existing comments */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: isMobile ? 260 : 360, overflowY: "auto", marginBottom: 20 }}>
                {allComments.length === 0 ? (
                    <div style={{ color: theme.muted, textAlign: "center", padding: "32px 0", fontSize: 14 }}>No comments yet. Start the conversation!</div>
                ) : (
                    allComments.map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "14px", background: theme.surface, borderRadius: 10, border: `1px solid ${theme.border}` }}>
                            <Avatar initials={c.author.avatar} size={isMobile ? 30 : 36} hue={c.author.avatarHue} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
                                    <span style={{ color: theme.text, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.author.name}</span>
                                    <span style={{ color: theme.muted, fontSize: 11, flexShrink: 0 }}>{c.time}</span>
                                </div>
                                <p style={{ margin: 0, color: theme.muted, fontSize: 13, lineHeight: 1.6, wordBreak: "break-word" }}>{c.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {!isMobile && <Avatar initials={USERS[0].avatar} size={36} hue={USERS[0].avatarHue} />}
                <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        value={text} onChange={e => setText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && text.trim()) { onAddComment(text); setText(""); } }}
                        placeholder="Write a comment…"
                        style={{ flex: 1, width: "100%", boxSizing: "border-box", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "10px 14px", color: theme.text, fontSize: isMobile ? "16px" : 14, outline: "none", fontFamily: "inherit" }}
                    />
                    <Button small primary onClick={() => { if (text.trim()) { onAddComment(text); setText(""); } }}>Post</Button>
                </div>
            </div>
        </Modal>
    );
}

// ─── New Project Modal ─────────────────────────────────────────────────────
export function NewProjectModal({ onClose, onSubmit, communityId }) {
    const isMobile = useIsMobile();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState("");
    const [lookingFor, setLookingFor] = useState("");
    const [type, setType] = useState("showcase");

    function handleSubmit() {
        if (!title.trim()) return;
        onSubmit({
            title, desc, tags: tags.split(",").map(t => t.trim()).filter(Boolean),
            lookingFor: lookingFor.trim() || null, type, communityId,
            imageHue: Math.floor(Math.random() * 360), imageLabel: title.substring(0, 6)
        });
        onClose();
    }

    return (
        <Modal title="Post a Project" onClose={onClose} wide>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Input label="Project Title *" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Campus Event Finder" />
                <Input label="Description *" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this project? What did you build or create?" multiline rows={4} />
                <Input label="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} placeholder="React, AI, Mobile" />
                <Input label="Looking for (optional)" value={lookingFor} onChange={e => setLookingFor(e.target.value)} placeholder="e.g. Designer, Backend Developer" />
                <div>
                    <label style={{ color: theme.muted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8 }}>Project Type</label>
                    <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row" }}>
                        {["showcase", "startup"].map(t => (
                            <button key={t} onClick={() => setType(t)} style={{
                                width: isMobile ? "100%" : "auto", flex: isMobile ? "none" : 1,
                                padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                                border: `1px solid ${type === t ? theme.text : theme.border}`,
                                background: type === t ? theme.text : "transparent",
                                color: type === t ? theme.bg : theme.muted,
                                fontFamily: "inherit", fontWeight: 500, fontSize: 13, textTransform: "capitalize"
                            }}>{t}</button>
                        ))}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8, flexDirection: isMobile ? "column" : "row" }}>
                    <Button small onClick={onClose} style={{ flex: isMobile ? 1 : "none" }}>Cancel</Button>
                    <Button small primary onClick={handleSubmit} disabled={!title.trim()} style={{ flex: isMobile ? 1 : "none" }}>Post Project</Button>
                </div>
            </div>
        </Modal>
    );
}
