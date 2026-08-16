import { ArrowRight, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 15% 30%, rgba(201,162,39,0.15), transparent 60%), radial-gradient(ellipse 60% 70% at 85% 70%, rgba(56,189,248,0.2), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <Reveal className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-gold">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-balance font-heading text-3xl font-bold text-white sm:text-4xl">
          Build Your Digital Legacy.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-white/70">
          Build your AqoonsiPlus digital profile and preserve your leadership
          journey, achievements, and professional record in one trusted
          digital home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/create-profile" variant="gold" size="lg">
            Create Your Profile
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/profiles" variant="outline-white" size="lg">
            Explore Profiles
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}
