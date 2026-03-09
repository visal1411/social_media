import { theme } from "../theme";
import { Button } from "../components/UI";
import { CHALLENGES, COMMUNITIES } from "../data/mockData";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ChallengesPage({ enteredChallenges, onToggleChallenge }) {
    const isMobile = useIsMobile();
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 22 : 26, margin: "0 0 6px", letterSpacing: "-0.5px" }}>Challenges</h1>
                <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>Push your skills. Win recognition.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {CHALLENGES.map(c => {
                    const entered = enteredChallenges.includes(c.id);
                    const community = COMMUNITIES.find(co => co.id === c.communityId);
                    return (
                        <div key={c.id} style={{ background: theme.card, borderRadius: 12, border: `1px solid ${theme.border}`, overflow: "hidden" }}>
                            <div style={{ height: 4, background: `hsl(${c.hue},60%,40%)` }} />
                            <div style={{ padding: isMobile ? "18px 16px" : "22px 24px" }}>
                                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-start", gap: 16 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: `hsl(${c.hue},55%,60%)`, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                                            {community?.name}
                                        </div>
                                        <h3 style={{ color: theme.text, fontWeight: 700, fontSize: isMobile ? 16 : 18, margin: "0 0 8px", letterSpacing: "-0.3px" }}>{c.title}</h3>
                                        <p style={{ color: theme.muted, fontSize: 13, lineHeight: 1.65, margin: "0 0 14px" }}>{c.desc}</p>
                                        <div style={{ display: "flex", gap: 16, fontSize: 13, color: theme.muted }}>
                                            <span>{c.participants} participants</span>
                                            <span>{c.deadline}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", gap: 12, flexShrink: 0, width: isMobile ? "100%" : 160 }}>
                                        <div style={{ background: `hsl(${c.hue},40%,12%)`, border: `1px solid hsl(${c.hue},35%,22%)`, borderRadius: 10, padding: "10px 16px", textAlign: "center", flex: isMobile ? 1 : undefined }}>
                                            <div style={{ color: theme.muted, fontSize: 10, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>Prize</div>
                                            <div style={{ color: `hsl(${c.hue},60%,65%)`, fontWeight: 700, fontSize: 12 }}>{c.prize}</div>
                                        </div>
                                        <Button
                                            small
                                            onClick={() => onToggleChallenge(c.id)}
                                            style={{
                                                flex: isMobile ? 1 : undefined,
                                                width: isMobile ? undefined : "100%",
                                                background: entered ? "transparent" : theme.text,
                                                color: entered ? theme.muted : theme.bg,
                                                border: entered ? `1px solid ${theme.border}` : "none",
                                                fontSize: 12
                                            }}
                                        >
                                            {entered ? "Withdraw" : "Enter Challenge"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
