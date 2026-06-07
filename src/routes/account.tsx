import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useShop, formatZAR } from "@/store/shop";
import { getProduct } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Award, Package, Heart, MapPin, Settings, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Plus2 Pharmacy" }] }),
  component: AccountPage,
});

const ORDERS = [
  { no: "P2-184221", date: "12 May 2026", status: "Delivered", total: 489.97 },
  { no: "P2-183904", date: "28 Apr 2026", status: "Shipped", total: 234.5 },
  { no: "P2-182117", date: "14 Apr 2026", status: "Processing", total: 1289.0 },
];

function AccountPage() {
  const [tab, setTab] = useState<"dash" | "orders" | "wishlist" | "card" | "address" | "settings">("dash");
  const wishlist = useShop((s) => s.wishlist).map(getProduct).filter(Boolean);

  const tabs = [
    { id: "dash", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "card", label: "Benefit Card", icon: Award },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 text-primary-foreground shadow-lg">
        <div className="text-xs font-bold uppercase tracking-wider opacity-90">Welcome back</div>
        <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">Hi, Thandi 👋</h1>
        <p className="mt-1 text-sm opacity-95">You have <strong>2,450 points</strong> ready to redeem.</p>
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
              <BenefitCard />
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-extrabold">Recent Order</h3>
                <div className="mt-3 text-sm">
                  <div className="font-bold">{ORDERS[0].no}</div>
                  <div className="text-muted-foreground">{ORDERS[0].date} · {formatZAR(ORDERS[0].total)}</div>
                  <span className="mt-2 inline-block rounded-full bg-success/10 px-2 py-0.5 text-xs font-bold text-success">{ORDERS[0].status}</span>
                </div>
                <button onClick={() => setTab("orders")} className="mt-4 text-sm font-bold text-primary hover:underline">View all orders →</button>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
                <h3 className="font-extrabold">Quick Links</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Link to="/services" className="rounded-lg bg-surface p-3 text-center text-sm font-semibold hover:bg-muted">📋 Script Repeat</Link>
                  <Link to="/services" className="rounded-lg bg-surface p-3 text-center text-sm font-semibold hover:bg-muted">💉 Vaccinations</Link>
                  <Link to="/services" className="rounded-lg bg-surface p-3 text-center text-sm font-semibold hover:bg-muted">🩺 Health Check</Link>
                  <Link to="/services" className="rounded-lg bg-surface p-3 text-center text-sm font-semibold hover:bg-muted">📍 Find Store</Link>
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
                  {ORDERS.map((o) => (
                    <tr key={o.no}>
                      <td className="px-4 py-3 font-bold">{o.no}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${o.status === "Delivered" ? "bg-success/10 text-success" : o.status === "Shipped" ? "bg-primary/10 text-primary" : "bg-warning/20 text-foreground"}`}>{o.status}</span></td>
                      <td className="px-4 py-3 font-bold">{formatZAR(o.total)}</td>
                      <td className="px-4 py-3 text-right"><a href="#" className="text-sm font-bold text-primary hover:underline">View →</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {tab === "wishlist" && (
            wishlist.length === 0
              ? <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">Nothing wishlisted yet.</div>
              : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{wishlist.map((p) => <ProductCard key={p!.id} product={p!} />)}</div>
          )}
          {tab === "card" && <BenefitCard large />}
          {tab === "address" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Default Address</h3>
              <p className="mt-2 text-sm text-muted-foreground">Thandi Nkosi<br />42 Long Street, Gardens<br />Cape Town, 8001</p>
              <button className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-muted">Edit</button>
            </div>
          )}
          {tab === "settings" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Notifications</h3>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Order updates</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Promotions & deals</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Health tips newsletter</label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ large = false }: { large?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-5 text-primary-foreground shadow-lg ${large ? "max-w-md" : ""}`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">Plus2 Benefit Card</span>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">GOLD</span>
        </div>
        <div className="mt-6 text-3xl font-extrabold">2,450 pts</div>
        <div className="mt-1 text-sm opacity-90">Worth R245.00 in savings</div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase opacity-75">Member</div>
            <div className="font-bold">Thandi Nkosi</div>
          </div>
          <button className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/30">Redeem →</button>
        </div>
      </div>
    </div>
  );
}