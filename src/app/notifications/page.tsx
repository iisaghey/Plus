import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationList } from "@/components/dashboard/notification-list";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NotificationsPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        {t.dashboard.notifications.title}
      </h1>
      <div className="mt-8">
        <NotificationList notifications={data ?? []} />
      </div>
    </div>
  );
}
