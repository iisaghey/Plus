import type { Metadata } from "next";
import { Users, ShieldCheck, Clock, UserCheck, Building2 } from "lucide-react";
import { getAdminStats } from "@/lib/data/admin";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const stats = await getAdminStats();

  const cards = [
    { label: t.admin.home.totalProfiles, value: stats.totalProfiles, icon: Users, accent: "navy" as const },
    { label: t.admin.home.verifiedProfiles, value: stats.verifiedProfiles, icon: ShieldCheck, accent: "emerald" as const },
    { label: t.admin.home.pendingVerification, value: stats.pendingVerification, icon: Clock, accent: "gold" as const },
    { label: t.admin.home.pendingAccountApprovals, value: stats.pendingAccounts, icon: UserCheck, accent: "sky" as const },
    { label: t.admin.home.totalUsers, value: stats.totalUsers, icon: Building2, accent: "teal" as const },
  ];

  return (
    <div>
      <SectionHeader title={t.admin.home.title} subtitle={t.admin.home.subtitle} />

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
