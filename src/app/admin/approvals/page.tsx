import type { Metadata } from "next";
import { getPendingAccounts } from "@/lib/data/admin";
import { ApprovalRow } from "@/components/admin/approval-row";

export const metadata: Metadata = { title: "Account Approvals" };

export default async function ApprovalsPage() {
  const accounts = await getPendingAccounts();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        Account Approvals
      </h1>
      <p className="mt-1 text-sm text-slate">
        New sign-ups must be approved before they can create a profile.
      </p>

      <div className="mt-8 space-y-3">
        {accounts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-12 text-center text-sm text-slate">
            No pending accounts.
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
