import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, X, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { formatUSD } from "@/store/shop";

type Stage = "contacting" | "verifying" | "otp" | "authorising" | "success" | "declined";

type Props = {
  open: boolean;
  amount: number;
  cardNumber: string; // digits-only or formatted
  cardholder: string;
  brand: "visa" | "mastercard" | "card";
  onClose: () => void;
  onSuccess: (authRef: string) => void;
};

const STAGE_LABEL: Record<Exclude<Stage, "success" | "declined">, string> = {
  contacting: "Contacting bank…",
  verifying: "Verifying card…",
  otp: "Awaiting 3-D Secure OTP…",
  authorising: "Authorising payment…",
};

const STAGE_ORDER: Stage[] = ["contacting", "verifying", "otp", "authorising"];

export function PaymentSimulator({ open, amount, cardNumber, cardholder, brand, onClose, onSuccess }: Props) {
  const [stage, setStage] = useState<Stage>("contacting");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [authRef, setAuthRef] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const digits = cardNumber.replace(/\s/g, "");
  const last4 = digits.slice(-4);
  const willDecline = digits === "4000000000000002";

  useEffect(() => {
    if (!open) return;
    setStage("contacting");
    setOtp(["", "", "", "", "", ""]);
    setAuthRef("");
    const t = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };
    t(1000, () => setStage("verifying"));
    t(2000, () => setStage("otp"));
    // animate OTP digits filling
    "123456".split("").forEach((d, i) => t(2200 + i * 200, () => setOtp((p) => p.map((x, idx) => (idx === i ? d : x)))));
    t(3500, () => setStage("authorising"));
    t(4500, () => {
      if (willDecline) {
        setStage("declined");
      } else {
        const ref = "AUTH-" + Math.random().toString(36).slice(2, 9).toUpperCase();
        setAuthRef(ref);
        setStage("success");
        setTimeout(() => onSuccess(ref), 1500);
      }
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const stageIdx = STAGE_ORDER.indexOf(stage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider text-foreground">Secure Payment</span>
          </div>
          <BrandPill brand={brand} />
        </div>

        <div className="mt-4 rounded-lg bg-surface p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Cardholder</span>
            <span className="font-semibold text-foreground">{cardholder || "—"}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Card</span>
            <span className="font-mono font-semibold text-foreground">•••• •••• •••• {last4 || "••••"}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>Amount</span>
            <span className="font-extrabold text-foreground">{formatUSD(amount)}</span>
          </div>
        </div>

        {(stage === "contacting" || stage === "verifying" || stage === "authorising") && (
          <div className="mt-6 space-y-3">
            {STAGE_ORDER.slice(0, 4).filter((s) => s !== "otp").map((s) => {
              const idx = STAGE_ORDER.indexOf(s);
              const done = idx < stageIdx;
              const active = s === stage;
              return (
                <div key={s} className="flex items-center gap-3 text-sm">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {done ? <Check className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs">·</span>}
                  </div>
                  <span className={active ? "font-bold" : done ? "text-foreground" : "text-muted-foreground"}>
                    {STAGE_LABEL[s as keyof typeof STAGE_LABEL]}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {stage === "otp" && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Smartphone className="h-4 w-4 text-primary" /> 3-D Secure verification
            </div>
            <p className="mt-1 text-xs text-muted-foreground">An OTP has been sent to the mobile number registered with your bank.</p>
            <div className="mt-4 flex justify-center gap-2">
              {otp.map((d, i) => (
                <div key={i} className={`flex h-12 w-10 items-center justify-center rounded-md border-2 text-lg font-extrabold transition ${d ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground"}`}>
                  {d || "•"}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">Auto-verifying…</p>
          </div>
        )}

        {stage === "success" && (
          <div className="mt-6 animate-scale-in">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                <Check className="h-9 w-9 text-success" strokeWidth={3} />
                <span className="absolute inset-0 rounded-full bg-success/30 animate-ping" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-foreground">Payment Authorised</h3>
              <p className="mt-1 text-xs text-muted-foreground">Your transaction has been approved</p>
            </div>

            <div className="mt-5 rounded-lg border-2 border-dashed border-success/40 bg-success/5 p-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payment Receipt</span>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-extrabold uppercase text-success">Approved</span>
              </div>
              <dl className="mt-3 space-y-2 text-xs">
                <Row label="Auth Reference" value={<span className="font-mono font-extrabold text-foreground">{authRef}</span>} />
                <Row label="Cardholder" value={<span className="font-semibold text-foreground">{cardholder || "—"}</span>} />
                <Row label="Card" value={<span className="font-mono font-semibold text-foreground">•••• •••• •••• {last4 || "••••"}</span>} />
                <Row label="Brand" value={<span className="font-semibold uppercase text-foreground">{brand}</span>} />
                <Row label="Method" value={<span className="font-semibold text-foreground">3-D Secure</span>} />
                <Row label="Date" value={<span className="font-semibold text-foreground">{new Date().toLocaleString()}</span>} />
                <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount Paid</span>
                  <span className="text-base font-extrabold text-success">{formatUSD(amount)}</span>
                </div>
              </dl>
            </div>
          </div>
        )}

        {stage === "declined" && (
          <div className="mt-6 flex flex-col items-center text-center animate-scale-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
              <X className="h-9 w-9 text-destructive" strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-foreground">Payment Declined</h3>
            <p className="mt-1 text-xs text-muted-foreground">Insufficient funds. Please try another card.</p>
            <button onClick={onClose} className="mt-4 rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-dark">
              Try again
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          Demo simulation — no real charge
        </p>
      </div>
    </div>
  );
}

function BrandPill({ brand }: { brand: "visa" | "mastercard" | "card" }) {
  return _BrandPillImpl(brand);
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function _BrandPillImpl(brand: "visa" | "mastercard" | "card") {
  if (brand === "visa") return <span className="rounded bg-[#1A1F71] px-2 py-1 text-[10px] font-extrabold italic text-white">VISA</span>;
  if (brand === "mastercard")
    return (
      <span className="flex items-center">
        <span className="h-5 w-5 rounded-full bg-[#EB001B]" />
        <span className="-ml-2 h-5 w-5 rounded-full bg-[#F79E1B] opacity-90" />
      </span>
    );
  return <span className="text-[10px] font-bold uppercase text-muted-foreground">Card</span>;
}

export function detectBrand(digits: string): "visa" | "mastercard" | "card" {
  if (digits.startsWith("4")) return "visa";
  if (digits.startsWith("5") || digits.startsWith("2")) return "mastercard";
  return "card";
}

export function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}