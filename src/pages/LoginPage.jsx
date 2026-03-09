import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { useIsMobile } from "../hooks/useIsMobile";

export default function LoginPage({ onLoginSuccess }) {
  const isMobile = useIsMobile();
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      const result = signup(email, password, name);
      if (result.success) onLoginSuccess();
      else setError(result.error);
    } else {
      const result = login(email, password);
      if (result.success) onLoginSuccess();
      else setError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "16px" : "24px", fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        background: theme.surface, borderRadius: 12, border: `1px solid ${theme.border}`,
        padding: isMobile ? "32px 20px" : "48px", maxWidth: 400, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: theme.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: theme.bg, fontWeight: 800, fontSize: 24, margin: "0 auto 24px" }}>H</div>
          <h1 style={{ color: theme.text, fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" }}>HobbyHub</h1>
          <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>{isSignup ? "Create an account to continue" : "Welcome back to HobbyHub"}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {isSignup && (
            <input
              type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", background: theme.bg, border: `1px solid ${theme.border}`, boxSizing: "border-box",
                borderRadius: 8, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border 0.2s"
              }}
            />
          )}
          <input
            type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px", background: theme.bg, border: `1px solid ${theme.border}`, boxSizing: "border-box",
              borderRadius: 8, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border 0.2s"
            }}
          />
          <input
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px", background: theme.bg, border: `1px solid ${theme.border}`, boxSizing: "border-box",
              borderRadius: 8, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border 0.2s"
            }}
          />

          {error && <div style={{ color: "rgba(239, 68, 68, 1)", fontSize: 13, padding: "12px", background: "rgba(239, 68, 68, 0.1)", borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.2)" }}>{error}</div>}

          <button type="submit" style={{
            width: "100%", padding: "12px 20px", background: theme.text, border: "none", boxSizing: "border-box",
            borderRadius: 8, color: theme.bg, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8, transition: "opacity 0.2s"
          }}>
            {isSignup ? "Create Account" : "Sign In"}
          </button>

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              type="button" onClick={() => { setIsSignup(!isSignup); setError(""); }}
              style={{
                background: "none", border: "none",
                color: theme.muted, fontWeight: 500, fontSize: 13, cursor: "pointer"
              }}
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${theme.border}`, fontSize: 12, color: theme.muted, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px" }}>Demo Access</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <span>alex@hobbyhub.com</span>
            <span>password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
