import { createClient } from "@/lib/supabase/server";
import { TaxonomyManager } from "@/components/admin/taxonomy-manager";
import { createCategory, deleteCategory } from "@/lib/actions/taxonomy";
import { getServerLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function AdminCategoriesPage() {
  const locale = await getServerLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-navy dark:text-white">
        {t.admin.categories.title}
      </h1>
      <p className="mt-1 text-sm text-slate">
        {t.admin.categories.subtitle}
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
