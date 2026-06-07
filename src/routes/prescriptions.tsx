import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import PaymentModal from "@/components/checkout/PaymentModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/store/auth";
import {
  Camera, Image as ImageIcon, Mail, ChevronRight, Upload, X, Plus, FileText,
  AlertTriangle, CheckCircle2, ShieldCheck, ArrowLeft, Truck, Store,
} from "lucide-react";

export const Route = createFileRoute("/prescriptions")({
  head: () => ({ meta: [{ title: "Upload Prescription — Plus2 Pharmacy" }] }),
  component: PrescriptionsPage,
});

const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ACCEPTED = "image/jpeg,image/png,image/heic,image/heif,application/pdf";

type LocalFile = { id: string; file: File; preview?: string; error?: string };

function PrescriptionsPage() {
  const user = useAuth((s) => s.user);
  const addPrescription = useAuth((s) => s.addPrescription);
  const prescriptions = useAuth((s) => s.prescriptions);
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate({ to: "/auth" }); }, [user, navigate]);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8">
      <div className="mb-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
          Pharmacy Services
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827] md:text-3xl">
          Upload Your Prescription
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          A registered Plus2 pharmacist will review your script within 2 hours
          (Mon–Sat 8am–6pm).
        </p>
      </div>
      <UploadWizard onSubmit={addPrescription} />
      {prescriptions.length > 0 && (
        <RecentScripts list={prescriptions.slice(0, 3)} />
      )}
    </div>
  );
}

