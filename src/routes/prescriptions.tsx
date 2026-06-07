import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth, type Prescription } from "@/store/auth";
import { Upload, FileText, Clock, CheckCircle2, XCircle, Pill } from "lucide-react";

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

function UploadCard({ onAdd }: { onAdd: (p: { fileName: string; patientName: string; doctorName: string; notes?: string }) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [notes, setNotes] = useState("");
  const [drag, setDrag] = useState(false);

  const onFile = (f?: File | null) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) return toast.error("File too large (max 10 MB)");
    setFileName(f.name);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return toast.error("Please attach your script");
    if (!patient || !doctor) return toast.error("Patient and doctor name are required");
    onAdd({ fileName, patientName: patient, doctorName: doctor, notes: notes || undefined });
    toast.success("Script submitted — pharmacist will review shortly.");
    setFileName(""); setPatient(""); setDoctor(""); setNotes("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-extrabold">Upload a new script</h2>
        <p className="text-xs text-muted-foreground">JPG, PNG or PDF · max 10 MB</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0]); }}
        onClick={() => fileRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/60 hover:bg-muted/50"}`}
      >
        <Upload className="h-8 w-8 text-primary" />
        <div className="text-sm font-semibold">{fileName || "Click or drop your script here"}</div>
        <div className="text-xs text-muted-foreground">We support clear photos of paper scripts too</div>
        <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>

      <Field label="Patient full name" value={patient} onChange={(e) => setPatient(e.target.value)} required />
      <Field label="Prescribing doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">Notes (optional)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Allergies, repeat instructions, delivery notes…" />
      </label>
      <button className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-dark">Submit for review</button>
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
              <li key={p.id} className="flex flex-wrap items-center gap-4 p-5">
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}