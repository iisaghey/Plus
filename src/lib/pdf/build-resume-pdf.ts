import { jsPDF } from "jspdf";
import type { ProfileResumeData } from "@/lib/actions/resume";

const MARGIN = 48;
const PAGE_WIDTH = 595.28; // A4 pt
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const NAVY: [number, number, number] = [11, 31, 58];
const TEAL: [number, number, number] = [10, 110, 138];
const SLATE: [number, number, number] = [71, 85, 105];

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function buildResumePdf(data: ProfileResumeData) {
  const { profile, biography, careerTimeline, governmentPositions, achievements, activities, travel, speeches } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  function ensureSpace(needed: number) {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function heading(text: string) {
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(text.toUpperCase(), MARGIN, y);
    y += 4;
    doc.setDrawColor(...TEAL);
    doc.setLineWidth(1.2);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 16;
  }

  function bodyText(text: string, size = 9.5, color: [number, number, number] = SLATE) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    ensureSpace(lines.length * (size + 3));
    doc.text(lines, MARGIN, y);
    y += lines.length * (size + 3) + 6;
  }

  function entryTitle(title: string, meta: string) {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(title, MARGIN, y);
    if (meta) {
      const metaWidth = doc.getTextWidth(meta);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...TEAL);
      doc.text(meta, PAGE_WIDTH - MARGIN - metaWidth, y);
    }
    y += 14;
  }

  function entrySubline(text: string) {
    if (!text) return;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    ensureSpace(12);
    doc.text(text, MARGIN, y);
    y += 12;
  }

  // Header
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, PAGE_WIDTH, 110, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${profile.preferred_title ? profile.preferred_title + " " : ""}${profile.full_name}`,
    MARGIN,
    52
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(200, 220, 235);
  if (profile.current_position) doc.text(profile.current_position, MARGIN, 72);
  const orgName = (profile.organizations as { name: string } | null)?.name;
  if (orgName) doc.text(orgName, MARGIN, 88);

  const contactBits = [profile.email, profile.phone, profile.location, profile.website].filter(
    Boolean
  ) as string[];
  if (contactBits.length) {
    doc.setFontSize(9);
    doc.setTextColor(180, 200, 220);
    doc.text(contactBits.join("   |   "), MARGIN, 104);
  }
  y = 132;

  if (profile.verification_status === "verified") {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...TEAL);
    doc.text("VERIFIED PROFILE", MARGIN, y);
    y += 16;
  }

  const bioText = biography?.summary || biography?.content;
  if (bioText) {
    heading("Biography");
    bodyText(bioText);
  }

  if (careerTimeline.length) {
    heading("Career & Leadership Journey");
    for (const entry of careerTimeline) {
      const dateRange = `${formatDate(entry.start_date)} — ${
        entry.is_current ? "Present" : formatDate(entry.end_date)
      }`;
      entryTitle(entry.title, dateRange);
      entrySubline([entry.organization, entry.location].filter(Boolean).join(" · "));
      if (entry.description) bodyText(entry.description);
      y += 4;
    }
  }

  if (governmentPositions.length) {
    heading("Government Positions");
    for (const entry of governmentPositions) {
      const dateRange = `${formatDate(entry.start_date)} — ${
        entry.is_current ? "Present" : formatDate(entry.end_date)
      }`;
      entryTitle(entry.position_title, dateRange);
      entrySubline(
        [entry.institution, entry.government_level, entry.country].filter(Boolean).join(" · ")
      );
      if (entry.description) bodyText(entry.description);
      y += 4;
    }
  }

  if (activities.length) {
    heading("Official Activities & Meetings");
    for (const entry of activities) {
      entryTitle(entry.title, formatDate(entry.activity_date));
      entrySubline([entry.organization, entry.location].filter(Boolean).join(" · "));
      if (entry.description) bodyText(entry.description);
      y += 4;
    }
  }

  if (travel.length) {
    heading("Official Travels");
    for (const entry of travel) {
      const dest = [entry.destination_city, entry.destination_country].filter(Boolean).join(", ");
      const dateRange = `${formatDate(entry.start_date)} — ${formatDate(entry.end_date)}`;
      entryTitle(dest, dateRange);
      entrySubline([entry.purpose, entry.delegation].filter(Boolean).join(" · "));
      if (entry.description) bodyText(entry.description);
      y += 4;
    }
  }

  if (speeches.length) {
    heading("Speeches & Public Communications");
    for (const entry of speeches) {
      entryTitle(entry.title, formatDate(entry.speech_date));
      entrySubline([entry.event, entry.location].filter(Boolean).join(" · "));
      if (entry.summary) bodyText(entry.summary);
      y += 4;
    }
  }

  if (achievements.length) {
    heading("Achievements & Awards");
    for (const entry of achievements) {
      entryTitle(entry.title, formatDate(entry.achievement_date));
      entrySubline([entry.issuing_organization, entry.category].filter(Boolean).join(" · "));
      if (entry.description) bodyText(entry.description);
      y += 4;
    }
  }

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SLATE);
    doc.text(
      `Generated via AqoonsiPlus — ${new Date().toLocaleDateString("en-US", { dateStyle: "medium" })}`,
      MARGIN,
      PAGE_HEIGHT - 24
    );
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN - 60, PAGE_HEIGHT - 24);
  }

  return doc;
}
