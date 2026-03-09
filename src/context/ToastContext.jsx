import { createContext, useContext, useState, useCallback, useRef } from "react";
import { theme } from "../theme";

const ToastContext = createContext(null);

// ─── Toast types config ────────────────────────────────────────────────────
const TOAST_STYLES = {
    success: { border: "#22c55e40", icon: "✓", iconBg: "#14532d", iconColor: "#4ade80" },
    error: { border: "#ef444440", icon: "✕", iconBg: "#450a0a", iconColor: "#f87171" },
    info: { border: "#3b82f640", icon: "·", iconBg: "#1e3a5f", iconColor: "#60a5fa" },
    warning: { border: "#f59e0b40", icon: "!", iconBg: "#451a03", iconColor: "#fbbf24" },
};

// ─── Individual Toast ─────────────────────────────────────────────────────
function Toast({ toast, onRemove }) {
    const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

    return (
        <div
            style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                background: theme.card,
                border: `1px solid ${s.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                minWidth: 280, maxWidth: 380,
                animation: "toast-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                position: "relative", overflow: "hidden",
            }}
        >
            {/* Progress bar */}
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: s.border,
                animation: `toast-progress ${toast.duration}ms linear forwards`,
            }} />

            {/* Icon */}
            <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: s.iconBg, display: "flex", alignItems: "center",
                justifyContent: "center", color: s.iconColor, fontSize: 13, fontWeight: 700,
            }}>
                {s.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                    <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, marginBottom: toast.message ? 3 : 0 }}>
                        {toast.title}
                    </div>
                )}
                {toast.message && (
                    <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.5 }}>{toast.message}</div>
                )}
            </div>

            {/* Close */}
            <button
                onClick={() => onRemove(toast.id)}
                style={{
                    background: "none", border: "none", color: theme.muted,
                    cursor: "pointer", fontSize: 14, padding: 0, flexShrink: 0,
                    lineHeight: 1, display: "flex", alignItems: "center",
                }}
            >✕</button>
        </div>
    );
}

// ─── Toast Container ──────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;
    return (
        <>
            <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(48px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)     scale(1); }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
            <div style={{
                position: "fixed", bottom: 24, right: 24,
                display: "flex", flexDirection: "column", gap: 10,
                zIndex: 9999, pointerEvents: "none",
            }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: "all" }}>
                        <Toast toast={t} onRemove={onRemove} />
                    </div>
                ))}
            </div>
        </>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timerRefs = useRef({});

    const remove = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        clearTimeout(timerRefs.current[id]);
        delete timerRefs.current[id];
    }, []);

    const toast = useCallback(({ title, message, type = "info", duration = 3500 }) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-4), { id, title, message, type, duration }]);
        timerRefs.current[id] = setTimeout(() => remove(id), duration);
    }, [remove]);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={remove} />
        </ToastContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}
