import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShop, formatZAR } from "@/store/shop";
import { useAuth, type Order } from "@/store/auth";
import { getProduct } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Package, Heart, MapPin, Settings, LayoutDashboard, FileText, Truck, LogOut, Phone, Syringe, Store } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Plus2 Pharmacy" }] }),
  component: AccountPage,
});

function AccountPage() {
  const user = useAuth((s) => s.user);
  const orders = useAuth((s) => s.orders);
  const prescriptions = useAuth((s) => s.prescriptions);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"dash" | "orders" | "scripts" | "wishlist" | "card" | "address" | "settings">("dash");
  const wishlist = useShop((s) => s.wishlist).map(getProduct).filter(Boolean);

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);
  if (!user) return null;

  const tabs = [
    { id: "dash", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "scripts", label: "Prescriptions", icon: FileText },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const onLogout = () => { logout(); toast.success("Signed out"); navigate({ to: "/" }); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-lg border border-[#E5E7EB] bg-[#F0F9F4] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">My Account</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">Welcome back, {user.firstName}</h1>
            <p className="mt-1 text-sm text-[#374151]">{orders.length} order{orders.length !== 1 ? "s" : ""} · {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} on file</p>
          </div>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="overflow-x-auto rounded-xl border border-border bg-card p-2 lg:p-3">
          <nav className="flex gap-1 lg:flex-col">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <Icon className="h-4 w-4" /> {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div>
          {tab === "dash" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-extrabold">Profile</h3>
                <div className="mt-3 space-y-1 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> <strong>{user.firstName} {user.lastName}</strong></div>
                  <div><span className="text-muted-foreground">Email:</span> <strong>{user.email}</strong></div>
                  {user.phone && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-muted-foreground" /> <strong>{user.phone}</strong></div>}
                </div>
                <Link to="/prescriptions" className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground hover:bg-primary-dark"><FileText className="h-3.5 w-3.5" /> Upload a new prescription</Link>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-extrabold">Active delivery</h3>
                {(() => {
                  const active = orders.find((o) => o.status !== "Delivered");
                  if (!active) return <p className="mt-3 text-sm text-muted-foreground">No active deliveries.</p>;
                  return (
                    <div className="mt-3 text-sm">
                      <div className="font-bold">{active.id}</div>
                      <div className="text-muted-foreground">{active.date} · {formatZAR(active.total)}</div>
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{active.status}</span>
                      <Link to="/track" search={{ order: active.id }} className="mt-3 flex items-center gap-1 text-sm font-bold text-primary hover:underline"><Truck className="h-4 w-4" /> Track delivery →</Link>
                    </div>
                  );
                })()}
              </div>
              <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
                <h3 className="font-extrabold">Quick Links</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Link to="/prescriptions" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary"><FileText className="h-4 w-4" /> Upload Script</Link>
                  <Link to="/track" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary"><Truck className="h-4 w-4" /> Track Order</Link>
                  <Link to="/services" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary"><Syringe className="h-4 w-4" /> Vaccinations</Link>
                  <Link to="/services" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary"><Store className="h-4 w-4" /> Find Store</Link>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                  <Stat label="Orders" value={orders.length} />
                  <Stat label="Pending scripts" value={prescriptions.filter((p) => p.status === "Pending").length} />
                  <Stat label="Wishlist" value={wishlist.length} />
                </div>
              </div>
            </div>
          )}
          {tab === "orders" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Total</th><th className="px-4 py-3"></th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-3 font-bold">{o.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                      <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                      <td className="px-4 py-3 font-bold">{formatZAR(o.total)}</td>
                      <td className="px-4 py-3 text-right"><Link to="/track" search={{ order: o.id }} className="text-sm font-bold text-primary hover:underline">Track →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "scripts" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">My Prescriptions</h3>
                <Link to="/prescriptions" className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground hover:bg-primary-dark">+ Upload</Link>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {prescriptions.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{p.id} · {p.fileName}</div>
                      <div className="text-xs text-muted-foreground">{p.doctorName} · {p.uploadedAt}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${p.status === "Approved" ? "bg-primary/10 text-primary" : p.status === "Dispensed" ? "bg-success/15 text-success" : p.status === "Rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-foreground"}`}>{p.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === "wishlist" && (
            wishlist.length === 0
              ? <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">Nothing wishlisted yet.</div>
              : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{wishlist.map((p) => <ProductCard key={p!.id} product={p!} />)}</div>
          )}
          {tab === "address" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Default Address</h3>
              <p className="mt-2 text-sm text-muted-foreground">{user.firstName} {user.lastName}<br />18 Sam Nujoma Street, Avondale<br />Harare, Zimbabwe</p>
              <button className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-muted">Edit</button>
            </div>
          )}
          {tab === "settings" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Account</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <strong>{user.email}</strong></div>
                {user.phone && <div><span className="text-muted-foreground">Mobile:</span> <strong>{user.phone}</strong></div>}
              </div>
              <h3 className="mt-6 font-extrabold">Notifications</h3>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Order updates</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Promotions & deals</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Health tips newsletter</label>
              </div>
              <button onClick={onLogout} className="mt-6 inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface p-3">
      <div className="text-2xl font-extrabold text-primary">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls = status === "Delivered" ? "bg-success/15 text-success" : status === "Out for delivery" ? "bg-accent/15 text-accent-foreground" : status === "Packed" ? "bg-primary/10 text-primary" : "bg-warning/20 text-foreground";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${cls}`}>{status}</span>;
}