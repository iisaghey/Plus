"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  if (!name) return { error: "Name is required." };

  const { error } = await supabase.from("organizations").insert({ name, type, country });
  if (error) return { error: error.message };

  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const { error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name) });
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}
