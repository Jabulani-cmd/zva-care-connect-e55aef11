import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import { Logo } from "@/components/layout/Logo";
import { ShieldCheck, Truck, Sparkles, Mail } from "lucide-react";

type Mode = "login" | "register" | "forgot";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in or Register — Plus2 Pharmacy" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const router = useRouter();
  useEffect(() => {
    if (user) navigate({ to: "/account" });
  }, [user, navigate]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-2 lg:py-14">
      <div className="hidden flex-col justify-center rounded-md bg-primary p-10 text-primary-foreground shadow-sm lg:flex">
        <Logo className="[&_*]:!text-white" />
        <h2 className="mt-8 text-3xl font-extrabold leading-tight">Your health, one tap away.</h2>
        <p className="mt-3 text-white/90">Manage prescriptions, track deliveries and shop the full pharmacy from anywhere in Zimbabwe.</p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-white" /> Secure, encrypted account</li>
          <li className="flex items-start gap-3"><Truck className="mt-0.5 h-5 w-5 text-white" /> Free same-day delivery on orders over US$50</li>
          <li className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-white" /> Registered pharmacists available online</li>
        </ul>
        <div className="mt-10 rounded-lg border border-white/20 bg-white/10 p-4 text-sm backdrop-blur">
          <div className="font-bold">Demo account</div>
          <div className="mt-1 text-white/90">demo@plus2pharmacy.co.za / <span className="font-mono">Demo1234!</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex gap-2 lg:hidden"><Logo /></div>

        {mode !== "forgot" && (
          <div className="mb-6 flex rounded-md bg-muted p-1 text-sm font-semibold">
            <button onClick={() => setMode("login")} className={`flex-1 rounded-md py-2 transition ${mode === "login" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>Sign in</button>
            <button onClick={() => setMode("register")} className={`flex-1 rounded-md py-2 transition ${mode === "register" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>Create account</button>
          </div>
        )}

        {mode === "login" && <LoginForm onForgot={() => setMode("forgot")} onSuccess={() => router.history.back()} />}
        {mode === "register" && <RegisterForm onSuccess={() => navigate({ to: "/account" })} />}
        {mode === "forgot" && <ForgotForm onBack={() => setMode("login")} />}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to Plus2's <a href="#" className="underline">Terms</a> & <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input {...rest} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </label>
  );
}

function LoginForm({ onForgot, onSuccess }: { onForgot: () => void; onSuccess: () => void }) {
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("demo@plus2pharmacy.co.za");
  const [password, setPassword] = useState("Demo1234!");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (!r.ok) return toast.error(r.error ?? "Login failed");
    toast.success("Welcome back!");
    onSuccess();
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-extrabold">Welcome back</h1>
      <p className="-mt-2 text-sm text-muted-foreground">Sign in to view orders, scripts and rewards.</p>
      <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Remember me</label>
        <button type="button" onClick={onForgot} className="font-semibold text-primary hover:underline">Forgot password?</button>
      </div>
      <button disabled={loading} className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const register = useAuth((s) => s.register);
  const [f, setF] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await register(f);
    setLoading(false);
    if (!r.ok) return toast.error(r.error ?? "Registration failed");
    toast.success("Account created. Welcome to Plus2!");
    onSuccess();
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-extrabold">Create your account</h1>
      <p className="-mt-2 text-sm text-muted-foreground">Join thousands of Zimbabwean families who trust Plus2.</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" required value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} />
        <Field label="Last name" required value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} />
      </div>
      <Field label="Email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      <Field label="Mobile" type="tel" placeholder="+27 82 000 0000" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
      <Field label="Password (min 8 chars)" type="password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      <button disabled={loading} className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-dark disabled:opacity-60">
        {loading ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const reset = useAuth((s) => s.resetPassword);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await reset(email);
    setSent(true);
    toast.success("Reset link sent — check your inbox.");
  };
  if (sent)
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-success/15 text-success"><Mail className="h-7 w-7" /></div>
        <h2 className="text-xl font-extrabold">Check your email</h2>
        <p className="text-sm text-muted-foreground">We sent a password reset link to <strong>{email}</strong>.</p>
        <button onClick={onBack} className="rounded-md border border-border px-4 py-2 text-sm font-bold hover:bg-muted">Back to sign in</button>
      </div>
    );
  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-extrabold">Reset your password</h1>
      <p className="-mt-2 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
      <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-dark">Send reset link</button>
      <button type="button" onClick={onBack} className="w-full text-sm font-semibold text-primary hover:underline">← Back to sign in</button>
    </form>
  );
}