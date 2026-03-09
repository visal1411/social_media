import { theme } from "../theme";
import { Avatar, Button, MockImage, PageHeader, Tag } from "../components/UI";
import { COMMUNITIES, USERS, CHALLENGES } from "../data/mockData";
import { ProjectCard, CommentModal, NewProjectModal } from "../components/ProjectComponents";
import { useIsMobile } from "../hooks/useIsMobile";

export default function HomePage({
    projects, joinedCommunities, enteredChallenges,
    onLike, onComment, onAddComment, commentModalId, onCloseComment,
    onJoinChallenge, onEnterCommunity
}) {
    const isMobile = useIsMobile();
    const me = USERS[0];
    const currentCommentProject = commentModalId ? projects.find(p => p.id === commentModalId) : null;

    const feedProjects = projects.filter(p => joinedCommunities.includes(p.communityId));
    const myCommunities = COMMUNITIES.filter(c => joinedCommunities.includes(c.id));
    const featuredChallenge = CHALLENGES[0];

    return (
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>
            {/* Main Feed */}
            <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 20 : 24, margin: "0 0 6px", letterSpacing: "-0.5px" }}>
                        Welcome back, {me.name.split(" ")[0]}
                    </h1>
                    <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Here's what's happening in your communities.</p>
                </div>

                {/* Active challenge banner */}
                {featuredChallenge && (
                    <div style={{ background: theme.surface, border: `1px solid ${theme.border} `, borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 12 }}>
                        <div>
                            <div style={{ color: theme.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Active Challenge</div>
                            <div style={{ color: theme.text, fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{featuredChallenge.title}</div>
                            <div style={{ color: theme.muted, fontSize: 12 }}>{featuredChallenge.participants} participants · {featuredChallenge.deadline}</div>
                        </div>
                        <Button primary small onClick={() => onJoinChallenge(featuredChallenge.id)} style={{ flexShrink: 0 }}>
                            {enteredChallenges.includes(featuredChallenge.id) ? "Joined" : "Join Challenge"}
                        </Button>
                    </div>
                )}

                {/* My Communities (mobile only — show inline) */}
                {isMobile && myCommunities.length > 0 && (
                    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
                        {myCommunities.map(c => (
                            <button key={c.id} onClick={() => onEnterCommunity(c.id)} style={{
                                display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
                                background: theme.card, border: `1px solid ${theme.border} `, borderRadius: 10,
                                padding: "8px 14px", cursor: "pointer", fontFamily: "inherit"
                            }}>
                                <div style={{ width: 22, height: 22, borderRadius: 6, background: `hsl(${c.hue}, 40 %, 14 %)`, display: "flex", alignItems: "center", justifyContent: "center", color: `hsl(${c.hue}, 60 %, 60 %)`, fontWeight: 800, fontSize: 10 }}>{c.abbr[0]}</div>
                                <span style={{ color: theme.text, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>{c.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Feed */}
                {feedProjects.length === 0 ? (
                    <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border} `, padding: isMobile ? 32 : 60, textAlign: "center" }}>
                        <div style={{ color: theme.text, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Your feed is empty</div>
                        <div style={{ color: theme.muted, fontSize: 13, marginBottom: 20 }}>Join communities to see projects here.</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {feedProjects.map(p => (
                            <ProjectCard key={p.id} project={p} onLike={() => onLike(p.id)} onComment={() => onComment(p.id)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Sidebar — desktop only */}
            {!isMobile && (
                <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* My communities */}
                    <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border} `, padding: 18 }}>
                        <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>My Communities</div>
                        {myCommunities.length === 0 ? (
                            <div style={{ color: theme.muted, fontSize: 13 }}>None joined yet.</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {myCommunities.map(c => (
                                    <button key={c.id} onClick={() => onEnterCommunity(c.id)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "left", fontFamily: "inherit" }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsl(${c.hue}, 40 %, 14 %)`, border: `1px solid hsl(${c.hue}, 35 %, 22 %)`, display: "flex", alignItems: "center", justifyContent: "center", color: `hsl(${c.hue}, 60 %, 60 %)`, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{c.abbr[0]}</div>
                                        <div>
                                            <div style={{ color: theme.text, fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                                            <div style={{ color: theme.muted, fontSize: 11 }}>{(c.members / 1000).toFixed(1)}k members</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Featured */}
                    <div style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border} `, padding: 18 }}>
                        <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Featured</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {projects.filter(p => p.isFeatured).slice(0, 3).map(p => (
                                <div key={p.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `hsl(${p.imageHue}, 40 %, 14 %)`, border: `1px solid ${theme.border} `, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: `hsl(${p.imageHue}, 55 %, 60 %)`, fontSize: 10, fontWeight: 700 }}>{p.imageLabel.substring(0, 3)}</div>
                                    <div>
                                        <div style={{ color: theme.text, fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</div>
                                        <div style={{ color: theme.muted, fontSize: 11, marginTop: 2 }}>{p.likes} likes</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {currentCommentProject && (
                <CommentModal project={currentCommentProject} onAddComment={text => onAddComment(currentCommentProject.id, text)} onClose={onCloseComment} />
            )}
        </div>
    );
}
