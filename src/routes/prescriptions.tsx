import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth, type Prescription } from "@/store/auth";
import {
  Upload, FileText, Clock, CheckCircle2, XCircle, Pill, Truck, X, ImageIcon,
  AlertTriangle, ShieldCheck, FileWarning,
} from "lucide-react";

export const Route = createFileRoute("/prescriptions")({
  head: () => ({ meta: [{ title: "Prescriptions — Plus2 Pharmacy" }] }),
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  const user = useAuth((s) => s.user);
  const prescriptions = useAuth((s) => s.prescriptions);
  const addPrescription = useAuth((s) => s.addPrescription);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-6 text-primary-foreground shadow-lg">
        <div className="text-xs font-bold uppercase tracking-wider opacity-90">Pharmacy services</div>
        <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">My Prescriptions</h1>
        <p className="mt-1 text-sm opacity-95 md:max-w-xl">Upload your script and a Plus2 pharmacist will review it within 30 minutes. Approved scripts are dispensed and delivered to your door.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <UploadCard onAdd={addPrescription} />
        <PrescriptionList prescriptions={prescriptions} />
      </div>
    </div>
  );
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

function UploadCard({ onAdd }: { onAdd: (p: { fileName: string; patientName: string; doctorName: string; notes?: string }) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [drag, setDrag] = useState(false);

  const [phase, setPhase] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!ALLOWED.includes(f.type)) return "Unsupported file type. Use JPG, PNG, WEBP or PDF.";
    if (f.size > MAX_BYTES) return `File is too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`;
    if (f.size < 5 * 1024) return "File looks too small to be a readable script (min 5 KB).";
    return null;
  };

  const onFile = (f?: File | null) => {
    if (!f) return;
    const err = validate(f);
    if (err) {
      setFile(null); setPreview(null); setFileError(err);
      toast.error(err);
      return;
    }
    setFileError(null);
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null); setPreview(null); setFileError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const reset = () => {
    clearFile(); setPatient(""); setDoctor(""); setNotes("");
    setPhase("idle"); setProgress(0); setErrorMsg(null); setLastId(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setFileError("Please attach your script before submitting."); return; }
    if (!patient.trim() || !doctor.trim()) { toast.error("Patient and doctor names are required"); return; }

    setPhase("uploading"); setProgress(0); setErrorMsg(null);

    // Simulate chunked upload progress
    await new Promise<void>((resolve) => {
      let p = 0;
      const t = setInterval(() => {
        p += Math.random() * 18 + 6;
        if (p >= 100) { p = 100; clearInterval(t); resolve(); }
        setProgress(Math.round(p));
      }, 220);
    });

    // 1-in-7 simulated server-side failure for realistic UX
    if (Math.random() < 0.14) {
      setPhase("error");
      setErrorMsg("Our server couldn't read this script clearly. Please retake the photo with good lighting and try again.");
      toast.error("Upload failed — try a clearer image");
      return;
    }

    const id = "RX-" + Math.floor(90000 + Math.random() * 9999);
    onAdd({ fileName: file.name, patientName: patient.trim(), doctorName: doctor.trim(), notes: notes.trim() || undefined });
    setLastId(id);
    setPhase("success");
    toast.success("Script submitted — pharmacist will review within 30 min.");
  };

  if (phase === "success") {
    return (
      <div className="space-y-4 rounded-xl border border-success/30 bg-success/5 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success text-white"><CheckCircle2 className="h-6 w-6" /></div>
          <div>
            <div className="font-extrabold">Script received</div>
            <div className="text-xs text-muted-foreground">Reference {lastId}</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">A Plus2 pharmacist is reviewing your prescription. You'll get an SMS and email within 30 minutes.</p>
        <div className="flex gap-2">
          <button onClick={reset} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-bold uppercase text-primary-foreground hover:bg-primary-dark">Upload another</button>
          <Link to="/account" className="flex-1 rounded-md border border-border py-2.5 text-center text-sm font-bold hover:bg-muted">View account</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-extrabold">Upload a new script</h2>
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP or PDF · max 10 MB · clear, well-lit photo</p>
      </div>

      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition ${
            fileError ? "border-destructive bg-destructive/5" : drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-muted/50"
          }`}
        >
          <Upload className={`h-8 w-8 ${fileError ? "text-destructive" : "text-primary"}`} />
          <div className="text-sm font-semibold">Click or drop your script here</div>
          <div className="text-xs text-muted-foreground">Photos of paper scripts are supported</div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </div>
      )}

      {file && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            {preview ? (
              <img src={preview} alt="Script preview" className="h-full w-full object-cover" />
            ) : file.type === "application/pdf" ? (
              <FileText className="h-7 w-7 text-primary" />
            ) : (
              <ImageIcon className="h-7 w-7 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold">{file.name}</div>
            <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split("/")[1].toUpperCase()}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-success"><ShieldCheck className="h-3 w-3" /> Looks good · ready to submit</div>
          </div>
          <button type="button" onClick={clearFile} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label="Remove file"><X className="h-4 w-4" /></button>
        </div>
      )}

      {fileError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          <FileWarning className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      <Field label="Patient full name" value={patient} onChange={(e) => setPatient(e.target.value)} required />
      <Field label="Prescribing doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Notes (optional)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={500} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Allergies, repeat instructions, delivery notes…" />
        <span className="mt-1 block text-right text-[10px] text-muted-foreground">{notes.length}/500</span>
      </label>

      {phase === "uploading" && (
        <div className="space-y-2 rounded-md border border-border bg-surface p-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Uploading securely…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {phase === "error" && errorMsg && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <div className="font-bold">Submission failed</div>
            <div className="text-xs">{errorMsg}</div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button disabled={phase === "uploading"} className="flex-1 rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-dark disabled:opacity-60">
          {phase === "uploading" ? "Uploading…" : phase === "error" ? "Retry submission" : "Submit for review"}
        </button>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><ShieldCheck className="h-3 w-3 text-success" /> Files are encrypted and only viewed by a registered pharmacist.</p>
    </form>
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

const statusStyle: Record<Prescription["status"], { icon: typeof Clock; cls: string; tip: string }> = {
  Pending: { icon: Clock, cls: "bg-warning/15 text-foreground", tip: "Awaiting pharmacist review" },
  Approved: { icon: CheckCircle2, cls: "bg-primary/10 text-primary", tip: "Ready to dispense" },
  Dispensed: { icon: Pill, cls: "bg-success/15 text-success", tip: "Out for delivery / collected" },
  Rejected: { icon: XCircle, cls: "bg-destructive/10 text-destructive", tip: "See pharmacist note" },
};

const PIPELINE = [
  { key: "Pending" as const, label: "Submitted", icon: Upload, desc: "Received by Plus2" },
  { key: "Approved" as const, label: "Pharmacist review", icon: CheckCircle2, desc: "Verified & approved" },
  { key: "Dispensed" as const, label: "Dispensed", icon: Pill, desc: "Packed & ready" },
  { key: "Delivered" as const, label: "On the way", icon: Truck, desc: "Out for delivery" },
];

function StatusPipeline({ status }: { status: Prescription["status"] }) {
  if (status === "Rejected") {
    return (
      <div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div><span className="font-bold">Rejected.</span> Please contact our pharmacist on +263 78 200 0100 — we may need a clearer script.</div>
      </div>
    );
  }
  const currentIdx = status === "Pending" ? 0 : status === "Approved" ? 1 : 2;
  return (
    <ol className="mt-3 grid grid-cols-4 gap-1">
      {PIPELINE.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const Icon = step.icon;
        return (
          <li key={step.key} className="flex flex-col items-center text-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition ${done ? "bg-success text-white" : active ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted text-muted-foreground"}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className={`mt-1 text-[10px] font-bold uppercase ${active ? "text-primary" : done ? "text-success" : "text-muted-foreground"}`}>{step.label}</div>
            <div className="text-[9px] text-muted-foreground">{step.desc}</div>
            {i < PIPELINE.length - 1 && (
              <div className={`mt-1 hidden h-0.5 w-full ${done ? "bg-success" : "bg-border"} sm:block`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function PrescriptionList({ prescriptions }: { prescriptions: Prescription[] }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <h2 className="text-lg font-extrabold">Your scripts</h2>
        <p className="text-xs text-muted-foreground">{prescriptions.length} total</p>
      </div>
      {prescriptions.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground">No prescriptions yet.</div>
      ) : (
        <ul className="divide-y divide-border">
          {prescriptions.map((p) => {
            const s = statusStyle[p.status];
            const Icon = s.icon;
            return (
              <li key={p.id} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><FileText className="h-6 w-6" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold">{p.id}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${s.cls}`}><Icon className="h-3 w-3" /> {p.status}</span>
                    </div>
                    <div className="truncate text-sm text-muted-foreground">{p.fileName} · {p.doctorName} · {p.patientName}</div>
                    {p.notes && <div className="mt-1 text-xs text-muted-foreground">📝 {p.notes}</div>}
                    <div className="mt-1 text-xs text-muted-foreground">Uploaded {p.uploadedAt} · {s.tip}</div>
                  </div>
                  {p.status === "Approved" && (
                    <Link to="/checkout" className="rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground hover:bg-primary-dark">Pay & dispense</Link>
                  )}
                </div>
                <StatusPipeline status={p.status} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}