"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type ActionResult = { error?: string; success?: boolean };

export function TaxonomyManager({
  items,
  createAction,
  deleteAction,
  extraField,
}: {
  items: { id: string; name: string; sub?: string | null }[];
  createAction: (formData: FormData) => Promise<ActionResult>;
  deleteAction: (id: string) => Promise<ActionResult>;
  extraField?: { name: string; placeholder: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Added");
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAction(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Removed");
      router.refresh();
    });
  }

  return (
    <div>
      <form action={handleCreate} className="flex flex-wrap gap-2">
        <input
          name="name"
          required
          placeholder="Name"
          className="min-w-[200px] flex-1 rounded-lg border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
        />
        {extraField && (
          <input
            name={extraField.name}
            placeholder={extraField.placeholder}
            className="w-40 rounded-lg border border-mist px-3 py-2 text-sm focus:border-teal focus:outline-none"
          />
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-aqoonsi disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mist py-8 text-center text-sm text-slate">
            None yet.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-mist px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-navy dark:text-white">{item.name}</p>
                {item.sub && <p className="text-xs text-slate">{item.sub}</p>}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={pending}
                className="text-slate hover:text-red-600 disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
