"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/database.types";

export function NotificationList({
  notifications,
}: {
  notifications: Tables<"notifications">[];
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function markRead(id: string) {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      router.refresh();
    });
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-mist py-16 text-center">
        <Bell className="mx-auto h-8 w-8 text-slate/40" />
        <p className="mt-3 text-sm text-slate">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => {
        const content = (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              n.is_read ? "border-mist" : "border-teal/30 bg-teal/5"
            }`}
          >
            {!n.is_read && <Circle className="mt-1 h-2 w-2 shrink-0 fill-teal text-teal" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy dark:text-white">{n.title}</p>
              {n.message && <p className="mt-0.5 text-xs text-slate">{n.message}</p>}
              <p className="mt-1 text-[11px] text-slate/70">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        );

        return n.action_url ? (
          <Link key={n.id} href={n.action_url} onClick={() => !n.is_read && markRead(n.id)}>
            {content}
          </Link>
        ) : (
          <button
            key={n.id}
            onClick={() => !n.is_read && markRead(n.id)}
            className="block w-full text-left"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
