import Image from "next/image";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { createStaffDraft } from "@/lib/actions/profile";

export function EditorHeader({
  name,
  email,
  photoUrl,
}: {
  name: string;
  email: string;
  photoUrl: string | null;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-mist bg-white dark:bg-offwhite p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mist">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="font-heading text-xl font-bold text-slate">
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-xl font-bold text-navy dark:text-white">
              {name}
            </h1>
            <Badge variant="verified" size="sm">
              Active
            </Badge>
          </div>
          <p className="text-sm font-medium text-teal">Content Editor</p>
          <p className="text-xs text-slate">{email}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <LinkButton href="/dashboard/profile" variant="outline" size="sm">
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </LinkButton>
        <StaffDraftForm action={createStaffDraft} triggerLabel="Create New Profile" />
      </div>
    </div>
  );
}
