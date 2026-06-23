import { createFileRoute } from "@tanstack/react-router";
import { useStaffAuth } from "@/store/staffAuth";
import { SuperAdminDashboard } from "@/components/staff/SuperAdminDashboard";
import { SystemAdminDashboard } from "@/components/staff/SystemAdminDashboard";
import { PharmacistDashboard } from "@/components/staff/PharmacistDashboard";
import { StoreManagerDashboard } from "@/components/staff/StoreManagerDashboard";
import { DispatcherDashboard } from "@/components/staff/DispatcherDashboard";
import { CashierDashboard } from "@/components/staff/CashierDashboard";
import { InventoryDashboard } from "@/components/staff/InventoryDashboard";

export const Route = createFileRoute("/staff/dashboard")({
  validateSearch: (s: Record<string, unknown>) => ({
    view: typeof s.view === "string" ? s.view : undefined,
  }),
  component: StaffDashboard,
});

function StaffDashboard() {
  const staff = useStaffAuth((s) => s.staff);
  const { view } = Route.useSearch();
  if (!staff) return null;

  switch (staff.role) {
    case "system_admin": return <SystemAdminDashboard view={view} />;
    case "super_admin": return <SuperAdminDashboard view={view} />;
    case "pharmacist": return <PharmacistDashboard view={view} />;
    case "store_manager": return <StoreManagerDashboard view={view} />;
    case "dispatcher": return <DispatcherDashboard view={view} />;
    case "cashier": return <CashierDashboard view={view} />;
    case "inventory_clerk": return <InventoryDashboard view={view} />;
    default: return null;
  }
}