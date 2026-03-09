import { theme } from "../theme";
import { useIsMobile } from "../hooks/useIsMobile";

// ─── Mock Image (replaces real photos) ──────────────────────────────────
export function MockImage({ hue, label, height = 200, borderRadius = 8, src }) {
    if (src) {
        return <img src={src} alt={label} style={{ width: "100%", height, borderRadius, objectFit: "cover", flexShrink: 0, display: "block" }} />;
    }
    return (
        <div style={{
            width: "100%", height, borderRadius,
            background: `linear-gradient(135deg, hsl(${hue},40%,12%) 0%, hsl(${hue},50%,18%) 100%)`,
            border: `1px solid hsl(${hue},30%,22%)`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            overflow: "hidden", position: "relative", flexShrink: 0
        }}>
            {/* abstract blobs */}
            <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: `hsl(${hue},60%,30%)`, opacity: 0.25, top: -30, right: -30 }} />
            <div style={{ position: "absolute", width: 80, height: 80, borderRadius: "50%", background: `hsl(${hue},70%,40%)`, opacity: 0.15, bottom: -20, left: 10 }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: `hsl(${hue},60%,65%)`, letterSpacing: 2, textTransform: "uppercase", zIndex: 1 }}>{label}</span>
        </div>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────
export function Avatar({ initials, size = 40, hue, bg, src }) {
    if (src) {
        return (
            <img src={src} alt={initials} style={{
                width: size, height: size, borderRadius: "50%", flexShrink: 0,
                objectFit: "cover", border: `1px solid ${hue != null ? `hsl(${hue},30%,28%)` : theme.border}`
            }} />
        );
    }
    const background = hue != null
        ? `hsl(${hue},40%,20%)`
        : bg || theme.surface;
    const color = hue != null ? `hsl(${hue},60%,65%)` : theme.muted;
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background, border: `1px solid ${hue != null ? `hsl(${hue},30%,28%)` : theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, color, fontSize: size * 0.35, fontFamily: "inherit"
        }}>{initials}</div>
    );
}

// ─── Badge ────────────────────────────────────────────────────────────────
export function Badge({ type }) {
    const isPremium = type === "premium";
    return (
        <span style={{
            background: isPremium ? theme.text : "transparent",
            color: isPremium ? theme.bg : theme.muted,
            border: `1px solid ${isPremium ? theme.text : theme.border}`,
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 12,
            letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 0
        }}>{isPremium ? "Pro" : "Free"}</span>
    );
}

// ─── Tag ─────────────────────────────────────────────────────────────────
const TAG_STYLES = {
    react: { hue: 200, icon: "⚛️" },
    music: { hue: 320, icon: "🎵" },
    ai: { hue: 150, icon: "✨" },
    mobile: { hue: 30, icon: "📱" },
    design: { hue: 280, icon: "🎨" },
    education: { hue: 50, icon: "📚" },
    default: { hue: 0, icon: "🏷️" }
};

export function Tag({ label }) {
    const key = Object.keys(TAG_STYLES).find(k => label.toLowerCase().includes(k)) || "default";
    const { hue, icon } = TAG_STYLES[key];
    const hasColor = key !== "default";

    return (
        <span style={{
            background: hasColor ? `hsl(${hue},40%,12%)` : theme.surface,
            color: hasColor ? `hsl(${hue},70%,70%)` : theme.muted,
            border: `1px solid ${hasColor ? `hsl(${hue},50%,30%)` : theme.border}`,
            boxShadow: hasColor ? `0 0 10px hsl(${hue},60%,30%, 0.3)` : "none",
            fontSize: 11, padding: "4px 10px", borderRadius: 16, fontWeight: 600,
            display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: 0.3
        }}>
            <span style={{ fontSize: 13 }}>{icon}</span>
            {label}
        </span>
    );
}

// ─── Button ───────────────────────────────────────────────────────────────
export function Button({ children, primary, small, danger, onClick = () => { }, style = {}, disabled }) {
    let bg = "transparent";
    let color = theme.text;
    let border = `1px solid ${theme.border}`;
    if (primary) { bg = theme.text; color = theme.bg; border = "none"; }
    if (danger) { bg = "transparent"; color = "#ef4444"; border = "1px solid #ef444440"; }
    if (disabled) { bg = theme.surface; color = theme.muted; border = `1px solid ${theme.border}`; }
    return (
        <button disabled={disabled} onClick={onClick} style={{
            background: bg, border, color,
            padding: small ? "6px 14px" : "10px 22px",
            borderRadius: 8, fontWeight: 600,
            fontSize: small ? 12 : 14, cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "opacity 0.2s", fontFamily: "inherit", ...style
        }}>{children}</button>
    );
}

// ─── Modal Wrapper ────────────────────────────────────────────────────────
export function Modal({ onClose, children, title, wide }) {
    const isMobile = useIsMobile();
    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 2000,
            padding: isMobile ? "12px 0 0" : 24
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: theme.card,
                borderRadius: isMobile ? "16px 16px 0 0" : 12,
                border: `1px solid ${theme.border}`,
                padding: isMobile ? "20px 20px 32px" : "28px",
                width: "100%", maxWidth: wide ? 700 : 500,
                maxHeight: isMobile ? "90vh" : "90vh",
                overflowY: "auto", boxShadow: "0 -8px 24px rgba(0,0,0,0.4)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? 16 : 24 }}>
                    <h3 style={{ margin: 0, color: theme.text, fontWeight: 700, fontSize: isMobile ? 16 : 18, letterSpacing: "-0.4px" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: theme.muted, fontSize: 20, cursor: "pointer", padding: 4 }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ─── Input ────────────────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, type = "text", multiline, rows = 4 }) {
    const isMobile = useIsMobile();
    const inputStyle = {
        width: "100%", background: theme.bg, border: `1px solid ${theme.border}`,
        borderRadius: 8, padding: "12px 14px", color: theme.text, fontSize: isMobile ? "16px" : 14,
        outline: "none", fontFamily: "inherit", resize: multiline ? "vertical" : undefined,
        boxSizing: "border-box"
    };
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {label && <label style={{ color: theme.muted, fontSize: 12, fontWeight: 500 }}>{label}</label>}
            {multiline
                ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={inputStyle} />
                : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
            }
        </div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
    return (
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div>
                <h1 style={{ margin: 0, color: theme.text, fontWeight: 700, fontSize: 26, letterSpacing: "-0.6px" }}>{title}</h1>
                {subtitle && <p style={{ margin: "6px 0 0", color: theme.muted, fontSize: 14 }}>{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────
export function StatBox({ value, label }) {
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ color: theme.text, fontWeight: 700, fontSize: 20 }}>{value}</div>
            <div style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>{label}</div>
        </div>
    );
}
