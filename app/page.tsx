"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { generateAuditPDF } from "@/lib/exportPDF";

type Finding = {
  rule_id: string;
  clause_found: string;
  variance: string;
  severity: "HIGH" | "MED" | "LOW";
};

type AuditResult = {
  status: string;
  findings: Finding[];
};

type UsageInfo = {
  used: number;
  limit: number | null;
  tier: string;
  tierLabel: string;
};

type LimitError = {
  limitReached: true;
  tier: string;
  tierLabel: string;
  used: number;
  limit: number;
  nextTier: string | null;
  nextTierLabel: string | null;
  nextTierPrice: string | null;
};

type AuditRun = {
  id: number;
  filename: string;
  file_size_kb: number;
  finding_count: number;
  high_count: number;
  med_count: number;
  low_count: number;
  findings_json: string;
  created_at: string;
};

const SEV: Record<string, { bg: string; text: string; border: string; label: string }> = {
  HIGH: { bg: "#2d1212", text: "#e74c3c", border: "#e74c3c", label: "HIGH" },
  MED:  { bg: "#2d1e0e", text: "#e67e22", border: "#e67e22", label: "MED" },
  LOW:  { bg: "#0e2d1a", text: "#27ae60", border: "#27ae60", label: "LOW" },
};

function Badge({ severity }: { severity: string }) {
  const s = SEV[severity] ?? SEV.LOW;
  return (
    <span style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>
      {s.label}
    </span>
  );
}

function FindingCard({ finding, index }: { finding: Finding; index: number }) {
  const s = SEV[finding.severity] ?? SEV.LOW;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderLeft: `4px solid ${s.border}`, borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Finding {index + 1}</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginTop: "2px" }}>{finding.rule_id}</div>
        </div>
        <Badge severity={finding.severity} />
      </div>
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "4px" }}>Clause Identified</div>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "0.6rem 0.75rem", fontSize: "0.875rem", color: "#c5c8d6", fontStyle: "italic", lineHeight: 1.5 }}>
          &ldquo;{finding.clause_found}&rdquo;
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "4px" }}>Variance</div>
        <div style={{ fontSize: "0.875rem", color: "#a0a8c0", lineHeight: 1.6 }}>{finding.variance}</div>
      </div>
    </div>
  );
}

