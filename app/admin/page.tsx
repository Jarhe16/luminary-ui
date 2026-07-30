"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  tier: string;
  created_at: string;
  total_audits: number;
  high_audits: number;
  last_audit: string | null;
};

type Stats = {
  total_users: number;
  total_audits: number;
  audits_this_month: number;
  high_findings_this_month: number;
};

const TIERS = ["foundation", "accelerator", "pinnacle"] as const;
const TIER_LABELS: Record<string, string> = {
  foundation:  "Foundation",
  accelerator: "Accelerator",
  pinnacle:    "Pinnacle",
};
const TIER_COLORS: Record<string, string> = {
  foundation:  "#6b7280",
  accelerator: "#3b82f6",
  pinnacle:    "#c9a84c",
};

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div style={{ flex: 1, minWidth: "140px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.1rem 1.25rem" }}>
      <div style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.replace("/");
      return;
    }
    fetchData();
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
    }
    setLoading(false);
  };

  const updateUser = async (userId: number, field: "tier" | "role", value: string) => {
    setSaving(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, [field]: value }),
    });
    await fetchData();
    setSaving(null);
  };

  const filtered = users.filter(u => {
    const matchSearch = search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || u.tier === tierFilter;
    return matchSearch && matchTier;
  });

  if (status === "loading" || loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading admin dashboard...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent)", letterSpacing: "0.05em" }}>LUMINARY FINANCIAL</div>
          <div style={{ fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Admin Dashboard</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/" style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none" }}>← Platform</a>
          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            style={{ fontSize: "0.8rem", color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 12px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>

        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <StatCard label="Total Users" value={stats.total_users} />
            <StatCard label="Total Audits" value={stats.total_audits} />
            <StatCard label="Audits This Month" value={stats.audits_this_month} />
            <StatCard label="High Findings (MTD)" value={stats.high_findings_this_month ?? 0} sub="across all accounts" />
          </div>
        )}

        {/* User table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>User Accounts</h2>
              <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--muted)" }}>{filtered.length} of {users.length} users</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: "6px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "0.82rem", outline: "none", width: "200px" }}
              />
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
                style={{ padding: "6px 12px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--foreground)", fontSize: "0.82rem", outline: "none", cursor: "pointer" }}
              >
                <option value="all">All Tiers</option>
                {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["User", "Tier", "Role", "Audits", "High Flags", "Last Active", "Actions"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
                      No users match your search.
                    </td>
                  </tr>
                )}
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                  >
                    {/* User */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--foreground)" }}>{user.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "2px" }}>{user.email}</div>
                    </td>

                    {/* Tier selector */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <select
                        value={user.tier}
                        disabled={saving === user.id}
                        onChange={e => updateUser(user.id, "tier", e.target.value)}
                        style={{
                          padding: "4px 8px",
                          background: "var(--surface-2)",
                          border: `1px solid ${TIER_COLORS[user.tier] ?? "var(--border)"}`,
                          borderRadius: "5px",
                          color: TIER_COLORS[user.tier] ?? "var(--foreground)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: saving === user.id ? "not-allowed" : "pointer",
                          outline: "none",
                        }}
                      >
                        {TIERS.map(t => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                      </select>
                    </td>

                    {/* Role selector */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      <select
                        value={user.role}
                        disabled={saving === user.id || user.id === Number(session?.user?.id)}
                        onChange={e => updateUser(user.id, "role", e.target.value)}
                        style={{
                          padding: "4px 8px",
                          background: "var(--surface-2)",
                          border: `1px solid ${user.role === "admin" ? "var(--accent)" : "var(--border)"}`,
                          borderRadius: "5px",
                          color: user.role === "admin" ? "var(--accent)" : "var(--muted)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: saving === user.id ? "not-allowed" : "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Audit count */}
                    <td style={{ padding: "0.875rem 1rem", color: "var(--foreground)", fontWeight: 600 }}>
                      {user.total_audits}
                    </td>

                    {/* High flags */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      {user.high_audits > 0
                        ? <span style={{ color: "#e74c3c", fontWeight: 700 }}>{user.high_audits}</span>
                        : <span style={{ color: "var(--muted)" }}>—</span>
                      }
                    </td>

                    {/* Last active */}
                    <td style={{ padding: "0.875rem 1rem", color: "var(--muted)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                      {user.last_audit
                        ? new Date(user.last_audit + "Z").toLocaleDateString()
                        : "Never"}
                    </td>

                    {/* Saving indicator */}
                    <td style={{ padding: "0.875rem 1rem" }}>
                      {saving === user.id
                        ? <span style={{ fontSize: "0.75rem", color: "var(--accent)" }}>Saving...</span>
                        : <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                            Joined {new Date(user.created_at + "Z").toLocaleDateString()}
                          </span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
