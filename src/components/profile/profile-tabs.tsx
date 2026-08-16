"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Trophy,
  CalendarCheck,
  Plane,
  Mic,
  FileText,
  Lock,
  PlayCircle,
  X,
  Landmark,
} from "lucide-react";
import { cn, formatDateRange, formatMonthYear } from "@/lib/utils";
import { Timeline, type TimelineEntry } from "./timeline";
import type { Tables } from "@/types/database.types";

type Props = {
  bio: Tables<"biographies"> | null;
  careerTimeline: Tables<"career_timeline">[];
  governmentPositions: Tables<"government_positions">[];
  achievements: Tables<"achievements">[];
  activities: Tables<"official_activities">[];
  travel: Tables<"official_travel">[];
  speeches: Tables<"speeches">[];
  media: Tables<"media">[];
  documents: Tables<"documents">[];
  shortBio: string | null;
};

const TABS = [
  "Overview",
  "Biography",
  "Career",
  "Positions",
  "Achievements",
  "Activities",
  "Travel",
  "Speeches",
  "Media",
  "Documents",
  "Timeline",
] as const;

type Tab = (typeof TABS)[number];

export function ProfileTabs(props: Props) {
  const [active, setActive] = useState<Tab>("Overview");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const combinedTimeline: TimelineEntry[] = useMemo(() => {
    type RawEntry = TimelineEntry & { startDate: string | null };

    const fromCareer: RawEntry[] = props.careerTimeline.map((t) => ({
      id: t.id,
      year: t.start_date ? new Date(t.start_date).getFullYear().toString() : "",
      title: t.title,
      subtitle: t.organization,
      location: t.location,
      description: t.description,
      current: t.is_current,
      kind: "Career",
      startDate: t.start_date,
    }));
    const fromGov: RawEntry[] = props.governmentPositions.map((g) => ({
      id: g.id,
      year: g.start_date ? new Date(g.start_date).getFullYear().toString() : "",
      title: g.position_title,
      subtitle: g.institution,
      location: g.country,
      description: g.description,
      current: g.is_current,
      kind: "Government",
      startDate: g.start_date,
    }));

    return [...fromCareer, ...fromGov]
      .sort((a, b) => (b.startDate ?? "").localeCompare(a.startDate ?? ""))
      .map(({ startDate: _startDate, ...entry }) => entry);
  }, [props.careerTimeline, props.governmentPositions]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <div className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b border-mist px-4 sm:mx-0 sm:px-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              "relative shrink-0 whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors",
              active === tab ? "text-teal" : "text-slate hover:text-navy dark:hover:text-white"
            )}
          >
            {tab}
            {active === tab && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-10">
        {active === "Overview" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-lg font-bold text-navy dark:text-white">
                About
              </h2>
              <p className="mt-3 leading-relaxed text-slate">
                {props.shortBio ?? props.bio?.summary ?? "No biography summary published yet."}
              </p>

              {props.achievements.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-heading text-base font-bold text-navy dark:text-white">
                    Recent Achievements
                  </h3>
                  <div className="mt-4 space-y-3">
                    {props.achievements.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 rounded-xl border border-mist p-4"
                      >
                        <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <div>
                          <p className="text-sm font-semibold text-navy dark:text-white">
                            {a.title}
                          </p>
                          <p className="text-xs text-slate">
                            {a.issuing_organization}
                            {a.achievement_date
                              ? ` · ${formatMonthYear(a.achievement_date)}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <StatCard
                label="Career Milestones"
                value={props.careerTimeline.length}
              />
              <StatCard
                label="Government Positions"
                value={props.governmentPositions.length}
              />
              <StatCard label="Achievements" value={props.achievements.length} />
              <StatCard
                label="Media & Documents"
                value={props.media.length + props.documents.length}
              />
            </div>
          </div>
        )}

        {active === "Biography" && (
          <div className="max-w-3xl">
            <h2 className="font-heading text-lg font-bold text-navy dark:text-white">
              Biography
            </h2>
            {props.bio?.content ? (
              <div className="mt-4 space-y-4">
                {props.bio.content.split("\n\n").map((para, i) => (
                  <p key={i} className="leading-relaxed text-slate">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <EmptyState label="No biography has been published yet." />
            )}
          </div>
        )}

        {active === "Career" && (
          <ListSection
            emptyLabel="No career history has been published yet."
            items={props.careerTimeline}
            renderItem={(t) => (
              <EntryCard
                key={t.id}
                icon={Landmark}
                title={t.title}
                subtitle={[t.organization, t.location].filter(Boolean).join(" · ")}
                meta={formatDateRange(t.start_date, t.end_date, t.is_current)}
                description={t.description}
              />
            )}
          />
        )}

        {active === "Positions" && (
          <ListSection
            emptyLabel="No government positions have been published yet."
            items={props.governmentPositions}
            renderItem={(p) => (
              <EntryCard
                key={p.id}
                icon={Landmark}
                title={p.position_title}
                subtitle={[p.institution, p.country].filter(Boolean).join(" · ")}
                meta={formatDateRange(p.start_date, p.end_date, p.is_current)}
                description={p.description}
              />
            )}
          />
        )}

        {active === "Achievements" && (
          <ListSection
            emptyLabel="No achievements have been published yet."
            items={props.achievements}
            renderItem={(a) => (
              <EntryCard
                key={a.id}
                icon={Trophy}
                accent="text-gold"
                title={a.title}
                subtitle={a.issuing_organization}
                meta={formatMonthYear(a.achievement_date)}
                description={a.description}
              />
            )}
          />
        )}

        {active === "Activities" && (
          <ListSection
            emptyLabel="No official activities have been published yet."
            items={props.activities}
            renderItem={(a) => (
              <EntryCard
                key={a.id}
                icon={CalendarCheck}
                title={a.title}
                subtitle={[a.organization, a.location].filter(Boolean).join(" · ")}
                meta={formatMonthYear(a.activity_date)}
                description={a.description}
              />
            )}
          />
        )}

        {active === "Travel" && (
          <ListSection
            emptyLabel="No official travel has been published yet."
            items={props.travel}
            renderItem={(t) => (
              <EntryCard
                key={t.id}
                icon={Plane}
                title={[t.destination_city, t.destination_country].filter(Boolean).join(", ")}
                subtitle={[t.purpose, t.delegation].filter(Boolean).join(" · ")}
                meta={formatDateRange(t.start_date, t.end_date)}
                description={t.description}
              />
            )}
          />
        )}

        {active === "Speeches" && (
          <ListSection
            emptyLabel="No speeches have been published yet."
            items={props.speeches}
            renderItem={(s) => (
              <EntryCard
                key={s.id}
                icon={Mic}
                title={s.title}
                subtitle={[s.event, s.location].filter(Boolean).join(" · ")}
                meta={formatMonthYear(s.speech_date)}
                description={s.summary}
              />
            )}
          />
        )}

        {active === "Media" && (
          <>
            {props.media.length === 0 ? (
              <EmptyState label="No media has been published yet." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {props.media.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => m.external_url && setLightbox(m.external_url)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-mist text-left"
                  >
                    {m.external_url && (
                      <Image
                        src={m.external_url}
                        alt={m.title ?? ""}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    {m.media_type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-navy/30">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3">
                      <p className="line-clamp-1 text-xs font-medium text-white">
                        {m.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {lightbox && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/90 p-6"
                onClick={() => setLightbox(null)}
              >
                <button
                  className="absolute right-6 top-6 text-white/70 hover:text-white"
                  onClick={() => setLightbox(null)}
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="relative h-[70vh] w-full max-w-3xl">
                  <Image
                    src={lightbox}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {active === "Documents" && (
          <ListSection
            emptyLabel="No documents have been published yet."
            items={props.documents}
            renderItem={(d) => (
              <div
                key={d.id}
                className="flex items-start gap-3 rounded-xl border border-mist p-4"
              >
                {d.is_private ? (
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate" />
                ) : (
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy dark:text-white">{d.title}</p>
                  <p className="text-xs text-slate">
                    {[d.category, d.issuing_organization].filter(Boolean).join(" · ")}
                    {d.document_date ? ` · ${formatMonthYear(d.document_date)}` : ""}
                  </p>
                </div>
                {d.verification_status === "verified" && (
                  <span className="shrink-0 rounded-full bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold uppercase text-emerald">
                    Verified
                  </span>
                )}
              </div>
            )}
          />
        )}

        {active === "Timeline" && <Timeline entries={combinedTimeline} />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-mist bg-offwhite p-5">
      <p className="font-heading text-2xl font-bold text-navy dark:text-white">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="py-12 text-center text-sm text-slate">{label}</p>;
}

function ListSection<T>({
  items,
  renderItem,
  emptyLabel,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyLabel: string;
}) {
  if (items.length === 0) return <EmptyState label={emptyLabel} />;
  return <div className="max-w-3xl space-y-3">{items.map(renderItem)}</div>;
}

function EntryCard({
  icon: Icon,
  title,
  subtitle,
  meta,
  description,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string | null;
  meta?: string | null;
  description?: string | null;
  accent?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-mist p-4">
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", accent ?? "text-teal")} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm font-semibold text-navy dark:text-white">{title}</p>
          {meta && <p className="text-xs text-slate">{meta}</p>}
        </div>
        {subtitle && <p className="text-xs text-slate">{subtitle}</p>}
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
