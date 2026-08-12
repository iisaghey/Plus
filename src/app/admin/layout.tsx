import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Users, BadgeCheck, LayoutDashboard } from "lucide-react";
import { getStaffContext } from "@/lib/auth/staff";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/approvals", label: "Account Approvals", icon: Users },
  { href: "/admin/verification", label: "Verification", icon: BadgeCheck },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isStaff, role } = await getStaffContext();
  if (!user) redirect("/login");
  if (!isStaff) redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="rounded-2xl border border-mist p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate">
            <ShieldCheck className="h-4 w-4 text-teal" />
            Staff Panel
          </div>
          <p className="mt-1 text-xs capitalize text-slate">
            {role?.replace("_", " ")}
          </p>
          <nav className="mt-4 flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-navy hover:bg-offwhite"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
