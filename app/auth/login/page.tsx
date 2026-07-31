"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={labelStyle}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="you@firm.com" />
      </div>
      <div>
        <label style={labelStyle}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="••••••••" />
      </div>

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
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
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
            Sign In
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.75rem" }}>
            Access your compliance dashboard.
          </p>

          <Suspense fallback={<div style={{ color: "var(--muted)" }}>Loading...</div>}>
            <LoginForm />
          </Suspense>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
              Register
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
