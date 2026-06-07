import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type Order } from "@/store/auth";
import { formatUSD } from "@/store/shop";
import { Search, MapPin, Phone, Truck, Package, CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/track")({
  validateSearch: (s: Record<string, unknown>) => ({ order: typeof s.order === "string" ? s.order : "" }),
  head: () => ({ meta: [{ title: "Track Order — Plus2 Pharmacy" }] }),
  component: TrackPage,
});

function TrackPage() {
  const { order: initial } = Route.useSearch();
  const orders = useAuth((s) => s.orders);
  const [q, setQ] = useState(initial || "");
  const match = orders.find((o) => o.id.toLowerCase() === q.trim().toLowerCase());

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">Track your order</h1>
      <p className="mt-1 text-sm text-muted-foreground">Enter your Plus2 order number (e.g. P2-183904) to see live delivery progress.</p>

      <div className="mt-4 flex gap-2 rounded-md border-2 border-primary bg-background p-1">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="P2-183904" className="w-full bg-background px-3 py-2 text-sm outline-none" />
        <button className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-bold uppercase text-primary-foreground hover:bg-primary-dark"><Search className="h-4 w-4" /> Track</button>
      </div>

      {q && !match && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No order found for "{q}". Try one of: {orders.map((o) => <button key={o.id} onClick={() => setQ(o.id)} className="mx-1 font-mono text-primary hover:underline">{o.id}</button>)}
        </div>
      )}

      {match && <OrderTracker order={match} />}

      {!q && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Recent orders</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o) => (
              <button key={o.id} onClick={() => setQ(o.id)} className="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md">
                <div className="text-xs font-bold uppercase text-muted-foreground">{o.date}</div>
                <div className="mt-1 text-lg font-extrabold">{o.id}</div>
                <div className="text-sm text-muted-foreground">{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {formatUSD(o.total)}</div>
                <StatusPill status={o.status} className="mt-2" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, className = "" }: { status: Order["status"]; className?: string }) {
  const map: Record<Order["status"], string> = {
    Processing: "bg-warning/20 text-foreground",
    Packed: "bg-primary/10 text-primary",
    "Out for delivery": "bg-accent/15 text-accent-foreground",
    Delivered: "bg-success/15 text-success",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${map[status]} ${className}`}>{status}</span>;
}

function OrderTracker({ order }: { order: Order }) {
  const currentIdx = Math.max(0, order.tracking.findIndex((t) => !t.done) - 1);
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase text-muted-foreground">Order</div>
              <div className="text-xl font-extrabold">{order.id}</div>
            </div>
            <StatusPill status={order.status} />
          </div>

          <ol className="mt-6 space-y-4">
            {order.tracking.map((t, i) => {
              const active = i === currentIdx && !order.tracking[i].done;
              const Icon = t.done ? CheckCircle2 : active ? Truck : Circle;
              return (
                <li key={i} className="flex gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.done ? "bg-success text-white" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 border-b border-dashed border-border pb-4 last:border-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className={`font-bold ${t.done || active ? "" : "text-muted-foreground"}`}>{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.at}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-extrabold">Items</h3>
          <ul className="mt-3 divide-y divide-border">
            {order.items.map((it, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface text-xs font-bold text-muted-foreground">×{it.qty}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">Qty {it.qty}</div>
                </div>
                <div className="text-sm font-bold">{formatUSD(it.price * it.qty)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm font-extrabold">
            <span>Total paid</span>
            <span>{formatUSD(order.total)}</span>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-extrabold"><MapPin className="h-4 w-4 text-primary" /> Delivering to</h3>
          <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
        </div>
        {order.driver && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-extrabold"><Truck className="h-4 w-4 text-primary" /> Your driver</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-extrabold">{order.driver.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{order.driver.name}</div>
                <div className="text-xs text-muted-foreground">{order.driver.vehicle}</div>
              </div>
              <a href={`tel:${order.driver.phone}`} className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary-dark" aria-label="Call driver"><Phone className="h-4 w-4" /></a>
            </div>
            <div className="mt-4 flex h-32 items-center justify-center rounded-md border border-border bg-surface text-xs font-semibold text-muted-foreground">
              Live map (demo)
            </div>
          </div>
        )}
        <Link to="/account" className="block rounded-xl border border-border bg-card p-4 text-center text-sm font-bold text-primary hover:bg-muted">View all orders →</Link>
      </aside>
    </div>
  );
}