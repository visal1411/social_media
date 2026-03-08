import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";

export default function LoginPage({ onLoginSuccess }) {
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
      minHeight: "100vh", background: `linear-gradient(135deg, ${theme.bg}, ${theme.card})`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <div style={{
        background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}`,
        padding: "40px", maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <h1 style={{ color: theme.text, fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>HobbyHub</h1>
          <p style={{ color: theme.muted, fontSize: 13, margin: 0 }}>{isSignup ? "Create your account" : "Welcome back"}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isSignup && (
            <input
              type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              style={{
                padding: "12px 14px", background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 10, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit"
              }}
            />
          )}
          <input
            type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px 14px", background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: 10, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit"
            }}
          />
          <input
            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 14px", background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: 10, color: theme.text, fontSize: 14, outline: "none", fontFamily: "inherit"
            }}
          />

          {error && <div style={{ color: theme.pink, fontSize: 12, padding: "8px 12px", background: theme.pink + "15", borderRadius: 8 }}>❌ {error}</div>}

          <button type="submit" style={{
            padding: "12px 20px", background: "linear-gradient(135deg,#7c6df5,#6357e8)", border: "none",
            borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8
          }}>
            {isSignup ? "Create Account" : "Sign In"}
          </button>

          <button
            type="button" onClick={() => { setIsSignup(!isSignup); setError(""); }}
            style={{
              padding: "10px 20px", background: "none", border: `1px solid ${theme.border}`,
              borderRadius: 10, color: theme.muted, fontWeight: 600, fontSize: 13, cursor: "pointer"
            }}
          >
            {isSignup ? "Already have an account? Sign in" : "New? Create account"}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 11, color: theme.muted, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px" }}>Demo credentials:</p>
          <p style={{ margin: 0 }}>📧 alex@hobbyhub.com</p>
          <p style={{ margin: "4px 0 0" }}>🔑 password123</p>
        </div>
      </div>
    </div>
  );
}
