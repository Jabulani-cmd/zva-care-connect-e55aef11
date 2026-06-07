import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStaffAuth } from "@/store/staffAuth";

export const Route = createFileRoute("/staff/")({
  component: StaffIndex,
});

function StaffIndex() {
  const staff = useStaffAuth((s) => s.staff);
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: staff ? "/staff/dashboard" : "/staff/login", replace: true });
  }, [staff, navigate]);
  return null;
}