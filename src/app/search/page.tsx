import { redirect } from "next/navigation";

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  const qs = params.toString();
  redirect(`/profiles${qs ? `?${qs}` : ""}`);
}