function UploadWizard({
  onSubmit,
}: {
  onSubmit: ReturnType<typeof useAuth.getState>["addPrescription"];
}) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [files, setFiles] = useState<LocalFile[]>([]);

  // step 2
  const [forSelf, setForSelf] = useState(true);
  const [patient, setPatient] = useState("");
  const [relationship, setRelationship] = useState("Spouse");
  const [doctor, setDoctor] = useState("");
  const [scriptDate, setScriptDate] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeatsLeft, setRepeatsLeft] = useState<number>(1);
  const [notes, setNotes] = useState("");

  // step 3
  const [delivery, setDelivery] = useState<"delivery" | "collect">("delivery");

  // step 4
  const [confirm, setConfirm] = useState(false);

  // step 5
  const [refId, setRefId] = useState<string | null>(null);

  // payment
  const [showPayment, setShowPayment] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const validFiles = files.filter((f) => !f.error);
  const canNext1 = validFiles.length > 0;
  const canNext2 =
    (forSelf || patient.trim().length > 0) && scriptDate.length > 0;
  const canSubmit = confirm;

  const goNext = () =>
    setStep((s) => (s < 5 ? ((s + 1) as 1 | 2 | 3 | 4 | 5) : s));
  const goBack = () =>
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : s));

  const submit = () => {
    const id = onSubmit({
      fileName: validFiles[0]?.file.name ?? "script",
      patientName: forSelf ? "Self" : patient.trim(),
      doctorName: doctor.trim() || "—",
      notes: notes.trim() || undefined,
      files: validFiles.map((f) => ({
        name: f.file.name,
        size: f.file.size,
        type: f.file.type,
        dataUrl: f.preview,
      })),
      forSelf,
      relationship: forSelf ? undefined : relationship,
      scriptDate,
      isRepeat,
      repeatsLeft: isRepeat ? repeatsLeft : undefined,
      delivery,
    });
    setPendingId(id);
    toast.success("Prescription submitted — please complete payment");
    setShowPayment(true);
  };

  const handlePaymentSuccess = (ref: string, method: string) => {
    setPaymentRef(ref);
    setPaymentMethod(method);
    setShowPayment(false);
    setRefId(pendingId);
    setStep(5);
    toast.success("Payment confirmed — prescription order placed");
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
      <Stepper step={step} />
      <div className="p-5 md:p-6">
        {step === 1 && (
          <Step1Files files={files} setFiles={setFiles} />
        )}
        {step === 2 && (
          <Step2Patient
            forSelf={forSelf}
            setForSelf={setForSelf}
            patient={patient}
            setPatient={setPatient}
            relationship={relationship}
            setRelationship={setRelationship}
            doctor={doctor}
            setDoctor={setDoctor}
            scriptDate={scriptDate}
            setScriptDate={setScriptDate}
            isRepeat={isRepeat}
            setIsRepeat={setIsRepeat}
            repeatsLeft={repeatsLeft}
            setRepeatsLeft={setRepeatsLeft}
            notes={notes}
            setNotes={setNotes}
          />
        )}
        {step === 3 && (
          <Step3Delivery
            delivery={delivery}
            setDelivery={setDelivery}
          />
        )}
        {step === 4 && (
          <Step4Review
            files={validFiles}
            forSelf={forSelf}
            patient={patient}
            relationship={relationship}
            doctor={doctor}
            scriptDate={scriptDate}
            isRepeat={isRepeat}
            repeatsLeft={repeatsLeft}
            delivery={delivery}
            confirm={confirm}
            setConfirm={setConfirm}
          />
        )}
        {step === 5 && refId && (
          <Step5Success
            refId={refId}
            paymentRef={paymentRef}
            paymentMethod={paymentMethod}
          />
        )}
      </div>

      {step < 5 && (
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-[#E5E7EB] bg-white p-4 md:rounded-b-lg">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < 4 && (
            <button
              disabled={
                (step === 1 && !canNext1) ||
                (step === 2 && !canNext2)
              }
              onClick={goNext}
              className="flex-1 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 md:flex-initial md:px-8"
            >
              {step === 1
                ? "Next: Patient Details"
                : step === 2
                ? "Next: Delivery"
                : "Next: Review"}
            </button>
          )}
          {step === 4 && (
            <button
              disabled={!canSubmit}
              onClick={submit}
              className="flex-1 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 md:flex-initial md:px-8"
            >
              Submit Prescription & Pay
            </button>
          )}
        </div>
      )}

      {showPayment && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          amount={delivery === "delivery" ? 15.00 : 10.00}
          orderId={pendingId ?? "P2-NEW"}
          rxRef={pendingId ?? undefined}
          orderType="Prescription"
          itemSummary={
            `Prescription medication · ` +
            `${validFiles.length} script file${validFiles.length !== 1 ? "s" : ""} · ` +
            `${delivery === "delivery" ? "Home Delivery" : "Collect in-store"}`
          }
        />
      )}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Files", "Patient", "Delivery", "Review", "Done"];
  return (
    <div className="flex items-center gap-1 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 py-3 md:px-5">
      {labels.map((l, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={l} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                done
                  ? "bg-primary text-white"
                  : active
                  ? "bg-primary text-white"
                  : "bg-[#E5E7EB] text-[#6B7280]"
              }`}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : idx}
            </div>
            <span
              className={`hidden text-[11px] font-semibold uppercase tracking-wide md:inline ${
                active
                  ? "text-primary"
                  : done
                  ? "text-[#374151]"
                  : "text-[#9CA3AF]"
              }`}
            >
              {l}
            </span>
            {idx < labels.length && (
              <div
                className={`h-px flex-1 ${
                  done ? "bg-primary" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Step 1: Files ----------
function Step1Files({
  files,
  setFiles,
}: {
  files: LocalFile[];
  setFiles: (f: LocalFile[]) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cloudRef = useRef<HTMLInputElement>(null);

  const hasHeic = useMemo(
    () =>
      files.some(
        (f) =>
          /heic|heif/i.test(f.file.type) ||
          /\.(heic|heif)$/i.test(f.file.name)
      ),
    [files]
  );

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const next: LocalFile[] = [...files];
    for (const f of incoming) {
      if (next.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files`);
        break;
      }
      const error =
        f.size > MAX_BYTES ? "File too large — max 10MB" : undefined;
      const local: LocalFile = { id: crypto.randomUUID(), file: f, error };
      if (!error && f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          local.preview = reader.result as string;
          setFiles([...next]);
        };
        reader.readAsDataURL(f);
      }
      next.push(local);
    }
    setFiles(next);
  };

  const remove = (id: string) =>
    setFiles(files.filter((f) => f.id !== id));

  const totalMB = (
    files.reduce((s, f) => s + f.file.size, 0) /
    1024 /
    1024
  ).toFixed(1);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#111827]">
          Add your script
        </h2>
        <p className="text-sm text-[#6B7280]">
          Choose how you'd like to upload — most patients photograph
          their script.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MethodCard
          icon={Camera}
          title="Take a Photo"
          subtitle="Use your phone or webcam to photograph your script"
          onClick={() => cameraRef.current?.click()}
        />
        <MethodCard
          icon={ImageIcon}
          title="Choose from Gallery or Files"
          subtitle="Select a photo, PDF or image saved on your device"
          onClick={() => galleryRef.current?.click()}
        />
        <MethodCard
          icon={Mail}
          title="From Email or Cloud Storage"
          subtitle="Access files from Gmail, Outlook, Google Drive or iCloud"
          onClick={() => cloudRef.current?.click()}
        />
      </div>

      <p className="px-1 text-[11px] text-[#9CA3AF]">
        Tip: In Gmail, open the email with your script → tap the
        attachment → save to Files first, then return here.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add(
            "border-primary",
            "bg-[#F0F9F4]"
          );
        }}
        onDragLeave={(e) =>
          e.currentTarget.classList.remove(
            "border-primary",
            "bg-[#F0F9F4]"
          )
        }
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove(
            "border-primary",
            "bg-[#F0F9F4]"
          );
          handleFiles(e.dataTransfer.files);
        }}
        className="hidden h-[160px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] transition hover:border-primary hover:bg-[#F0F9F4] md:flex"
        onClick={() => galleryRef.current?.click()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-8 w-8 text-[#9CA3AF]" />
          <div className="mt-2 text-sm font-semibold text-[#374151]">
            Or drag &amp; drop files here
          </div>
          <div className="mt-1 text-xs text-[#9CA3AF]">
            Accepts JPG, PNG, PDF — Max 10MB per file
          </div>
        </div>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <input
        ref={cloudRef}
        type="file"
        accept={ACCEPTED}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {hasHeic && (
        <div className="flex items-start gap-2 rounded-md border border-[#FDE68A] bg-[#FEFCE8] p-3 text-xs text-[#854D0E]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            iPhone HEIC format detected — will be converted
            automatically by our system.
          </span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {files.map((f) => (
              <div
                key={f.id}
                className={`relative aspect-square overflow-hidden rounded-lg border bg-[#F9FAFB] ${
                  f.error ? "border-[#DC2626]" : "border-[#E5E7EB]"
                }`}
              >
                {f.preview ? (
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-2 text-center">
                    <FileText className="h-10 w-10 text-primary" />
                    <span className="truncate text-[10px] font-medium text-[#374151]">
                      {f.file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => remove(f.id)}
                  aria-label="Remove"
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#374151] shadow hover:bg-[#FEE2E2] hover:text-[#DC2626]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 rounded-[3px] bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {(f.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                {f.error && (
                  <div className="absolute inset-x-0 bottom-0 bg-[#DC2626] px-2 py-1 text-center text-[10px] font-semibold text-white">
                    {f.error}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7280]">
            <button
              onClick={() => galleryRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-[#F0F9F4] disabled:opacity-50"
              disabled={files.length >= MAX_FILES}
            >
              <Plus className="h-3.5 w-3.5" /> Add Another Script
            </button>
            <span>
              {files.length} file{files.length !== 1 ? "s" : ""}{" "}
              selected (max {MAX_FILES}) · Total: {totalMB} MB
            </span>
          </div>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
        <ShieldCheck className="h-3 w-3 text-primary" /> Files are
        encrypted and only viewed by a registered pharmacist.
      </p>
    </div>
  );
}

function MethodCard({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: typeof Camera;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white px-5 py-4 text-left transition hover:border-primary hover:bg-[#F9FAFB]"
      style={{ minHeight: 80 }}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0F9F4] text-primary">
        <Icon className="h-7 w-7" />
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-[#111827]">
          {title}
        </span>
        <span className="block text-[12px] text-[#6B7280]">
          {subtitle}
        </span>
      </span>
      <ChevronRight className="h-[18px] w-[18px] shrink-0 text-[#9CA3AF]" />
    </button>
  );
}

// ---------- Step 2: Patient ----------
function Step2Patient(props: {
  forSelf: boolean;
  setForSelf: (v: boolean) => void;
  patient: string;
  setPatient: (v: string) => void;
  relationship: string;
  setRelationship: (v: string) => void;
  doctor: string;
  setDoctor: (v: string) => void;
  scriptDate: string;
  setScriptDate: (v: string) => void;
  isRepeat: boolean;
  setIsRepeat: (v: boolean) => void;
  repeatsLeft: number;
  setRepeatsLeft: (v: number) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const {
    forSelf, setForSelf, patient, setPatient,
    relationship, setRelationship, doctor, setDoctor,
    scriptDate, setScriptDate, isRepeat, setIsRepeat,
    repeatsLeft, setRepeatsLeft, notes, setNotes,
  } = props;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#111827]">
          Patient Details
        </h2>
        <p className="text-sm text-[#6B7280]">
          Tell us who this prescription is for.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#374151]">
          Who is this prescription for?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <ToggleBtn active={forSelf} onClick={() => setForSelf(true)}>
            Myself
          </ToggleBtn>
          <ToggleBtn
            active={!forSelf}
            onClick={() => setForSelf(false)}
          >
            Someone else
          </ToggleBtn>
        </div>
      </div>

      {!forSelf && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Patient full name"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required
          />
          <SelectField
            label="Relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            options={["Spouse", "Child", "Parent", "Sibling", "Other"]}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Doctor / Prescriber name (optional)"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        />
        <Field
          label="Date on prescription"
          type="date"
          value={scriptDate}
          onChange={(e) => setScriptDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#374151]">
          Is this a repeat prescription?
        </label>
        <div className="grid grid-cols-2 gap-3">
          <ToggleBtn
            active={!isRepeat}
            onClick={() => setIsRepeat(false)}
          >
            No
          </ToggleBtn>
          <ToggleBtn
            active={isRepeat}
            onClick={() => setIsRepeat(true)}
          >
            Yes
          </ToggleBtn>
        </div>
        {isRepeat && (
          <div className="mt-3">
            <Field
              label="How many repeats remaining?"
              type="number"
              min={1}
              max={12}
              value={repeatsLeft}
              onChange={(e) =>
                setRepeatsLeft(Number(e.target.value) || 1)
              }
            />
          </div>
        )}
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#374151]">
          Notes to pharmacist
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder="Any specific instructions, preferred generic brands, or questions for the pharmacist..."
          className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <span className="mt-1 block text-right text-[10px] text-[#9CA3AF]">
          {notes.length}/300
        </span>
      </label>
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-primary bg-[#F0F9F4] text-primary"
          : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#374151]">
        {label}
      </span>
      <input
        {...rest}
        className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function SelectField({
  label,
  options,
  ...rest
}: {
  label: string;
  options: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#374151]">
        {label}
      </span>
      <select
        {...rest}
        className="w-full rounded-md border border-[#D1D5DB] bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

// ---------- Step 3: Delivery ----------
function Step3Delivery({
  delivery,
  setDelivery,
}: {
  delivery: "delivery" | "collect";
  setDelivery: (v: "delivery" | "collect") => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#111827]">
          Delivery Method
        </h2>
        <p className="text-sm text-[#6B7280]">
          Choose how you'd like to receive your medication once
          dispensed.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <DeliveryOption
          active={delivery === "delivery"}
          onClick={() => setDelivery("delivery")}
          icon={Truck}
          title="Home Delivery"
          subtitle="Delivered to your door within 24 hours · Free over $50"
        />
        <DeliveryOption
          active={delivery === "collect"}
          onClick={() => setDelivery("collect")}
          icon={Store}
          title="Collect in-store"
          subtitle="Ready for collection at your nearest Plus2 branch"
        />
      </div>
    </div>
  );
}

function DeliveryOption({
  active,
  onClick,
  icon: Icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Truck;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${
        active
          ? "border-primary bg-[#F0F9F4]"
          : "border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          active ? "bg-primary text-white" : "bg-[#F0F9F4] text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-[#111827]">
          {title}
        </span>
        <span className="block text-xs text-[#6B7280]">{subtitle}</span>
      </span>
    </button>
  );
}

// ---------- Step 4: Review ----------
function Step4Review(props: {
  files: LocalFile[];
  forSelf: boolean;
  patient: string;
  relationship: string;
  doctor: string;
  scriptDate: string;
  isRepeat: boolean;
  repeatsLeft: number;
  delivery: "delivery" | "collect";
  confirm: boolean;
  setConfirm: (v: boolean) => void;
}) {
  const {
    files, forSelf, patient, relationship, doctor,
    scriptDate, isRepeat, repeatsLeft, delivery,
    confirm, setConfirm,
  } = props;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#111827]">
          Review & Submit
        </h2>
        <p className="text-sm text-[#6B7280]">
          Confirm the details below before submitting to our
          pharmacist.
        </p>
      </div>

      <Section title="Scripts">
        <div className="flex flex-wrap gap-2">
          {files.map((f) => (
            <div
              key={f.id}
              className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F9FAFB]"
            >
              {f.preview ? (
                <img
                  src={f.preview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Patient">
        <DL
          items={[
            [
              "For",
              forSelf
                ? "Myself"
                : `${patient}${relationship ? ` (${relationship})` : ""}`,
            ],
            ["Doctor", doctor || "—"],
            ["Date on script", scriptDate],
            [
              "Repeat",
              isRepeat ? `Yes (${repeatsLeft} remaining)` : "No",
            ],
          ]}
        />
      </Section>

      <Section title="Delivery">
        <p className="text-sm text-[#374151]">
          {delivery === "delivery"
            ? "Home Delivery (to your default address) · $15.00"
            : "Collect from your nearest Plus2 branch · $10.00"}
        </p>
      </Section>

      <Section title="Payment">
        <p className="text-sm text-[#374151]">
          Payment will be collected after submission via EcoCash,
          OneMoney, TeleCash, ZimSwitch or Bank Transfer.
        </p>
      </Section>

      <div className="flex items-start gap-2 rounded-md border border-[#FDE68A] bg-[#FEF3C7] p-3 text-xs text-[#854D0E]">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Important: Ensure your prescription is valid, dated, and
          signed by a registered healthcare professional. Submitting
          a forged script is a criminal offence under Zimbabwean law.
        </span>
      </div>

      <label className="flex cursor-pointer items-start gap-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#00853F]"
        />
        <span className="text-[#374151]">
          I confirm this is a genuine, valid prescription issued by
          a registered healthcare professional.
        </span>
      </label>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-[#E5E7EB] bg-white p-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
        {title}
      </div>
      {children}
    </div>
  );
}

function DL({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="flex gap-2">
          <dt className="text-[#6B7280]">{k}:</dt>
          <dd className="font-medium text-[#111827]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------- Step 5: Success ----------
function Step5Success({
  refId,
  paymentRef,
  paymentMethod,
}: {
  refId: string;
  paymentRef: string | null;
  paymentMethod: string | null;
}) {
  const stages = [
    "Submitted",
    "Under Review",
    "Approved",
    "Being Prepared",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F9F4]">
        <CheckCircle2 className="h-12 w-12 text-primary" />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#111827]">
          Prescription Submitted & Payment Confirmed
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Reference:{" "}
          <span className="font-mono font-semibold text-[#111827]">
            {refId}
          </span>
        </p>
      </div>

      {paymentRef && (
        <div
          className="mx-auto max-w-sm rounded-lg p-4 text-left"
          style={{
            background: "#F0F9F4",
            border: "1px solid #BBF7D0",
          }}
        >
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: "#00853F" }}
          >
            Payment Details
          </p>
          {[
            ["Payment Reference", paymentRef],
            ["Method", paymentMethod ?? "—"],
            ["Status", "Confirmed"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-gray-100 py-1.5 last:border-0"
            >
              <span className="text-xs text-[#6B7280]">{label}</span>
              <span className="text-xs font-semibold text-[#111827]">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="mx-auto max-w-md text-sm text-[#374151]">
        Payment confirmed. Our pharmacist will review your script
        within 2 hours during operating hours (Mon–Sat 8am–6pm).
      </p>

      <div className="overflow-x-auto">
        <ol className="mx-auto flex min-w-[600px] items-center gap-1 px-4">
          {stages.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-1">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  i === 0
                    ? "bg-primary text-white"
                    : "bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  i === 0 ? "text-primary" : "text-[#9CA3AF]"
                }`}
              >
                {s}
              </span>
              {i < stages.length - 1 && (
                <div
                  className={`h-px flex-1 ${
                    i === 0 ? "bg-primary" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-[#6B7280]">
        You'll receive SMS and email updates at each stage.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          to="/track"
          className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Track This Order
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-[#F0F9F4]"
        >
          Upload Another Script
        </button>
      </div>
    </div>
  );
}

// ---------- Recent Scripts ----------
function RecentScripts({
  list,
}: {
  list: {
    id: string;
    status: string;
    fileName: string;
    uploadedAt: string;
  }[];
}) {
  return (
    <div className="mt-8 rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
      <div className="border-b border-[#E5E7EB] px-5 py-4">
        <h2 className="text-base font-bold text-[#111827]">
          Recent Scripts
        </h2>
      </div>
      <ul className="divide-y divide-[#E5E7EB]">
        {list.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 px-5 py-3"
          >
            <FileText className="h-5 w-5 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[#111827]">
                {p.id}
              </div>
              <div className="truncate text-xs text-[#6B7280]">
                {p.fileName} · {p.uploadedAt}
              </div>
            </div>
            <span className="rounded-full bg-[#F0F9F4] px-2 py-0.5 text-[11px] font-semibold text-primary">
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
