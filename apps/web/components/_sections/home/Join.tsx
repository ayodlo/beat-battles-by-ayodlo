import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";

const { buttons, tos } = BUTTONS_CONFIG.join;

export default function Join() {
  return (
    <SectionContainer>
      <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground sm:p-8 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-10">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Ready?
          </p>

          <SectionHeading classname="text-card-foreground">
            Join the battle now
          </SectionHeading>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            This week&apos;s competition is live and waiting for your
            submission. Download the sample, make something great, and compete.
          </p>
        </div>

        <div className="mt-8 lg:mt-0">
          <ButtonGroup buttons={buttons} tos={tos} />
        </div>
      </div>
    </SectionContainer>
  );
}
