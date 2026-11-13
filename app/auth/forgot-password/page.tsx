"use client";

import { useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "1rem 2rem", background: "var(--surface)" }}>
        <BrandLogo />
      </header>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--foreground)" }}>Forgot Password</h1>

          {sent ? (
            <>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: "1rem 0 1.5rem" }}>
                If an account exists for <strong style={{ color: "var(--foreground)" }}>{email}</strong>, we&apos;ve sent a link to reset your password. The link expires in 60 minutes. Check your spam folder if you don&apos;t see it.
              </p>
              <Link href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>← Back to Sign In</Link>
            </>
          ) : (
            <>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
                Enter the email you signed up with and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@firm.com" />
                </div>
                {error && <div style={errorStyle}>{error}</div>}
                <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                Remembered it?{" "}
                <Link href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: "6px", color: "var(--foreground)", fontSize: "0.9rem", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", color: "var(--muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em",
};
const errorStyle: React.CSSProperties = {
  background: "#2d1212", border: "1px solid #e74c3c", borderRadius: "6px", padding: "0.75rem 1rem", color: "#e74c3c", fontSize: "0.85rem",
};
const buttonStyle = (loading: boolean): React.CSSProperties => ({
  padding: "10px", background: loading ? "var(--surface-2)" : "var(--accent)", color: loading ? "var(--muted)" : "#0d0f1a",
  border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem",
});