function SummaryBar({ findings }: { findings: Finding[] }) {
  const counts = { HIGH: 0, MED: 0, LOW: 0 };
  findings.forEach(f => { counts[f.severity as keyof typeof counts]++ });
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
      {(["HIGH", "MED", "LOW"] as const).map(sev => (
        <div key={sev} style={{ flex: 1, minWidth: "100px", background: "var(--surface)", border: `1px solid ${SEV[sev].border}`, borderRadius: "8px", padding: "0.75rem 1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: 800, color: SEV[sev].text }}>{counts[sev]}</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{SEV[sev].label} RISK</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawLog, setRawLog] = useState<string | null>(null);
  const [history, setHistory] = useState<AuditRun[]>([]);
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"audit" | "history">("audit");
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [limitError, setLimitError] = useState<LimitError | null>(null);

  useEffect(() => {
    if (activeTab === "history") fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    const res = await fetch("/api/history");
    if (res.ok) {
      const data = await res.json();
      setHistory(data.runs);
    }
  };

  const handleAudit = async () => {
    if (!file) { setError("Please select a file."); return; }
    setLoading(true); setError(null); setResult(null); setRawLog(null); setLimitError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/audit", { method: "POST", body: formData });
      const data = await response.json();

      if (data.limitReached) {
        setLimitError(data as LimitError);
        return;
      }

      if (!data.success) { setError(data.error || "Audit failed."); return; }

      if (data.findings) {
        setResult({ status: data.status, findings: data.findings });
        if (data.usage) setUsage(data.usage);
        fetchHistory();
      } else {
        setRawLog(data.log ?? "No output.");
      }
    } catch (err: any) {
      setError(`Request failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalFindings = result?.findings.length ?? 0;
  const highCount = result?.findings.filter(f => f.severity === "HIGH").length ?? 0;

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>LUMINARY FINANCIAL</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Compliance Intelligence Platform</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {session?.user && (
            <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
              {session.user.name}
            </span>
          )}
          {(session?.user as any)?.role === "admin" && (
            <a
              href="/admin"
              style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", border: "1px solid var(--accent)", borderRadius: "4px", padding: "4px 12px", fontWeight: 700 }}
            >
              Admin
            </a>
          )}
          <a
            href="/pricing"
            style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 12px" }}
          >
            Plans
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{ fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", marginBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          {(["audit", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.6rem 1.5rem",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeTab === tab ? "var(--accent)" : "var(--muted)",
                fontWeight: activeTab === tab ? 700 : 400,
                fontSize: "0.85rem",
                textTransform: "capitalize",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              {tab === "audit" ? "Run Audit" : "Audit History"}
            </button>
          ))}
        </div>

        {/* Audit Tab */}
        {activeTab === "audit" && (
          <>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.75rem", marginBottom: "2rem" }}>
              <h2 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 600 }}>Document Upload</h2>
              <p style={{ margin: "0 0 1.25rem", fontSize: "0.8rem", color: "var(--muted)" }}>
                Accepts .txt, .pdf, and .docx — fund prospectuses, disclosure documents, or offering memoranda.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <label style={{ display: "inline-block", padding: "8px 16px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", color: "var(--foreground)" }}>
                  {file ? file.name : "Choose File"}
                  <input type="file" accept=".txt,.pdf,.docx" style={{ display: "none" }} onChange={e => { setFile(e.target.files?.[0] ?? null); setError(null); setResult(null); setRawLog(null); }} />
                </label>
                {file && <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{(file.size / 1024).toFixed(1)} KB</span>}
                <button
                  onClick={handleAudit}
                  disabled={loading || !file}
                  style={{ padding: "8px 24px", background: loading || !file ? "var(--surface-2)" : "var(--accent)", color: loading || !file ? "var(--muted)" : "#0d0f1a", border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", cursor: loading || !file ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Analyzing..." : "Run Audit"}
                </button>
              </div>
              {loading && (
                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--accent)" }}>
                  ● Running compliance analysis via Claude...
                </div>
              )}
            </div>

            {/* Usage meter */}
            {usage && usage.limit !== null && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{usage.tierLabel} Plan</span>
                  {" — "}
                  <span style={{ color: usage.used >= usage.limit ? "#e74c3c" : "var(--foreground)" }}>
                    {usage.used} / {usage.limit} audits used this month
                  </span>
                </div>
                <div style={{ width: "160px", height: "6px", background: "var(--surface-2)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (usage.used / usage.limit) * 100)}%`, background: usage.used >= usage.limit ? "#e74c3c" : "var(--accent)", borderRadius: "3px", transition: "width 0.3s" }} />
                </div>
              </div>
            )}
            {usage && usage.limit === null && (
              <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1.5rem" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{usage.tierLabel} Plan</span> — Unlimited audits
              </div>
            )}

            {error && (
              <div style={{ background: "#2d1212", border: "1px solid #e74c3c", borderRadius: "8px", padding: "1rem 1.25rem", color: "#e74c3c", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                {error}
              </div>
            )}

            {limitError && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: "10px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--accent)", marginBottom: "0.5rem" }}>
                  Monthly Limit Reached
                </div>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", margin: "0 0 1rem" }}>
                  Your <strong style={{ color: "var(--foreground)" }}>{limitError.tierLabel} plan</strong> includes{" "}
                  <strong style={{ color: "var(--foreground)" }}>{limitError.limit} audits per month</strong>.
                  You&apos;ve used all {limitError.used} this month.
                </p>
                {limitError.nextTierLabel && (
                  <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Upgrade to</div>
                      <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)" }}>{limitError.nextTierLabel}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--accent)", marginTop: "2px" }}>{limitError.nextTierPrice}</div>
                    </div>
                    <a
                      href="/pricing"
                      style={{ padding: "8px 20px", background: "var(--accent)", color: "#0d0f1a", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}
                    >
                      View Plans
                    </a>
                  </div>
                )}
              </div>
            )}

            {result && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{result.status}</h2>
                    <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>
                      {totalFindings === 0 ? "No violations detected." : `${totalFindings} violation${totalFindings !== 1 ? "s" : ""} found${highCount > 0 ? ` — ${highCount} high severity` : ""}.`}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    {file && <span style={{ fontSize: "0.75rem", color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "4px" }}>{file.name}</span>}
                    <button
                      onClick={() => generateAuditPDF(result, file?.name ?? "audit", session?.user?.name ?? undefined)}
                      style={{ padding: "6px 16px", background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: "6px", color: "var(--accent)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      ↓ Export PDF
                    </button>
                  </div>
                </div>
                {totalFindings > 0 && <SummaryBar findings={result.findings} />}
                {totalFindings === 0 && (
                  <div style={{ background: "#0e2d1a", border: "1px solid #27ae60", borderRadius: "8px", padding: "1.25rem 1.5rem", color: "#27ae60", fontWeight: 600 }}>
                    ✓ No compliance violations detected.
                  </div>
                )}
                {result.findings.map((f, i) => <FindingCard key={i} finding={f} index={i} />)}
              </div>
            )}

            {rawLog && (
              <pre style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", overflowX: "auto", fontSize: "0.8rem", color: "#a0a8c0" }}>
                {rawLog}
              </pre>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1.25rem" }}>Past Audit Runs</h2>
            {history.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: "0.9rem", textAlign: "center", padding: "3rem 0" }}>
                No audit runs yet. Upload a document to get started.
              </div>
            )}
            {history.map(run => (
              <div key={run.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "0.75rem", overflow: "hidden" }}>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", cursor: "pointer", flexWrap: "wrap", gap: "0.5rem" }}
                  onClick={() => setExpandedRun(expandedRun === run.id ? null : run.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{run.filename}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>
                      {new Date(run.created_at + "Z").toLocaleString()} &bull; {run.file_size_kb} KB
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {run.high_count > 0 && <Badge severity="HIGH" />}
                    {run.med_count > 0  && <Badge severity="MED" />}
                    {run.low_count > 0  && <Badge severity="LOW" />}
                    {run.finding_count === 0 && <span style={{ fontSize: "0.75rem", color: "#27ae60", fontWeight: 600 }}>✓ Clean</span>}
                    <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{expandedRun === run.id ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expandedRun === run.id && (
                  <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.75rem", marginBottom: "0.5rem" }}>
                      <button
                        onClick={() => {
                          const findings = JSON.parse(run.findings_json);
                          generateAuditPDF(
                            { status: "Audit Complete", findings },
                            run.filename,
                            session?.user?.name ?? undefined
                          );
                        }}
                        style={{ padding: "5px 14px", background: "var(--surface-2)", border: "1px solid var(--accent)", borderRadius: "6px", color: "var(--accent)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}
                      >
                        ↓ Export PDF
                      </button>
                    </div>
                    {JSON.parse(run.findings_json).length === 0 ? (
                      <p style={{ color: "#27ae60", fontSize: "0.875rem", marginTop: "1rem" }}>✓ No violations found.</p>
                    ) : (
                      <div style={{ marginTop: "1rem" }}>
                        {JSON.parse(run.findings_json).map((f: Finding, i: number) => (
                          <FindingCard key={i} finding={f} index={i} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
