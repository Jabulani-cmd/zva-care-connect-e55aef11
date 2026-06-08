import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  STAFF_DELIVERIES,
  STAFF_DRIVERS,
  type StaffDelivery,
  type StaffDriver,
} from "@/data/staffDemo";
import { useSharedPrescriptions } from "@/store/sharedPrescriptions";
import { PageHeader, KPI, Card, StatusPill, fmtUSD } from "./shared";
import {
  Truck, MapPin, Phone, Package, CheckCircle2,
  X, Clock, UserCheck, FileText, User,
} from "lucide-react";

const COLUMNS: {
  key: StaffDelivery["status"];
  label: string;
  color: string;
}[] = [
  { key: "Ready to dispatch", label: "Ready to dispatch", color: "#F59E0B" },
  { key: "Assigned", label: "Assigned to driver", color: "#3B82F6" },
  { key: "Out for delivery", label: "Out for delivery", color: "#7C3AED" },
  { key: "Delivered", label: "Delivered", color: "#059669" },
];

export function DispatcherDashboard({ view }: { view?: string }) {
  const [deliveries, setDeliveries] =
    useState<StaffDelivery[]>(STAFF_DELIVERIES);
  const [drivers] = useState<StaffDriver[]>(STAFF_DRIVERS);
  const [assignFor, setAssignFor] =
    useState<StaffDelivery | null>(null);

  // Prescription orders from shared store
  const sharedPrescriptions = useSharedPrescriptions(
    (s) => s.prescriptions
  );
  const assignDriverShared = useSharedPrescriptions(
    (s) => s.assignDriver
  );
  const updateStatusShared = useSharedPrescriptions(
    (s) => s.updateStatus
  );

  // Paid or dispensing prescription orders ready for dispatch
  const rxOrders = sharedPrescriptions.filter(
    (p) =>
      p.status === "Paid" ||
      p.status === "Dispensing" ||
      p.status === "Out for Delivery"
  );

  const [assignRxFor, setAssignRxFor] = useState(
    null as (typeof sharedPrescriptions)[0] | null
  );

  const counts = useMemo(
    () => ({
      ready:
        deliveries.filter((d) => d.status === "Ready to dispatch").length +
        rxOrders.filter(
          (p) => p.status === "Paid" || p.status === "Dispensing"
        ).length,
      inFlight:
        deliveries.filter(
          (d) =>
            d.status === "Assigned" || d.status === "Out for delivery"
        ).length +
        rxOrders.filter((p) => p.status === "Out for Delivery").length,
      delivered: deliveries.filter((d) => d.status === "Delivered")
        .length,
      available: drivers.filter((d) => d.status === "Available").length,
    }),
    [deliveries, drivers, rxOrders]
  );

  const driverById = (id?: string) =>
    drivers.find((d) => d.id === id);

  const assign = (deliveryId: string, driverId: string) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === deliveryId
          ? { ...d, status: "Assigned", driverId
