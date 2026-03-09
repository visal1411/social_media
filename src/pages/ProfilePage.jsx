import { useState } from "react";
import { theme } from "../theme";
import { Avatar, Badge, Button, Input, Modal, MockImage, Tag, PageHeader } from "../components/UI";
import { USERS } from "../data/mockData";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ProfilePage({ projects, onNavigate, onLogout }) {
    const isMobile = useIsMobile();
    const me = USERS[0];
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState(me.bio);
    const [skills, setSkills] = useState(me.skills.join(", "));
    const [draftBio, setDraftBio] = useState(me.bio);
    const [draftSkills, setDraftSkills] = useState(me.skills.join(", "));

    const myProjects = projects.filter(p => p.user.id === me.id);

    function saveProfile() {
        setBio(draftBio);
        setSkills(draftSkills);
        setEditing(false);
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Cover */}
            <div style={{ height: isMobile ? 120 : 160, background: `linear-gradient(135deg, hsl(${me.avatarHue},35%,10%), hsl(${me.avatarHue},45%,18%))`, borderRadius: 12, marginBottom: -50, border: `1px solid ${theme.border}` }} />

            {/* Card */}
            <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, padding: isMobile ? "60px 20px 24px" : "60px 24px 24px", marginBottom: 28 }}>
                {/* Avatar overlapping cover */}
                <div style={{ position: "relative", marginTop: -95, display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Avatar initials={me.avatar} size={isMobile ? 80 : 90} hue={me.avatarHue} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", flexDirection: isMobile ? "column" : "row", marginTop: 16, gap: 16, textAlign: isMobile ? "center" : "left" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 10, marginBottom: 4 }}>
                            <h2 style={{ margin: 0, color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 24, letterSpacing: "-0.5px" }}>{me.name}</h2>
                            <Badge type={me.badge} />
                        </div>
                        <div style={{ color: theme.muted, fontSize: 13, marginBottom: 8 }}>{me.major} · {me.year}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexDirection: isMobile ? "column" : "row", width: isMobile ? "100%" : "auto" }}>
                        <Button small onClick={() => { setDraftBio(bio); setDraftSkills(skills); setEditing(true); }} style={{ width: isMobile ? "100%" : "auto" }}>Edit Profile</Button>
                        {isMobile && <Button small danger onClick={onLogout} style={{ width: "100%" }}>Sign Out</Button>}
                    </div>
                </div>

                <p style={{ color: theme.text, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px", textAlign: isMobile ? "center" : "left" }}>{bio}</p>

                {/* Skills */}
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start", gap: 6, marginBottom: 20 }}>
                    {skills.split(",").map(s => s.trim()).filter(Boolean).map(s => <Tag key={s} label={s} />)}
                </div>

                {/* Stats */}
                <div style={{ display: "flex", justifyContent: isMobile ? "space-around" : "flex-start", gap: isMobile ? 0 : 32, borderTop: `1px solid ${theme.border}`, paddingTop: 20 }}>
                    <div style={{ textAlign: "center" }}><div style={{ color: theme.text, fontWeight: 700, fontSize: 18 }}>{myProjects.length}</div><div style={{ color: theme.muted, fontSize: 12 }}>Projects</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ color: theme.text, fontWeight: 700, fontSize: 18 }}>{me.followers}</div><div style={{ color: theme.muted, fontSize: 12 }}>Followers</div></div>
                    <div style={{ textAlign: "center" }}><div style={{ color: theme.text, fontWeight: 700, fontSize: 18 }}>{me.following}</div><div style={{ color: theme.muted, fontSize: 12 }}>Following</div></div>
                </div>
            </div>

            {/* My Projects */}
            <PageHeader title="My Projects" subtitle={`${myProjects.length} posted`} />
            {myProjects.length === 0 ? (
                <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, padding: 48, textAlign: "center", color: theme.muted }}>
                    You haven't posted any projects yet.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {myProjects.map(p => <ProjectMiniCard key={p.id} project={p} isMobile={isMobile} />)}
                </div>
            )}

            {/* Edit Modal */}
            {editing && (
                <Modal title="Edit Profile" onClose={() => setEditing(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <Input label="Bio" value={draftBio} onChange={e => setDraftBio(e.target.value)} placeholder="Tell the community about yourself..." multiline rows={3} />
                        <Input label="Skills (comma-separated)" value={draftSkills} onChange={e => setDraftSkills(e.target.value)} placeholder="React, Python, UI/UX" />
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexDirection: isMobile ? "column" : "row" }}>
                            <Button small onClick={() => setEditing(false)}>Cancel</Button>
                            <Button small primary onClick={saveProfile}>Save Changes</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function ProjectMiniCard({ project, isMobile }) {
    return (
        <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
            <MockImage hue={project.imageHue} label={project.imageLabel} height={isMobile ? 120 : 100} borderRadius={0} />
            <div style={{ padding: "14px 16px", flex: 1 }}>
                <div style={{ color: theme.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{project.title}</div>
                <div style={{ color: theme.muted, fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>{project.desc.substring(0, 80)}...</div>
                <div style={{ color: theme.muted, fontSize: 12 }}>{project.likes} likes · {project.comments} comments</div>
            </div>
        </div>
    );
}
