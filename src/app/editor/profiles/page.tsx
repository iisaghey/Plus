import { Search } from "lucide-react";
import { searchEditorProfiles } from "@/lib/data/editor";
import { RecentProfilesTable } from "@/components/editor/recent-profiles-table";
import { SectionHeader } from "@/components/dashboard/section-header";
import { StaffDraftForm } from "@/components/dashboard/staff-draft-form";
import { createStaffDraft } from "@/lib/actions/profile";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function EditorProfilesPage(
  props: PageProps<"/editor/profiles">
) {
  const locale = await getServerLocale();
  const t = getDictionary(locale);

  const STATUS_OPTIONS = [
    { value: "", label: t.editorWorkspace.profilesList.statusAll },
    { value: "draft", label: t.editorWorkspace.profilesList.statusDraft },
    { value: "in_progress", label: t.editorWorkspace.profilesList.statusInProgress },
    { value: "incomplete", label: t.editorWorkspace.profilesList.statusIncomplete },
    { value: "submitted", label: t.editorWorkspace.profilesList.statusSubmitted },
    { value: "changes_required", label: t.editorWorkspace.profilesList.statusChangesRequired },
    { value: "editor_approved", label: t.editorWorkspace.profilesList.statusEditorApproved },
    { value: "admin_review", label: t.editorWorkspace.profilesList.statusAdminReview },
    { value: "approved", label: t.editorWorkspace.profilesList.statusApproved },
    { value: "verified", label: t.editorWorkspace.profilesList.statusVerified },
    { value: "published", label: t.editorWorkspace.profilesList.statusPublished },
    { value: "rejected", label: t.editorWorkspace.profilesList.statusRejected },
  ];

  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const profiles = await searchEditorProfiles({ q: q || undefined, status: status || undefined });

  return (
    <div>
      <SectionHeader
        title={t.editorWorkspace.profilesList.title}
        subtitle={t.editorWorkspace.profilesList.subtitle}
        actions={
          <StaffDraftForm
            action={createStaffDraft}
            triggerLabel={t.editorWorkspace.profilesList.createNewProfile}
          />
        }
      />

      <form className="mt-6 flex flex-wrap items-center gap-3" method="get">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-mist bg-white dark:bg-offwhite px-3">
          <Search className="h-4 w-4 shrink-0 text-slate" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder={t.editorWorkspace.profilesList.searchPlaceholder}
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
          {t.editorWorkspace.profilesList.searchButton}
        </button>
      </form>

      <div className="mt-6">
        <RecentProfilesTable
          profiles={profiles}
          title={`${profiles.length} ${
            profiles.length === 1
              ? t.editorWorkspace.profilesList.profileSingular
              : t.editorWorkspace.profilesList.profilePlural
          }`}
        />
      </div>
    </div>
  );
}
