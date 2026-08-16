import {
  IdCard,
  BookOpenText,
  GitBranch,
  Landmark,
  Trophy,
  CalendarCheck,
  Plane,
  Mic,
  Images,
  FileText,
  QrCode,
  ShieldCheck,
  RefreshCcw,
  Vault,
  Briefcase,
  Archive,
  Building2,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";

const FEATURES = [
  { icon: IdCard, title: "Digital Leadership Profile" },
  { icon: BookOpenText, title: "Biography Writing" },
  { icon: GitBranch, title: "Career & Leadership Timeline" },
  { icon: Landmark, title: "Government Position Archive" },
  { icon: Trophy, title: "Achievement Documentation" },
  { icon: CalendarCheck, title: "Official Activities Management" },
  { icon: Plane, title: "Official Travel Archive" },
  { icon: Mic, title: "Speech Archive" },
  { icon: Images, title: "Media Management" },
  { icon: FileText, title: "Document Management" },
  { icon: QrCode, title: "QR Code Profile" },
  { icon: ShieldCheck, title: "Verified Profile" },
  { icon: RefreshCcw, title: "Profile Updates" },
  { icon: Vault, title: "Secure Digital Archive" },
  { icon: Briefcase, title: "Leadership Portfolio" },
  { icon: Archive, title: "Digital Legacy Preservation" },
  { icon: Building2, title: "Professional Digital Presence" },
];

export function PlatformFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel className="mx-auto justify-center">
          Platform Features
        </SectionLabel>
        <h2 className="mt-3 font-heading text-3xl font-bold text-navy dark:text-white sm:text-4xl">
          Everything a Digital Legacy Needs
        </h2>
        <p className="mt-3 text-slate">
          Seventeen dedicated modules keep every profile complete, organized,
          and ready to present.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title }, i) => (
          <div
            key={title}
            className="group flex items-start gap-3 rounded-2xl border border-mist p-4 transition-colors hover:border-teal/30 hover:bg-offwhite"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white transition-colors group-hover:bg-teal">
              <Icon className="h-[18px] w-[18px]" />
            </div>
            <div>
              <span className="font-accent text-[10px] font-semibold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-semibold leading-snug text-navy dark:text-white">
                {title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
