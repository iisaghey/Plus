import type { Metadata } from "next";
import { Users, ShieldCheck, Clock, UserCheck, Building2 } from "lucide-react";
import { getAdminStats } from "@/lib/data/admin";
import { StatCard } from "@/components/dashboard/stat-card";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Profiles", value: stats.totalProfiles, icon: Users, accent: "navy" as const },
    { label: "Verified Profiles", value: stats.verifiedProfiles, icon: ShieldCheck, accent: "emerald" as const },
    { label: "Pending Verification", value: stats.pendingVerification, icon: Clock, accent: "gold" as const },
    { label: "Pending Account Approvals", value: stats.pendingAccounts, icon: UserCheck, accent: "sky" as const },
    { label: "Total Users", value: stats.totalUsers, icon: Building2, accent: "teal" as const },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">Overview</h1>
      <p className="mt-1 text-sm text-slate">
        Platform-wide statistics at a glance.
      </p>

      <StaggerGrid className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon, accent }) => (
          <StaggerItem key={label} hoverLift>
            <StatCard label={label} value={value} icon={icon} accent={accent} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </div>
  );
}
