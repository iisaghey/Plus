import type { Metadata } from "next";
import { getPendingAccounts } from "@/lib/data/admin";
import { ApprovalRow } from "@/components/admin/approval-row";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "Account Approvals" };

export default async function ApprovalsPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const accounts = await getPendingAccounts();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        {t.admin.approvals.title}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {t.admin.approvals.subtitle}
      </p>

      <div className="mt-8 space-y-3">
        {accounts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            {t.admin.approvals.empty}
          </p>
        ) : (
          accounts.map((a) => (
            <ApprovalRow
              key={a.user_id}
              userId={a.user_id}
              email={a.email}
              createdAt={a.created_at}
            />
          ))
        )}
      </div>
    </div>
  );
}
