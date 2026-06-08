import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShop, formatUSD } from "@/store/shop";
import { useAuth, type Order } from "@/store/auth";
import { useSharedPrescriptions } from "@/store/sharedPrescriptions";
import PaymentModal from "@/components/checkout/PaymentModal";
import { getProduct } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Package, Heart, MapPin, Settings, LayoutDashboard,
  FileText, Truck, LogOut, Phone, Syringe, Store,
  Receipt as ReceiptIcon, CheckCircle2, Bell, X,
} from "lucide-react";
import { ReceiptModal } from "@/components/receipt/ReceiptModal";
import { buildReceipt, type Receipt } from "@/lib/receipts";

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
  const sharedPrescriptions = useSharedPrescriptions((s) => s.prescriptions);
  const markSharedPaid = useSharedPrescriptions((s) => s.markPaid);
  const wishlist = useShop((s) => s.wishlist).map(getProduct).filter(Boolean);
  const [tab, setTab] = useState("dash");
  const [activeReceipt, setActiveReceipt] = useState(null as Receipt | null);
  const [payingRx, setPayingRx] = useState(null as typeof sharedPrescriptions[0] | null);
  const [dismissedIds, setDismissedIds] = useState([] as string[]);

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  if (!user) return null;

  const pendingPayment = sharedPrescriptions.filter(
    (p) =>
      (p.customerId === user.id || p.customerEmail === user.email) &&
      p.status === "Approved — Awaiting Payment" &&
      p.quotation &&
      !dismissedIds.includes(p.id)
  );

  const mySharedPrescriptions = sharedPrescriptions.filter(
    (p) => p.customerId === user.id || p.customerEmail === user.email
  );

  const openReceiptFor = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o || !user) return;
    const r = buildReceipt({
      orderNumber: o.id,
      items: o.items.map((it, i) => ({
        name: it.name,
        sku: "SKU-" + (1000 + i),
        qty: it.qty,
        unitPrice: it.price,
        lineTotal: +(it.price * it.qty).toFixed(2),
      })),
      customer: {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phone: user.phone ?? "+263 78 200 0100",
        address: o.address,
      },
      paymentMethod: "USD Card",
      cardLast4: "4242",
      cardType: "Visa",
      deliveryMethod: "Standard Delivery",
      deliveryFee: 0,
    });
    setActiveReceipt(r);
  };

  const tabs = [
    { id: "dash", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "scripts", label: "Prescriptions", icon: FileText },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const onLogout = () => {
    logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">

      {pendingPayment.length > 0 && (
        <div className="mb-6 space-y-3">
          {pendingPayment.map((rx) => (
            <div
              key={rx.id}
              className="relative rounded-xl p-4 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #F0F9F4 0%, #DCFCE7 100%)",
                border: "2px solid #00853F",
              }}
            >
              <button
                onClick={() => setDismissedIds((prev) => [...prev, rx.id])}
                className="absolute right-3 top-3 rounded-full p-1 hover:bg-black/5"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-[#6B7280]" />
              </button>

              <div className="flex items-start gap-4 pr-6">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
                  style={{ background: "#00853F" }}
                >
                  <Bell className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: "#00853F" }}
                    >
                      ACTION REQUIRED
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      Ref: {rx.id}
                    </span>
                  </div>

                  <h3 className="mt-1 text-base font-bold text-[#111827]">
                    Your prescription has been approved
                  </h3>

                  <p className="mt-0.5 text-sm text-[#374151]">
                    <strong>{rx.quotation?.medicationName}</strong> approved
                    by {rx.quotation?.pharmacistName}
                    {rx.quotation?.approvedAt ? " at " + rx.quotation.approvedAt : ""}
                  </p>

                  {rx.quotation?.notes && (
                    <p className="mt-1 text-xs text-[#6B7280] italic">
                      Pharmacist note: "{rx.quotation.notes}"
                    </p>
                  )}

                  {rx.quotation && (
                    <div
                      className="mt-3 inline-flex flex-wrap gap-4 rounded-lg px-4 py-2 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid #BBF7D0",
                      }}
                    >
                      <div className="text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
                          Medication
                        </div>
                        <div className="font-bold text-[#111827]">
                          ${rx.quotation.medicationCost.toFixed(2)}
                        </div>
                      </div>
                      {rx.quotation.deliveryFee > 0 && (
                        <>
                          <div className="self-center text-[#D1D5DB]">+</div>
                          <div className="text-center">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
                              Delivery
                            </div>
                            <div className="font-bold text-[#111827]">
                              ${rx.quotation.deliveryFee.toFixed(2)}
                            </div>
                          </div>
                        </>
                      )}
                      <div className="self-center text-[#D1D5DB]">=</div>
                      <div className="text-center">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-[#6B7280]">
                          Total Due
                        </div>
                        <div className="text-lg font-black" style={{ color: "#00853F" }}>
                          ${rx.quotation.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="mt-2 text-xs text-[#6B7280]">
                    {rx.delivery === "collect" ? "Collection in-store — FREE" : "Home delivery included"}
                    {" · "}Pay via EcoCash, OneMoney, ZimSwitch or Bank Transfer
                  </p>
                </div>

                <button
                  onClick={() => setPayingRx(rx)}
                  className="shrink-0 self-center rounded-lg px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                  style={{ background: "#00853F" }}
                >
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-[#E5E7EB] bg-[#F0F9F4] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
              My Account
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
              Welcome back, {user.firstName}
            </h1>
            <p className="mt-1 text-sm text-[#374151]">
              {orders.length} order{orders.length !== 1 ? "s" : ""} &middot;{" "}
              {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} on file
              {pendingPayment.length > 0 && (
                <span
                  className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: "#DC2626" }}
                >
                  <Bell className="h-2.5 w-2.5" />
                  {pendingPayment.length} payment{pendingPayment.length !== 1 ? "s" : ""} pending
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="overflow-x-auto rounded-xl border border-border bg-card p-2 lg:p-3">
          <nav className="flex gap-1 lg:flex-col">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isPrescriptions = t.id === "scripts";
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition " +
                    (tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")
                  }
                >
                  <Icon className="h-4 w-4" /> {t.label}
                  {isPrescriptions && pendingPayment.length > 0 && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">
                      {pendingPayment.length}
                    </span>
                  )}
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
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    <strong>{user.firstName} {user.lastName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <strong>{user.email}</strong>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <strong>{user.phone}</strong>
                    </div>
                  )}
                </div>
                <Link
                  to="/prescriptions"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground hover:bg-primary-dark"
                >
                  <FileText className="h-3.5 w-3.5" /> Upload a new prescription
                </Link>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-extrabold">Active delivery</h3>
                {(() => {
                  const active = orders.find((o) => o.status !== "Delivered");
                  if (!active)
                    return <p className="mt-3 text-sm text-muted-foreground">No active deliveries.</p>;
                  return (
                    <div className="mt-3 text-sm">
                      <div className="font-bold">{active.id}</div>
                      <div className="text-muted-foreground">
                        {active.date} &middot; {formatUSD(active.total)}
                      </div>
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {active.status}
                      </span>
                      <Link
                        to="/track"
                        search={{ order: active.id }}
                        className="mt-3 flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                      >
                        <Truck className="h-4 w-4" /> Track delivery &rarr;
                      </Link>
                    </div>
                  );
                })()}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
                <h3 className="font-extrabold">Quick Links</h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Link to="/prescriptions" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary">
                    <FileText className="h-4 w-4" /> Upload Script
                  </Link>
                  <Link to="/track" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary">
                    <Truck className="h-4 w-4" /> Track Order
                  </Link>
                  <Link to="/services" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary">
                    <Syringe className="h-4 w-4" /> Vaccinations
                  </Link>
                  <Link to="/services" className="flex items-center justify-center gap-2 rounded-md border border-[#E5E7EB] bg-white p-3 text-sm font-semibold text-[#374151] hover:border-primary hover:text-primary">
                    <Store className="h-4 w-4" /> Find Store
                  </Link>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
                  <Stat label="Orders" value={orders.length} />
                  <Stat
                    label="Pending scripts"
                    value={mySharedPrescriptions.filter((p) => p.status === "Pending").length}
                  />
                  <Stat label="Wishlist" value={wishlist.length} />
                </div>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-3 font-bold">{o.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                      <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                      <td className="px-4 py-3 font-bold">{formatUSD(o.total)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openReceiptFor(o.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-bold text-foreground hover:border-primary hover:text-primary"
                          >
                            <ReceiptIcon className="h-3.5 w-3.5" /> Receipt
                          </button>
                          <Link to="/track" search={{ order: o.id }} className="text-sm font-bold text-primary hover:underline">
                            Track &rarr;
                          </Link>
                        </div>
                      </td>
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
                <Link
                  to="/prescriptions"
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold uppercase text-primary-foreground hover:bg-primary-dark"
                >
                  + Upload
                </Link>
              </div>

              {pendingPayment.length > 0 && (
                <div className="mt-4 space-y-3">
                  {pendingPayment.map((rx) => (
                    <div
                      key={rx.id}
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{ background: "#F0F9F4", border: "1.5px solid #00853F" }}
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111827]">
                          {rx.quotation?.medicationName}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          Approved &middot; Total due:{" "}
                          <strong className="text-[#00853F]">
                            ${rx.quotation?.total.toFixed(2)}
                          </strong>
                        </p>
                      </div>
                      <button
                        onClick={() => setPayingRx(rx)}
                        className="shrink-0 rounded-md px-3 py-1.5 text-xs font-bold text-white"
                        style={{ background: "#00853F" }}
                      >
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <ul className="mt-4 divide-y divide-border">
                {(mySharedPrescriptions.length > 0 ? mySharedPrescriptions : prescriptions).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold">{p.id} &middot; {p.fileName}</div>
                      <div className="text-xs text-muted-foreground">{p.doctorName} &middot; {p.uploadedAt}</div>
                    </div>
                    <span className={"shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold " + scriptStatusColor(p.status)}>
                      {p.status}
                    </span>
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
              <p className="mt-2 text-sm text-muted-foreground">
                {user.firstName} {user.lastName}<br />
                18 Sam Nujoma Street, Avondale<br />
                Harare, Zimbabwe
              </p>
              <button className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-muted">
                Edit
              </button>
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Account</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <div><span className="text-muted-foreground">Email:</span> <strong>{user.email}</strong></div>
                {user.phone && (
                  <div><span className="text-muted-foreground">Mobile:</span> <strong>{user.phone}</strong></div>
                )}
              </div>
              <h3 className="mt-6 font-extrabold">Notifications</h3>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Order updates</label>
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Promotions &amp; deals</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Health tips newsletter</label>
              </div>
              <button
                onClick={onLogout}
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-destructive/40 px-4 py-2 text-sm font-bold text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {payingRx && payingRx.quotation && (
        <PaymentModal
          isOpen={true}
          onClose={() => setPayingRx(null)}
          onSuccess={(ref, method) => {
            markSharedPaid(payingRx.id, ref, method);
            setDismissedIds((prev) => [...prev, payingRx.id]);
            setPayingRx(null);
            toast.success("Payment confirmed — your medication will be dispatched shortly");
          }}
          amount={payingRx.quotation.total}
          orderId={payingRx.id}
          rxRef={payingRx.id}
          orderType="Prescription"
          itemSummary={
            payingRx.quotation.medicationName +
            " · " + payingRx.quotation.quantity +
            " · Approved by " + payingRx.quotation.pharmacistName
          }
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          open={!!activeReceipt}
          receipt={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}
    </div>
  );
}

function scriptStatusColor(status: string) {
  if (status === "Approved — Awaiting Payment") return "bg-amber-50 text-amber-700";
  if (status === "Paid") return "bg-blue-50 text-blue-700";
  if (status === "Dispensed" || status === "Delivered") return "bg-[#F0F9F4] text-primary";
  if (status === "Rejected") return "bg-red-50 text-red-700";
  if (status === "Out for Delivery") return "bg-sky-50 text-sky-700";
  if (status === "Dispensing") return "bg-violet-50 text-violet-700";
  return "bg-[#F0F9F4] text-primary";
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
  const cls =
    status === "Delivered" ? "bg-success/15 text-success" :
    status === "Out for delivery" ? "bg-accent/15 text-accent-foreground" :
    status === "Packed" ? "bg-primary/10 text-primary" :
    "bg-warning/20 text-foreground";
  return <span className={"rounded-full px-2 py-0.5 text-xs font-bold " + cls}>{status}</span>;
}
