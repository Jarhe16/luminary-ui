"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy to continue.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, acceptedTerms: agreed }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed.");
    } else {
      router.push("/auth/login?registered=true");
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "1rem 2rem", background: "var(--surface)" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>
          LUMINARY FINANCIAL
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Compliance Intelligence Platform
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--foreground)" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
            Start your free 7-day trial — 3 audits, no credit card required.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@firm.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="Min. 8 characters" />
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
                style={{ marginTop: "3px", accentColor: "var(--accent)", cursor: "pointer" }}
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" target="_blank" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" target="_blank" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>
              </span>
            </label>

            {error && (
              <div style={{ background: "#2d1212", border: "1px solid #e74c3c", borderRadius: "6px", padding: "0.75rem 1rem", color: "#e74c3c", fontSize: "0.85rem" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px",
                background: loading ? "var(--surface-2)" : "var(--accent)",
                color: loading ? "var(--muted)" : "#0d0f1a",
                border: "none",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  color: "var(--foreground)",
  fontSize: "0.9rem",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  color: "var(--muted)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};
