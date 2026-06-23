import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, KPI, Card, StatusPill } from "./shared";
import { STAFF_SYSTEM_USERS, type StaffSystemUser } from "@/data/staffDemo";
import { ROLE_BADGE_BG } from "@/data/demoAccounts";
import { Users, KeyRound, ShieldCheck, ClipboardList, Lock, Unlock, Mail } from "lucide-react";

export function SystemAdminDashboard({ view }: { view?: string }) {
  if (view === "audit") return <AuditView />;
  if (view === "settings") return <SettingsView />;
  return <UsersView />;
}

function UsersView() {
  const [users, setUsers] = useState<StaffSystemUser[]>(STAFF_SYSTEM_USERS);
  const toggleLock = (id: string) => {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, status: u.status === "Locked" ? "Active" : "Locked" } : u));
    toast.success("User status updated");
  };
  const resetPw = (name: string) => {
    toast.success(`Reset link sent to ${name}`);
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Workspace-wide accounts, lockouts &amp; password resets"
        actions={<button className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">+ Invite user</button>}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPI label="Total users" value={String(users.length)} accent="#0EA5E9" icon={<Users className="h-5 w-5" />} />
        <KPI label="Active" value={String(users.filter((u) => u.status === "Active").length)} accent="#059669" icon={<ShieldCheck className="h-5 w-5" />} />
        <KPI label="Locked" value={String(users.filter((u) => u.status === "Locked").length)} accent="#DC2626" icon={<Lock className="h-5 w-5" />} />
        <KPI label="Pending invites" value={String(users.filter((u) => u.status === "Invited").length)} accent="#7C3AED" icon={<Mail className="h-5 w-5" />} />
      </div>

      <div className="mt-6">
        <Card title={`All workspace users (${users.length})`}>
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="py-2">User</th><th>Role</th><th>Branch</th><th>Status</th><th>Last login</th><th className="text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: ROLE_BADGE_BG[u.role as keyof typeof ROLE_BADGE_BG] ?? "#6B7280" }}>
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div><div className="font-bold">{u.name}</div><div className="text-[11px] text-muted-foreground">{u.email}</div></div>
                    </div>
                  </td>
                  <td className="text-xs">{u.role.replace("_", " ")}</td>
                  <td className="text-xs">{u.branch}</td>
                  <td><StatusPill status={u.status} /></td>
                  <td className="text-xs text-muted-foreground">{u.lastLogin}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => resetPw(u.name)} className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] font-bold hover:bg-muted"><KeyRound className="h-3 w-3" /> Reset</button>
                      <button onClick={() => toggleLock(u.id)} className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${u.status === "Locked" ? "bg-emerald-600 text-white" : "border border-border hover:bg-muted"}`}>
                        {u.status === "Locked" ? <><Unlock className="h-3 w-3" /> Unlock</> : <><Lock className="h-3 w-3" /> Lock</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function AuditView() {
  const events = [
    { at: "10:42:18", actor: "Dr. Aisha Moosa", action: "Approved Rx", target: "RX-2026-001139", ip: "196.43.x.x" },
    { at: "10:41:02", actor: "Lungelo Zulu", action: "Assigned driver", target: "P2-2026-3299 → Siphamandla", ip: "196.43.x.x" },
    { at: "10:38:55", actor: "Michael Pretorius", action: "Approved expense", target: "EXP-2026-0040", ip: "196.43.x.x" },
    { at: "10:32:11", actor: "Kefilwe Sithole", action: "POS sale", target: "P2-2026-3300 · $34.50", ip: "196.43.x.x" },
    { at: "10:30:45", actor: "Rumbidzai Chigumba", action: "Signed in", target: "Web portal", ip: "196.43.x.x" },
    { at: "10:28:09", actor: "Sipho Mahlangu", action: "Created PO", target: "PO-2026-0118", ip: "196.43.x.x" },
    { at: "10:25:33", actor: "Tendai Moyo", action: "Unlocked user", target: "Tendai Nyathi (STF-0102)", ip: "196.43.x.x" },
  ];
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Real-time activity across the workspace" />
      <Card>
        <ul className="divide-y divide-border text-sm">
          {events.map((e, i) => (
            <li key={i} className="grid grid-cols-[80px_1fr_auto] items-center gap-3 py-2">
              <span className="font-mono text-[11px] text-muted-foreground">{e.at}</span>
              <div>
                <div><span className="font-bold">{e.actor}</span> · {e.action}</div>
                <div className="text-[11px] text-muted-foreground">{e.target}</div>
              </div>
              <span className="text-[10px] text-muted-foreground">{e.ip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SettingsView() {
  return (
    <div>
      <PageHeader title="System Settings" />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Password policy", desc: "Min length 8, complexity required, 90-day rotation", action: "Edit" },
          { title: "2-Factor authentication", desc: "Required for all staff above Cashier", action: "Manage" },
          { title: "Session timeout", desc: "Auto sign-out after 30 min idle", action: "Edit" },
          { title: "Backup schedule", desc: "Daily at 02:00 SAST · Last: ✓ 02:00 today", action: "Configure" },
          { title: "Branch configuration", desc: "3 active branches, 1 in setup", action: "Open" },
          { title: "API access", desc: "0 third-party integrations enabled", action: "Manage" },
        ].map((s) => (
          <div key={s.title} className="flex items-center justify-between rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <div><div className="text-sm font-bold">{s.title}</div><div className="text-xs text-muted-foreground">{s.desc}</div></div>
            </div>
            <button className="rounded border border-primary px-2 py-1 text-[10px] font-bold text-primary">{s.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}