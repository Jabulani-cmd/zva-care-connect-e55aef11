import { useMemo, useState } from "react";
import { toast } from "sonner";
import { STAFF_RX_QUEUE, type StaffRxQueueItem } from "@/data/staffDemo";
import { PageHeader, KPI, Card, StatusPill } from "./shared";
import { FileText, CheckCircle2, AlertTriangle, Clock, X, Phone, Mail, ShieldCheck, Pill, User2, Stethoscope, Calendar, Download } from "lucide-react";

export function PharmacistDashboard({ view }: { view?: string }) {
  const [items, setItems] = useState<StaffRxQueueItem[]>(STAFF_RX_QUEUE);
  const [active, setActive] = useState<StaffRxQueueItem | null>(null);

  const filter = view === "approved" ? "Approved" : view === "dispensed" ? "Dispensed" : "Pending";
  const visible = items.filter((i) => i.status === filter);

  const counts = useMemo(() => ({
    pending: items.filter((i) => i.status === "Pending").length,
    urgent: items.filter((i) => i.status === "Pending" && (i.priority === "Urgent" || i.priority === "Stat")).length,
    approvedToday: items.filter((i) => i.status === "Approved").length,
    dispensedToday: items.filter((i) => i.status === "Dispensed").length,
  }), [items]);

  const setStatus = (id: string, status: StaffRxQueueItem["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setActive(null);
    const labels = { Approved: "approved", Rejected: "rejected", Dispensed: "marked as dispensed", Pending: "returned to queue" };
    toast.success(`Prescription ${labels[status]}`);
  };

  return (
    <div>
      <PageHeader
        title="Prescription Queue"
        subtitle="Review uploaded scripts. PCZ audit log captures every action."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPI label="Pending review" value={String(counts.pending)} hint="awaiting pharmacist" accent="#F59E0B" icon={<Clock className="h-5 w-5" />} />
        <KPI label="Urgent / Stat" value={String(counts.urgent)} hint="needs immediate review" accent="#DC2626" icon={<AlertTriangle className="h-5 w-5" />} />
        <KPI label="Approved today" value={String(counts.approvedToday)} accent="#00853F" icon={<CheckCircle2 className="h-5 w-5" />} />
        <KPI label="Dispensed today" value={String(counts.dispensedToday)} accent="#0EA5E9" icon={<Pill className="h-5 w-5" />} />
      </div>

      <div className="mt-6">
        <Card title={`${filter} prescriptions (${visible.length})`}>
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing here.</p>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((rx) => (
                <li key={rx.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{rx.medication}</span>
                      <StatusPill status={rx.priority} />
                      {rx.isRepeat && <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">Repeat × {rx.repeatsLeft}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rx.patient} · {rx.doctor} · {rx.id} · {rx.uploadedAt}
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(rx)}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary-dark"
                  >
                    Review
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {active && <RxReviewModal rx={active} onClose={() => setActive(null)} onAction={setStatus} />}
    </div>
  );
}

function RxReviewModal({
  rx, onClose, onAction,
}: {
  rx: StaffRxQueueItem;
  onClose: () => void;
  onAction: (id: string, status: StaffRxQueueItem["status"]) => void;
}) {
  const [notes, setNotes] = useState(rx.notes ?? "");
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:rounded-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold">Review prescription</h2>
              <StatusPill status={rx.status} />
              <StatusPill status={rx.priority} />
            </div>
            <p className="text-xs text-muted-foreground">{rx.id} · uploaded {rx.uploadedAt}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button>
        </header>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_320px]">
          {/* Script preview */}
          <div>
            <div className="rounded-lg border-2 border-dashed border-border bg-[#FAFAF7] p-4">
              <div className="rounded bg-white p-6 shadow ring-1 ring-border">
                <div className="border-b pb-3 text-center">
                  <div className="text-sm font-extrabold">{rx.doctor}</div>
                  <div className="text-[10px] text-muted-foreground">MBChB · Suite 12, Avondale Medical Centre · Harare</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="font-bold">Patient:</span> {rx.patient}</div>
                  <div className="text-right"><span className="font-bold">Date:</span> {rx.uploadedAt}</div>
                </div>
                <div className="mt-6">
                  <div className="text-2xl font-black text-primary">℞</div>
                  <div className="mt-2 text-sm font-bold">{rx.medication}</div>
                  <div className="text-sm">Sig: {rx.dosage}</div>
                  {rx.isRepeat && <div className="mt-2 text-xs italic">Repeat × {rx.repeatsLeft} remaining</div>}
                </div>
                <div className="mt-12 flex items-end justify-between border-t pt-3">
                  <div className="text-[10px] text-muted-foreground">PCZ MP# 12345</div>
                  <div className="text-right">
                    <div className="border-t border-foreground/40 pt-1 text-[10px] italic">Signature</div>
                  </div>
                </div>
              </div>
              <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Download className="h-3 w-3" /> Download original
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">Pharmacist notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Clinical notes, substitutions, counselling points…"
              />
            </div>
          </div>

          {/* Patient + actions */}
          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Patient</div>
              <div className="mt-1 text-sm font-bold">{rx.patient}</div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {rx.customerPhone}</div>
                <div className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {rx.customerEmail}</div>
                {rx.medicalAid && <div className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> {rx.medicalAid}</div>}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prescriber</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-bold"><Stethoscope className="h-3.5 w-3.5" /> {rx.doctor}</div>
            </div>

            {rx.status === "Pending" && (
              <div className="space-y-2">
                <button
                  onClick={() => onAction(rx.id, "Approved")}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve & queue for dispensing
                </button>
                <button
                  onClick={() => onAction(rx.id, "Rejected")}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive py-3 text-sm font-bold text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" /> Reject (notify patient)
                </button>
              </div>
            )}
            {rx.status === "Approved" && (
              <button
                onClick={() => onAction(rx.id, "Dispensed")}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-700"
              >
                <Pill className="h-4 w-4" /> Mark as dispensed
              </button>
            )}

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
              <div className="flex items-center gap-1.5 font-bold"><Calendar className="h-3 w-3" /> Audit log</div>
              <div className="mt-1">Every action on this script is logged to the PCZ-compliant audit trail with timestamp &amp; pharmacist ID.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}