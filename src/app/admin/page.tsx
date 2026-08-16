import type { Metadata } from "next";
import { Users, ShieldCheck, Clock, UserCheck, Building2 } from "lucide-react";
import { getAdminStats } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Admin Overview" };

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Profiles", value: stats.totalProfiles, icon: Users },
    { label: "Verified Profiles", value: stats.verifiedProfiles, icon: ShieldCheck },
    { label: "Pending Verification", value: stats.pendingVerification, icon: Clock },
    { label: "Pending Account Approvals", value: stats.pendingAccounts, icon: UserCheck },
    { label: "Total Users", value: stats.totalUsers, icon: Building2 },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">Overview</h1>
      <p className="mt-1 text-sm text-slate">
        Platform-wide statistics at a glance.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-mist p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/5 text-teal">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-heading text-2xl font-bold text-navy dark:text-white">
              {value}
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
