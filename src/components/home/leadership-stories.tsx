import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";

export async function LeadershipStories() {
  const supabase = await createClient();
  const { data: bios } = await supabase
    .from("biographies")
    .select(
      `summary, profiles!inner ( slug, full_name, current_position, photo_url, is_public, status )`
    )
    .eq("profiles.is_public", true)
    .eq("profiles.status", "active")
    .not("summary", "is", null)
    .limit(3);

  if (!bios || bios.length === 0) return null;

  return (
    <section className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <SectionLabel light className="mx-auto justify-center">
            Leadership History
          </SectionLabel>
          <h2 className="mt-3 text-center font-heading text-3xl font-bold text-white sm:text-4xl">
            Leadership Histories Worth Preserving
          </h2>
        </Reveal>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {bios.map((bio, i) => {
            const profile = Array.isArray(bio.profiles)
              ? bio.profiles[0]
              : bio.profiles;
            if (!profile) return null;
            return (
              <StaggerItem key={i} hoverLift>
              <Link
                href={`/profile/${profile.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-sky/30 hover:bg-white/[0.07]"
              >
                <Quote className="h-6 w-6 text-gold/70" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/80">
                  {bio.summary}
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-white/10">
                    {profile.photo_url && (
                      <Image
                        src={profile.photo_url}
                        alt={profile.full_name}
                        width={44}
                        height={44}
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-sky transition-colors">
                      {profile.full_name}
                    </p>
                    <p className="text-xs text-white/50">
                      {profile.current_position}
                    </p>
                  </div>
                </div>
              </Link>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
