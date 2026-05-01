import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import Subscribe from "@/components/Subscribe/Subscribe";

export default function GetNotified() {
  return (
    <SectionContainer>
      <div className="rounded-3xl border border-neutral-300 bg-neutral-50 p-6 sm:p-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:p-10 dark:border-white/10 dark:bg-white/[0.03]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-white/40">
            Updates
          </p>

          <SectionHeading>Stay in the fight</SectionHeading>

          <p className="mt-4 max-w-xl text-neutral-500 dark:text-white/60">
            Get notified when new battles drop, voting opens, and winners are
            announced.
          </p>
        </div>

        <div className="mt-8 lg:mt-0">
          <Subscribe />
        </div>
      </div>
    </SectionContainer>
  );
}
