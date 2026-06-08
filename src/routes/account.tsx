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

  const sharedPrescriptions = useSharedPrescriptions(
    (s) => s.prescriptions
  );
  const markSharedPaid = useSharedPrescriptions((s) => s.markPaid);

  const [tab, setTab] = useState
    "dash" | "orders" | "scripts" | "wishlist" |
    "card" | "address" | "settings"
  >("dash");
  const wishlist = useShop((s) => s.wishlist)
    .map(getProduct)
    .filter(Boolean);
  const [activeReceipt, setActiveReceipt] =
    useState<Receipt | null>(null);
  const [payingRx, setPayingRx] = useState
    (typeof sharedPrescriptions)[0] | null
  >(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

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

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  if (!user) return null;

  // Prescriptions awaiting payment from this customer
  const pendingPayment = sharedPrescriptions.filter(
    (p) =>
      (p.customerId === user.id ||
        p.customerEmail === user.email) &&
      p.status === "Approved — Awaiting Payment" &&
      p.quotation &&
      !dismissedIds.includes(p.id)
  );

  // All shared prescriptions for this customer
  const mySharedPrescriptions = sharedPrescriptions.filter(
    (p) =>
      p.customerId === user.id ||
      p.customerEmail === user.email
  );

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

      {/* ── Prescription payment notification banners ── */}
      {pendingPayment.length > 0 && (
        <div className="mb-6 space-y-3">
          {pendingPayment.map((rx) => (
            <div
              key={rx.id}
              className="relative rounded-xl p-4 shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, #F0F9F4 0%, #DCFCE7 100%)",
                border: "2px solid #00853F",
              }}
            >
              {/* Dismiss button */}
              <button
                onClick={() =>
                  setDismissedIds((prev) => [...prev, rx.id])
                }
                className="absolute right-3 top-3 rounded-full p-1 hover:bg-black/5"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-[#6B7280]" />
              </button>

              <div className="flex items-start gap-4 pr-6">
