import { createClient } from "@/lib/supabase/server";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { createOrganization, deleteOrganization } from "@/lib/actions/taxonomy";

export default async function AdminOrganizationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name, country")
    .order("name");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">
        Organizations
      </h1>
      <p className="mt-1 text-sm text-slate">
        Institutions and companies profiles can be affiliated with.
      </p>

      <div className="mt-8">
        <TaxonomyManager
          items={(data ?? []).map((o) => ({ id: o.id, name: o.name, sub: o.country }))}
          createAction={createOrganization}
          deleteAction={deleteOrganization}
          extraField={{ name: "country", placeholder: "Country" }}
        />
      </div>
    </div>
  );
}
