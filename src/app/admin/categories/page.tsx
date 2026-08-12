import { createClient } from "@/lib/supabase/server";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { createCategory, deleteCategory } from "@/lib/actions/taxonomy";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy">
        Categories
      </h1>
      <p className="mt-1 text-sm text-slate">
        The categories profiles are classified under.
      </p>

      <div className="mt-8">
        <TaxonomyManager
          items={(data ?? []).map((c) => ({ id: c.id, name: c.name, sub: c.slug }))}
          createAction={createCategory}
          deleteAction={deleteCategory}
        />
      </div>
    </div>
  );
}
