"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const TIERS = [
  {
    key:         "foundation",
    name:        "Foundation",
    price:       "$997",
    period:      "/month",
    description: "Perfect for independent RIAs getting started with compliance automation.",
    features:    ["10 audits per month", "PDF export", "Audit history", "Email support"],
    color:       "#6b7280",
    highlight:   false,
  },
  {
    key:         "accelerator",
    name:        "Accelerator",
    price:       "$2,500",
    period:      "/month",
    description: "For growing RIA firms with higher document volume and team needs.",
    features:    ["50 audits per month", "PDF export", "Audit history", "Priority email support", "Multi-user access"],
    color:       "#3b82f6",
    highlight:   true,
  },
  {
    key:         "pinnacle",
    name:        "Pinnacle",
    price:       "$4,500",
    period:      "/month",
    description: "Enterprise-grade compliance for large RIA firms and institutions.",
    features:    ["Unlimited audits", "PDF export", "Audit history", "Dedicated support", "Multi-user access", "Custom rule sets"],
    color:       "#c9a84c",
    highlight:   false,
  },
];

function PricingContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const currentTier = (session?.user as any)?.tier ?? "foundation";

  useEffect(() => {
    if (searchParams.get("success")) {
      setBanner({ type: "success", message: "Subscription activated! Your tier has been upgraded." });
    }
    if (searchParams.get("cancelled")) {
      setBanner({ type: "error", message: "Checkout cancelled. No charge was made." });
    }
  }, [searchParams]);

  const handleSubscribe = async (tierKey: string) => {
    setLoading(tierKey);
    setBanner(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ tier: tierKey }),
      });

      const text = await res.text();
      if (!text) {
        setBanner({ type: "error", message: "Server returned an empty response. Check the console." });
        return;
      }

      const data = JSON.parse(text);
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBanner({ type: "error", message: data.error || "Something went wrong." });
      }
    } catch (err: any) {
      setBanner({ type: "error", message: err.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>LUMINARY FINANCIAL</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Compliance Intelligence Platform</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none" }}>← Dashboard</Link>
          <button onClick={() => signOut({ callbackUrl: "/auth/login" })} style={{ fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Page title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Choose Your Plan
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Scale your compliance operations with AI-powered auditing.
          </p>
        </div>

        {/* Banner */}
        {banner && (
          <div style={{
            background: banner.type === "success" ? "#0e2d1a" : "#2d1212",
            border: `1px solid ${banner.type === "success" ? "#27ae60" : "#e74c3c"}`,
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            color: banner.type === "success" ? "#27ae60" : "#e74c3c",
            fontSize: "0.875rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}>
            {banner.message}
          </div>
        )}

        {/* Pricing cards */}
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {TIERS.map(tier => {
            const isCurrent  = currentTier === tier.key;
            const isLoading  = loading === tier.key;

            return (
              <div key={tier.key} style={{
                flex: "1",
                minWidth: "260px",
                maxWidth: "300px",
                background: "var(--surface)",
                border: `2px solid ${tier.highlight ? tier.color : isCurrent ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "12px",
                padding: "2rem 1.5rem",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}>
                {tier.highlight && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: tier.color, color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "3px 14px", borderRadius: "20px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: "absolute", top: "-12px", right: "1rem", background: "var(--accent)", color: "#0d0f1a", fontSize: "0.7rem", fontWeight: 700, padding: "3px 14px", borderRadius: "20px", letterSpacing: "0.1em" }}>
                    Current Plan
                  </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: tier.color, fontWeight: 700, marginBottom: "0.5rem" }}>
                    {tier.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--foreground)" }}>{tier.price}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{tier.period}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                    {tier.description}
                  </p>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ fontSize: "0.85rem", color: "#a0a8c0", padding: "0.35rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: tier.color, fontWeight: 700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => !isCurrent && handleSubscribe(tier.key)}
                  disabled={isCurrent || isLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: isCurrent ? "var(--surface-2)" : tier.highlight ? tier.color : "var(--surface-2)",
                    color: isCurrent ? "var(--muted)" : tier.highlight ? "#fff" : tier.color,
                    border: `1px solid ${isCurrent ? "var(--border)" : tier.color}`,
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: isCurrent ? "default" : "pointer",
                  }}
                >
                  {isCurrent ? "Current Plan" : isLoading ? "Redirecting..." : `Upgrade to ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", color: "var(--muted)" }}>
          All plans include a 14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
