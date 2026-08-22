import { createClient } from "@/lib/supabase/server";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { createOrganization, deleteOrganization } from "@/lib/actions/taxonomy";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminOrganizationsPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name, country")
    .order("name");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        {t.admin.organizations.title}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {t.admin.organizations.subtitle}
      </p>

      <div className="mt-8">
        <TaxonomyManager
          items={(data ?? []).map((o) => ({ id: o.id, name: o.name, sub: o.country }))}
          createAction={createOrganization}
          deleteAction={deleteOrganization}
          extraField={{ name: "country", placeholder: t.admin.organizations.countryPlaceholder }}
        />
      </div>
    </div>
  );
}
