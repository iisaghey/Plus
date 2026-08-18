import { Search } from "lucide-react";
import { searchEditorProfiles } from "@/lib/data/editor";
import { RecentProfilesTable } from "@/components/editor/recent-profiles-table";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { createStaffDraft } from "@/lib/actions/profile";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "in_progress", label: "In Progress" },
  { value: "incomplete", label: "Incomplete" },
  { value: "submitted", label: "Submitted" },
  { value: "changes_required", label: "Changes Required" },
  { value: "editor_approved", label: "Editor Approved" },
  { value: "admin_review", label: "Admin Review" },
  { value: "approved", label: "Approved" },
  { value: "verified", label: "Verified" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
];

export default async function EditorProfilesPage(
  props: PageProps<"/editor/profiles">
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const profiles = await searchEditorProfiles({ q: q || undefined, status: status || undefined });

  return (
    <div>
      <SectionHeader
        title="Profiles"
        subtitle="Search and manage every profile on the platform."
        actions={<StaffDraftForm action={createStaffDraft} triggerLabel="Create New Profile" />}
      />

      <form className="mt-6 flex flex-wrap items-center gap-3" method="get">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-mist bg-white dark:bg-offwhite px-3">
          <Search className="h-4 w-4 shrink-0 text-slate" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name or position…"
            className="w-full min-w-[160px] bg-transparent text-sm text-ink placeholder:text-slate focus:outline-none"
          />
        </div>
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-mist bg-white dark:bg-offwhite px-3 text-sm text-navy dark:text-white focus:border-teal focus:outline-none"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-teal px-6 text-sm font-semibold text-white hover:bg-aqoonsi"
        >
          Search
        </button>
      </form>

      <div className="mt-6">
        <RecentProfilesTable profiles={profiles} title={`${profiles.length} Profile${profiles.length === 1 ? "" : "s"}`} />
      </div>
    </div>
  );
}
