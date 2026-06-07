import { useMemo, useState } from "react";
import { toast } from "sonner";
import { STAFF_RX_QUEUE, type StaffRxQueueItem } from "@/data/staffDemo";
import { useAuth } from "@/store/auth";
import type { Quotation, Prescription } from "@/store/auth";
import { PageHeader, KPI, Card, StatusPill } from "./shared";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Pill,
  Stethoscope,
  Calendar,
  Download,
  DollarSign,
  Truck,
  Store,
  Bell,
  User,
} from "lucide-react";

// ============================================================
// MAIN DASHBOARD
// ============================================================
export function PharmacistDashboard({ view }: { view?: string }) {
  const authPrescriptions = useAuth((s) => s.prescriptions);
  const updatePrescriptionStatus = useAuth(
    (s) => s.updatePrescriptionStatus
  );

  // Convert customer-uploaded prescriptions into queue format
  const customerRxItems: StaffRxQueueItem[] =
    authPrescriptions
      .filter(
        (p) =>
          p.status === "Pending" ||
          p.status === "Under Review" ||
          p.status === "Approved — Awaiting Payment"
      )
      .map((p) => ({
        id: p.id,
        patient: p.patientName,
        doctor: p.doctorName,
        medication:
          p.notes && p.notes.trim().length > 0
            ? p.notes
            : "See uploaded script",
        dosage: "See uploaded script",
        uploadedAt: p.uploadedAt,
        priority: "Routine" as const,
        status:
          p.status === "Approved — Awaiting Payment"
            ? ("Approved" as const)
            : ("Pending" as const),
        customerPhone: "",
        customerEmail: "",
        isRepeat: p.isRepeat,
        repeatsLeft: p.repeatsLeft,
        isCustomerRx: true,
        authId: p.id,
      }));

  const [demoItems, setDemoItems] =
    useState<StaffRxQueueItem[]>(STAFF_RX_QUEUE);
  const [active, setActive] =
    useState<StaffRxQueueItem | null>(null);

  // Customer Rx items appear at the top
  const allItems = [
    ...customerRxItems,
    ...demoItems.filter(
      (i) => !customerRxItems.find((c) => c.id === i.id)
    ),
  ];

  const filter =
    view === "approved"
      ? "Approved"
      : view === "dispensed"
      ? "Dispensed"
      : "Pending";

  const visible = allItems.filter((i) => i.status === filter);

  const counts = useMemo(
    () => ({
      pending: allItems.filter((i) => i.status === "Pending")
        .length,
      urgent: allItems.filter(
        (i) =>
          i.status === "Pending" &&
          (i.priority === "Urgent" || i.priority === "Stat")
      ).length,
      approvedToday: allItems.filter(
        (i) => i.status === "Approved"
      ).length,
      dispensedToday: allItems.filter(
        (i) => i.status === "Dispensed"
      ).length,
    }),
    [allItems]
  );

  const setStatus = (
    id: string,
    status: StaffRxQueueItem["status"]
  ) => {
    // Update demo queue
    setDemoItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );

    // Update real customer prescription in auth store
    const customerItem = customerRxItems.find(
      (c) => c.id === id
    );
    if (customerItem) {
      const authStatus =
        status === "Approved"
          ? ("Approved — Awaiting Payment" as const)
          : status === "Rejected"
          ? ("Rejected" as const)
          : status === "Dispensed"
          ? ("Dispensed" as const)
          : ("Pending" as const);
      updatePrescriptionStatus(id, authStatus);
    }

    setActive(null);

    const labels: Record<string, string> = {
      Approved: "approved — quotation sent to patient",
      Rejected: "rejected — patient notified",
      Dispensed: "marked as dispensed",
      Pending: "returned to queue",
    };
    toast.success(
      "Prescription " + (labels[status] ?? status)
    );
  };

  // Find the matching auth prescription for the active item
  const activeAuthPrescription: Prescription | null =
    active
      ? (authPrescriptions.find(
          (p) =>
            p.id === active.id ||
            p.patientName === active.patient
        ) ?? null)
      : null;

  return (
    <div>
      <PageHeader
        title="Prescription Queue"
        subtitle="Review uploaded scripts. Every action is logged to the ZPC-compliant audit trail."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KPI
          label="Pending review"
          value={String(counts.pending)}
          hint="awaiting pharmacist"
          accent="#F59E0B"
          icon={<Clock className="h-5 w-5" />}
        />
        <KPI
          label="Urgent / Stat"
          value={String(counts.urgent)}
          hint="needs immediate review"
          accent="#DC2626"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <KPI
          label="Approved today"
          value={String(counts.approvedToday)}
          accent="#00853F"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <KPI
          label="Dispensed today"
          value={String(counts.dispensedToday)}
          accent="#0EA5E9"
          icon={<Pill className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6">
        <Card
          title={
            filter +
            " prescriptions (" +
            visible.length +
            ")"
          }
        >
          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No prescriptions here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((rx) => (
                <li
                  key={rx.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  {/* Icon — green badge for real customer Rx */}
                  <div
                    className={
                      "flex h-10 w-10 shrink-0 items-center " +
                      "justify-center rounded-lg " +
                      (rx.isCustomerRx
                        ? "bg-green-100 text-green-700"
                        : "bg-primary/10 text-primary")
                    }
                  >
                    {rx.isCustomerRx ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <FileText className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-foreground">
                        {rx.medication}
                      </span>
                      <StatusPill status={rx.priority} />
                      {rx.isCustomerRx && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          Customer Upload
                        </span>
                      )}
                      {rx.isRepeat && (
                        <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-700">
                          Repeat × {rx.repeatsLeft}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rx.patient} · {rx.doctor} · {rx.id} ·{" "}
                      {rx.uploadedAt}
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

      {active && (
        <RxReviewModal
          rx={active}
          onClose={() => setActive(null)}
          onAction={setStatus}
          authPrescription={activeAuthPrescription}
        />
      )}
    </div>
  );
}

// ============================================================
// REVIEW MODAL
// ============================================================
function RxReviewModal({
  rx,
  onClose,
  onAction,
  authPrescription,
}: {
  rx: StaffRxQueueItem;
  onClose: () => void;
  onAction: (
    id: string,
    status: StaffRxQueueItem["status"]
  ) => void;
  authPrescription: Prescription | null;
}) {
  const updatePrescriptionStatus = useAuth(
    (s) => s.updatePrescriptionStatus
  );

  const [notes, setNotes] = useState(rx.notes ?? "");
  const [showQuotationForm, setShowQuotationForm] =
    useState(false);
  const [quotation, setQuotation] = useState({
    medicationCost: "",
    deliveryFee: "15.00",
    medicationName: rx.medication,
    dosage: rx.dosage,
    quantity: "30 tablets",
    notes: "",
  });

  // Use auth prescription for delivery info if available
  const deliveryMode =
    authPrescription?.delivery ?? "delivery";
  const deliveryAddress =
    authPrescription?.deliveryAddress ?? null;
  const collectionBranchId =
    authPrescription?.collectionBranchId ?? null;

  const totalAmount =
    parseFloat(quotation.medicationCost || "0") +
    (deliveryMode === "delivery"
      ? parseFloat(quotation.deliveryFee || "0")
      : 0);

  const handleApproveWithQuotation = () => {
    const medCost = parseFloat(quotation.medicationCost);
    const delFee = parseFloat(quotation.deliveryFee);

    if (!medCost || medCost <= 0) {
      toast.error("Please enter a valid medication cost");
      return;
    }

    const total =
      deliveryMode === "collect" ? medCost : medCost + delFee;

    const q: Quotation = {
      medicationCost: medCost,
      deliveryFee: deliveryMode === "collect" ? 0 : delFee,
      total,
      medicationName: quotation.medicationName,
      dosage: quotation.dosage,
      quantity: quotation.quantity,
      pharmacistName: "Dr. Rumbidzai Ncube (BPharm)",
      approvedAt: new Date().toLocaleString("en-ZW", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      notes: quotation.notes || notes || undefined,
    };

    // Update the auth store prescription
    const targetId = authPrescription?.id ?? rx.id;
    updatePrescriptionStatus(
      targetId,
      "Approved — Awaiting Payment",
      { quotation: q }
    );

    // Update the queue item status
    onAction(rx.id, "Approved");

    toast.success(
      "Prescription approved — quotation of $" +
        total.toFixed(2) +
        " sent to " +
        rx.patient
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 md:items-center md:p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:rounded-2xl">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold">
                Review prescription
              </h2>
              <StatusPill status={rx.status} />
              <StatusPill status={rx.priority} />
              {rx.isCustomerRx && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                  Customer Upload
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {rx.id} · uploaded {rx.uploadedAt}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-6 p-6 md:grid-cols-[1fr_340px]">

          {/* LEFT — Script preview */}
          <div>
            {/* If customer uploaded real files, show them */}
            {authPrescription?.files &&
              authPrescription.files.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                  Uploaded Files ({authPrescription.files.length})
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {authPrescription.files.map((f, i) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden rounded-lg border border-border bg-muted/20 flex items-center justify-center"
                    >
                      {f.dataUrl ? (
                        <img
                          src={f.dataUrl}
                          alt={"Script " + (i + 1)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <FileText className="h-8 w-8 mx-auto text-primary mb-1" />
                          <p className="text-[10px] font-medium text-foreground truncate">
                            {f.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {(f.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prescription document */}
            <div className="rounded-lg border-2 border-dashed border-border bg-[#FAFAF7] p-4">
              <div className="rounded bg-white p-6 shadow ring-1 ring-border">
                <div className="border-b pb-3 text-center">
                  <div className="text-sm font-extrabold">
                    {rx.doctor}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    MBChB · Suite 12, Avondale Medical Centre ·
                    Harare
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    MCZ Reg: MCZ-GP-004521
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold">Patient:</span>{" "}
                    {rx.patient}
                  </div>
                  <div className="text-right">
                    <span className="font-bold">Date:</span>{" "}
                    {rx.uploadedAt}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-2xl font-black text-primary">
                    ℞
                  </div>
                  <div className="mt-2 text-sm font-bold">
                    {rx.medication}
                  </div>
                  <div className="text-sm">
                    Sig: {rx.dosage}
                  </div>
                  {rx.isRepeat && (
                    <div className="mt-2 text-xs italic">
                      Repeat × {rx.repeatsLeft} remaining
                    </div>
                  )}
                  {authPrescription?.scriptDate && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Script date: {authPrescription.scriptDate}
                    </div>
                  )}
                </div>
                <div className="mt-12 flex items-end justify-between border-t pt-3">
                  <div className="text-[10px] text-muted-foreground">
                    ZPC MP# 12345
                  </div>
                  <div className="text-right">
                    <div className="border-t border-foreground/40 pt-1 text-[10px] italic">
                      Signature
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Download className="h-3 w-3" /> Download original
              </button>
            </div>

            {/* Delivery info from customer */}
            {(deliveryAddress || collectionBranchId) && (
              <div
                className="mt-4 rounded-lg p-3 text-sm"
                style={{
                  background: "#F0F9F4",
                  border: "1px solid #BBF7D0",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {deliveryMode === "delivery" ? (
                    <Truck className="h-4 w-4 text-primary" />
                  ) : (
                    <Store className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-semibold text-[#111827] text-xs uppercase tracking-wide">
                    {deliveryMode === "delivery"
                      ? "Home Delivery"
                      : "Collection In-Store"}
                  </span>
                </div>
                {deliveryMode === "delivery" &&
                deliveryAddress ? (
                  <div className="text-xs text-[#374151] space-y-0.5">
                    <p className="font-medium">
                      {deliveryAddress.firstName}{" "}
                      {deliveryAddress.lastName}
                    </p>
                    <p>{deliveryAddress.streetAddress}</p>
                    <p>
                      {deliveryAddress.suburb},{" "}
                      {deliveryAddress.city}, Zimbabwe
                    </p>
                    <p>{deliveryAddress.phone}</p>
                    {deliveryAddress.specialInstructions && (
                      <p className="italic text-[#6B7280]">
                        Note:{" "}
                        {deliveryAddress.specialInstructions}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#374151]">
                    Patient will collect from branch
                    {collectionBranchId
                      ? ": " +
                        collectionBranchId
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                          )
                      : ""}
                  </p>
                )}
              </div>
            )}

            {/* No delivery info for demo scripts */}
            {!authPrescription &&
              !deliveryAddress &&
              !collectionBranchId && (
              <div
                className="mt-4 rounded-lg p-3 text-xs"
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                }}
              >
                <p className="text-muted-foreground">
                  Delivery details not available for this script.
                  Contact patient on{" "}
                  <span className="font-semibold">
                    {rx.customerPhone}
                  </span>{" "}
                  to confirm.
                </p>
              </div>
            )}

            {/* Pharmacist notes */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Pharmacist notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Clinical notes, substitutions, counselling points…"
              />
            </div>
          </div>

          {/* RIGHT — Patient info + actions */}
          <aside className="space-y-4">

            {/* Patient card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Patient
              </div>
              <div className="mt-1 text-sm font-bold">
                {rx.patient}
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                {rx.customerPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3" />{" "}
                    {rx.customerPhone}
                  </div>
                )}
                {rx.customerEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />{" "}
                    {rx.customerEmail}
                  </div>
                )}
                {rx.medicalAid && (
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" />{" "}
                    {rx.medicalAid}
                  </div>
                )}
                {!rx.customerPhone && !rx.customerEmail && (
                  <p className="italic text-[#9CA3AF]">
                    Contact details from uploaded script
                  </p>
                )}
              </div>
            </div>

            {/* Prescriber card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Prescriber
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                <Stethoscope className="h-3.5 w-3.5" />{" "}
                {rx.doctor}
              </div>
            </div>

            {/* PENDING — approve or reject */}
            {rx.status === "Pending" && !showQuotationForm && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowQuotationForm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve & Send Quotation
                </button>
                <button
                  onClick={() => onAction(rx.id, "Rejected")}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive py-3 text-sm font-bold text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" /> Reject — Notify
                  Patient
                </button>
              </div>
            )}

            {/* QUOTATION FORM */}
            {rx.status === "Pending" && showQuotationForm && (
              <div
                className="rounded-lg p-4 space-y-3"
                style={{
                  background: "#F0F9F4",
                  border: "1px solid #BBF7D0",
                }}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <p className="font-bold text-sm text-[#111827]">
                    Create Quotation for Patient
                  </p>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Enter the medication cost. The patient will
                  receive a payment notification with this amount.
                </p>

                {/* Medication */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#374151] mb-1">
                    Medication
                  </label>
                  <input
                    type="text"
                    value={quotation.medicationName}
                    onChange={(e) =>
                      setQuotation({
                        ...quotation,
                        medicationName: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#374151] mb-1">
                    Quantity to Dispense
                  </label>
                  <input
                    type="text"
                    value={quotation.quantity}
                    onChange={(e) =>
                      setQuotation({
                        ...quotation,
                        quantity: e.target.value,
                      })
                    }
                    placeholder="e.g. 30 tablets"
                    className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Medication cost */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#374151] mb-1">
                    Medication Cost (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#374151]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={quotation.medicationCost}
                      onChange={(e) =>
                        setQuotation({
                          ...quotation,
                          medicationCost: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      className="w-full rounded-md border border-[#D1D5DB] bg-white pl-7 pr-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Delivery fee */}
                {deliveryMode === "delivery" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[#374151] mb-1">
                      Delivery Fee (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#374151]">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={quotation.deliveryFee}
                        onChange={(e) =>
                          setQuotation({
                            ...quotation,
                            deliveryFee: e.target.value,
                          })
                        }
                        className="w-full rounded-md border border-[#D1D5DB] bg-white pl-7 pr-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                {/* Total preview */}
                {quotation.medicationCost && (
                  <div
                    className="rounded-md p-3 flex items-center justify-between"
                    style={{
                      background: "white",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <span className="text-sm text-[#374151]">
                      Total patient will pay
                    </span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: "#00853F" }}
                    >
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Patient instructions */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#374151] mb-1">
                    Instructions for Patient (optional)
                  </label>
                  <textarea
                    value={quotation.notes}
                    onChange={(e) =>
                      setQuotation({
                        ...quotation,
                        notes: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="Take with food, avoid alcohol, etc."
                    className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Notification preview */}
                <div
                  className="rounded-md p-3 text-xs"
                  style={{
                    background: "#FEF9C3",
                    border: "1px solid #FDE68A",
                  }}
                >
                  <p className="font-semibold text-[#854D0E] mb-1">
                    Patient will receive this notification:
                  </p>
                  <p className="text-[#374151]">
                    "Your prescription has been approved by Dr.
                    Rumbidzai Ncube. Total amount due: $
                    {totalAmount.toFixed(2)}. Tap to pay and
                    confirm your order."
                  </p>
                </div>

                <button
                  onClick={handleApproveWithQuotation}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
                >
                  <Bell className="h-4 w-4" />
                  Send Quotation & Notify Patient
                </button>
                <button
                  onClick={() => setShowQuotationForm(false)}
                  className="w-full text-xs text-center text-[#6B7280] hover:text-[#374151] py-1"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* APPROVED — awaiting payment */}
            {rx.status === "Approved" && (
              <div className="space-y-2">
                <div
                  className="rounded-lg p-3 text-xs"
                  style={{
                    background: "#F0F9F4",
                    border: "1px solid #BBF7D0",
                  }}
                >
                  <p className="font-semibold text-[#00853F]">
                    Awaiting patient payment
                  </p>
                  <p className="text-[#374151] mt-0.5">
                    Quotation sent to patient. Once paid, mark
                    as dispensed to notify the dispatcher.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onAction(rx.id, "Dispensed")
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-sky-600 py-3 text-sm font-bold text-white hover:bg-sky-700"
                >
                  <Pill className="h-4 w-4" /> Mark as
                  Dispensed
                </button>
              </div>
            )}

            {/* Audit log */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800">
              <div className="flex items-center gap-1.5 font-bold">
                <Calendar className="h-3 w-3" /> Audit log
              </div>
              <div className="mt-1">
                Every action is logged to the ZPC-compliant
                audit trail with timestamp and pharmacist ID.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
