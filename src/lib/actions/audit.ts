import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function logAuditEvent(
  supabase: SupabaseClient<Database>,
  params: {
    actorId: string;
    actorRole: string | null;
    action: string;
    entityType: string;
    entityId: string;
    previousValue?: unknown;
    newValue?: unknown;
  }
) {
  await supabase.from("audit_logs").insert({
    actor_id: params.actorId,
    actor_role: params.actorRole,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    previous_value: (params.previousValue ?? null) as never,
    new_value: (params.newValue ?? null) as never,
    created_by: params.actorId,
  });
}

export async function notifyUser(
  supabase: SupabaseClient<Database>,
  params: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    relatedProfileId?: string;
    actionUrl?: string;
  }
) {
  await supabase.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message ?? null,
    related_profile_id: params.relatedProfileId ?? null,
    action_url: params.actionUrl ?? null,
  });
}
