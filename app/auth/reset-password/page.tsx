"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
        This reset link is missing or incomplete.{" "}
        <Link href="/auth/forgot-password" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Request a new link</Link>.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setLoading(true);
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      } else {
        router.push("/auth/login?reset=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={labelStyle}>New Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="Min. 8 characters" />
      </div>
      <div>
        <label style={labelStyle}>Confirm New Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} placeholder="Re-enter password" />
      </div>
      {error && (
        <div style={{ background: "#2d1212", border: "1px solid #e74c3c", borderRadius: "6px", padding: "0.75rem 1rem", color: "#e74c3c", fontSize: "0.85rem" }}>
          {error}{" "}
          {error.includes("expired") && (
            <Link href="/auth/forgot-password" style={{ color: "var(--accent)", fontWeight: 600 }}>Request a new link</Link>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px", background: loading ? "var(--surface-2)" : "var(--accent)", color: loading ? "var(--muted)" : "#0d0f1a",
          border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.25rem",
        }}
      >
        {loading ? "Updating..." : "Set New Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid var(--border)", padding: "1rem 2rem", background: "var(--surface)" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>LUMINARY FINANCIAL</div>
        <div style={{ fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Compliance Intelligence Platform</div>
      </header>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--foreground)" }}>Choose a New Password</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>Enter a new password for your Luminary account.</p>
          <Suspense fallback={<div style={{ color: "var(--muted)" }}>Loading...</div>}>
            <ResetForm />
          </Suspense>
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
