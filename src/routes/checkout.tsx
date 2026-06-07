import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useShop, formatUSD, formatZIG } from "@/store/shop";
import { getProduct } from "@/data/products";
import { Check, CreditCard, Truck, MapPin, Sparkles, Smartphone, Building2, Banknote, Eye, EyeOff } from "lucide-react";
import { PaymentSimulator, detectBrand, formatCardNumber, formatExpiry } from "@/components/checkout/PaymentSimulator";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Plus2 Pharmacy" }] }),
  component: Checkout,
});

const STEPS = ["Delivery", "Payment", "Review", "Done"] as const;

function Checkout() {
  const cart = useShop((s) => s.cart);
  const clearCart = useShop((s) => s.clearCart);
  const navigate = useNavigate();
  const items = cart.map((c) => ({ ...c, product: getProduct(c.id)! })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const delivery = subtotal >= 50 ? 0 : 5;
  const total = subtotal + delivery;

  const [step, setStep] = useState(0);
  const [delivery_, setDelivery] = useState({ firstName: "", lastName: "", phone: "", email: "", street: "", suburb: "", city: "Harare", province: "Harare", postal: "", method: "standard" });
  const [payment, setPayment] = useState({ method: "ecocash", number: "", expiry: "", cvv: "", name: "", mobile: "" });
  const orderNumber = "P2-" + Math.floor(100000 + Math.random() * 900000);
  const [cvvVisible, setCvvVisible] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [authRef, setAuthRef] = useState<string | null>(null);

  if (items.length === 0 && step < 3) {
    return <div className="p-12 text-center"><p className="text-muted-foreground">Your cart is empty.</p><Link to="/" className="mt-4 inline-block rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground">Shop now</Link></div>;
  }

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const place = () => {
    if (payment.method === "card") {
      setSimOpen(true);
      return;
    }
    clearCart();
    setStep(3);
    toast.success("Order placed");
  };

  const fillTestCard = (n: string) => setPayment({ ...payment, name: payment.name || "Demo Customer", number: formatCardNumber(n), expiry: "12/27", cvv: "123" });
  const cardDigits = payment.number.replace(/\s/g, "");
  const brand = detectBrand(cardDigits);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">Checkout</h1>

      {/* Stepper */}
      <div className="mt-6 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className="ml-2 hidden text-sm font-bold sm:block">{label}</div>
            {i < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-xl border border-border bg-card p-6">
          {step === 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><MapPin className="h-5 w-5 text-primary" /> Delivery Details</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field label="First name" value={delivery_.firstName} onChange={(v) => setDelivery({ ...delivery_, firstName: v })} />
                <Field label="Last name" value={delivery_.lastName} onChange={(v) => setDelivery({ ...delivery_, lastName: v })} />
                <Field label="Phone" value={delivery_.phone} onChange={(v) => setDelivery({ ...delivery_, phone: v })} placeholder="082 123 4567" />
                <Field label="Email" value={delivery_.email} onChange={(v) => setDelivery({ ...delivery_, email: v })} type="email" />
                <Field label="Street address" value={delivery_.street} onChange={(v) => setDelivery({ ...delivery_, street: v })} className="col-span-2" />
                <Field label="Suburb" value={delivery_.suburb} onChange={(v) => setDelivery({ ...delivery_, suburb: v })} />
                <Field label="Postal code" value={delivery_.postal} onChange={(v) => setDelivery({ ...delivery_, postal: v })} />
              </div>
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold">Delivery Method</h3>
                <div className="space-y-2">
                  {[
                    { id: "standard", label: "Standard Delivery (Harare metro)", desc: "1–2 working days", price: subtotal >= 50 ? "FREE" : "US$5.00" },
                    { id: "express", label: "Same-day Express (Harare)", desc: "Within 4 hours", price: "US$8.00" },
                    { id: "national", label: "Nationwide Courier", desc: "Bulawayo, Mutare, Gweru — 2–4 days", price: "US$12.00" },
                    { id: "collect", label: "Click & Collect", desc: "Borrowdale or Avondale branch", price: "FREE" },
                  ].map((d) => (
                    <label key={d.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition ${delivery_.method === d.id ? "border-primary bg-primary/5" : "border-border"}`}>
                      <input type="radio" checked={delivery_.method === d.id} onChange={() => setDelivery({ ...delivery_, method: d.id })} className="accent-[var(--color-primary)]" />
                      <Truck className="h-5 w-5 text-primary" />
                      <div className="flex-1"><div className="font-bold">{d.label}</div><div className="text-xs text-muted-foreground">{d.desc}</div></div>
                      <div className="font-bold text-primary">{d.price}</div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold"><CreditCard className="h-5 w-5 text-primary" /> Payment</h2>
              <p className="mt-1 text-xs text-muted-foreground">Pay in USD or ZIG (Zimbabwe Gold). Equivalent: <span className="font-bold text-foreground">{formatZIG(total)}</span></p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { id: "ecocash", label: "EcoCash", icon: Smartphone, badge: "Most popular" },
                  { id: "onemoney", label: "OneMoney", icon: Smartphone },
                  { id: "innbucks", label: "InnBucks", icon: Smartphone },
                  { id: "zig", label: "ZIG Wallet (RBZ)", icon: Banknote },
                  { id: "card", label: "USD Card / Visa", icon: CreditCard },
                  { id: "bank", label: "Bank Transfer (ZB / CBZ)", icon: Building2 },
                ].map((p) => {
                  const Icon = p.icon;
                  const active = payment.method === p.id;
                  return (
                    <button key={p.id} type="button" onClick={() => setPayment({ ...payment, method: p.id })} className={`relative flex items-center gap-2 rounded-lg border-2 p-3 text-left text-sm font-bold transition ${active ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`}>
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{p.label}</span>
                      {p.badge && <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[9px] uppercase text-accent-foreground">{p.badge}</span>}
                    </button>
                  );
                })}
              </div>

              {(payment.method === "ecocash" || payment.method === "onemoney" || payment.method === "innbucks") && (
                <div className="mt-5 space-y-3 rounded-lg bg-surface p-4 text-sm">
                  <p className="text-muted-foreground">Enter your registered <strong>{payment.method === "ecocash" ? "EcoCash" : payment.method === "onemoney" ? "OneMoney" : "InnBucks"}</strong> mobile number. We'll send a payment prompt — approve on your phone to complete checkout.</p>
                  <Field label="Mobile number" value={payment.mobile} onChange={(v) => setPayment({ ...payment, mobile: v })} placeholder="+263 77 123 4567" />
                  <div className="rounded-md border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">
                    Tip: Dial *151# (EcoCash) or *111# (OneMoney) if you don't receive a prompt within 60 seconds.
                  </div>
                </div>
              )}
              {payment.method === "zig" && (
                <div className="mt-5 rounded-lg bg-surface p-4 text-sm">
                  <p>You'll pay <strong>{formatZIG(total)}</strong> from your ZIG digital wallet. RBZ-approved instant settlement.</p>
                  <Field label="ZIG Wallet ID" value={payment.number} onChange={(v) => setPayment({ ...payment, number: v })} placeholder="ZIG-XXXX-XXXX" />
                </div>
              )}
              {payment.method === "card" && (
                <div className="mt-5 space-y-4">
                  <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-xs">
                    <span className="font-bold uppercase tracking-wider text-primary">Demo test cards</span>
                    <button type="button" onClick={() => fillTestCard("4242424242424242")} className="rounded-md border border-border bg-card px-2 py-1 font-mono font-bold hover:border-primary">
                      4242 · success
                    </button>
                    <button type="button" onClick={() => fillTestCard("4000000000000002")} className="rounded-md border border-border bg-card px-2 py-1 font-mono font-bold hover:border-destructive hover:text-destructive">
                      4000 · decline
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Cardholder name" value={payment.name} onChange={(v) => setPayment({ ...payment, name: v })} className="col-span-2" />
                    <label className="col-span-2 block">
                      <span className="mb-1 block text-xs font-bold text-foreground">Card number</span>
                      <div className="relative">
                        <input
                          value={payment.number}
                          onChange={(e) => setPayment({ ...payment, number: formatCardNumber(e.target.value) })}
                          placeholder="4242 4242 4242 4242"
                          inputMode="numeric"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-16 font-mono text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                          {brand === "visa" && <span className="rounded bg-[#1A1F71] px-1.5 py-0.5 text-[10px] font-extrabold italic text-white">VISA</span>}
                          {brand === "mastercard" && (
                            <span className="flex items-center">
                              <span className="h-4 w-4 rounded-full bg-[#EB001B]" />
                              <span className="-ml-2 h-4 w-4 rounded-full bg-[#F79E1B] opacity-90" />
                            </span>
                          )}
                          {brand === "card" && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                        </span>
                      </div>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-foreground">Expiry (MM/YY)</span>
                      <input
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold text-foreground" title="3 digits on back of card">CVV</span>
                      <div className="relative">
                        <input
                          type={cvvVisible ? "text" : "password"}
                          value={payment.cvv}
                          onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                          placeholder="123"
                          inputMode="numeric"
                          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setCvvVisible((v) => !v)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle CVV visibility"
                        >
                          {cvvVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </label>
                    <label className="col-span-2 mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" className="accent-[var(--color-primary)]" /> Save this card for future use
                    </label>
                  </div>
                </div>
              )}
              {payment.method === "bank" && (
                <div className="mt-5 space-y-2 rounded-lg bg-surface p-4 text-sm">
                  <p className="font-bold">Pay via RTGS / ZIPIT to:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Bank: <strong>ZB Bank</strong></li>
                    <li>Account name: <strong>Plus2 Pharmacy (Pvt) Ltd</strong></li>
                    <li>Account no: <strong>4123 8870 9921</strong></li>
                    <li>Branch: Avondale (2189)</li>
                    <li>Reference: <strong>{orderNumber}</strong></li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-extrabold">Review your order</h2>
              <div className="mt-4 space-y-3">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 border-b border-border pb-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-border bg-[#F9FAFB]">
                      <img src={i.product.image} alt={i.product.name} className="h-full w-full object-contain p-1" loading="lazy" />
                    </div>
                    <div className="flex-1"><div className="text-sm font-bold">{i.product.name}</div><div className="text-xs text-muted-foreground">Qty: {i.qty}</div></div>
                    <div className="font-bold">{formatUSD(i.product.price * i.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-surface p-4 text-sm">
                <div className="font-bold">Delivering to:</div>
                <div className="text-muted-foreground">{delivery_.firstName} {delivery_.lastName}, {delivery_.street}, {delivery_.suburb}, {delivery_.city}, Zimbabwe</div>
                <div className="mt-2 font-bold">Paying with:</div>
                <div className="text-muted-foreground capitalize">{labelFor(payment.method)}</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-4xl"><Sparkles className="h-10 w-10 text-success" /></div>
              <h2 className="mt-4 text-2xl font-extrabold">Thank you for your order!</h2>
              <p className="mt-1 text-muted-foreground">A confirmation email is on its way.</p>
              <div className="mx-auto mt-6 max-w-sm rounded-xl bg-surface p-5 text-left text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Order number</span><span className="font-extrabold">{orderNumber}</span></div>
                {authRef && <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Payment ref</span><span className="font-mono font-extrabold">{authRef}</span></div>}
                <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Estimated delivery</span><span className="font-bold">1–2 working days</span></div>
                <div className="mt-2 flex justify-between"><span className="text-muted-foreground">Total paid</span><span className="font-extrabold">{formatUSD(total)}</span></div>
                <div className="mt-1 flex justify-between text-xs"><span className="text-muted-foreground">ZIG equivalent</span><span className="font-bold">{formatZIG(total)}</span></div>
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <button className="rounded-md border border-border px-5 py-2.5 font-bold hover:bg-muted">Track Order</button>
                <Link to="/" className="rounded-md bg-primary px-5 py-2.5 font-bold text-primary-foreground hover:bg-primary-dark">Continue Shopping</Link>
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="mt-6 flex justify-between gap-3">
              <button onClick={step === 0 ? () => navigate({ to: "/cart" }) : back} className="rounded-md border border-border px-5 py-2.5 font-bold hover:bg-muted">{step === 0 ? "Back to cart" : "← Back"}</button>
              {step < 2 ? (
                <button onClick={next} className="rounded-md bg-primary px-6 py-2.5 font-bold text-primary-foreground hover:bg-primary-dark">Continue →</button>
              ) : (
                <button onClick={place} className="rounded-md bg-primary px-6 py-2.5 font-bold text-primary-foreground hover:bg-primary-dark">Place Order</button>
              )}
            </div>
          )}
        </div>

        {step < 3 && (
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-extrabold">Order Summary</h3>
              <div className="mt-3 space-y-1.5 text-sm">
                <Row label="Subtotal" value={formatUSD(subtotal)} />
                <Row label="Delivery" value={delivery === 0 ? "FREE" : formatUSD(delivery)} />
                <div className="my-2 border-t border-border" />
                <Row label={<span className="text-base font-bold">Total</span>} value={<span className="text-lg font-extrabold">{formatUSD(total)}</span>} />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>≈ ZIG</span><span>{formatZIG(total)}</span></div>
              </div>
            </div>
          </aside>
        )}
      </div>

      <PaymentSimulator
        open={simOpen}
        amount={total}
        cardNumber={payment.number}
        cardholder={payment.name}
        brand={brand}
        onClose={() => setSimOpen(false)}
        onSuccess={(ref) => {
          setAuthRef(ref);
          setSimOpen(false);
          clearCart();
          setStep(3);
          toast.success("Payment authorised — order placed");
        }}
      />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-bold text-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}
function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>;
}

function labelFor(method: string) {
  return { ecocash: "EcoCash", onemoney: "OneMoney", innbucks: "InnBucks", zig: "ZIG Wallet", card: "USD Card", bank: "Bank Transfer" }[method] ?? method;
}