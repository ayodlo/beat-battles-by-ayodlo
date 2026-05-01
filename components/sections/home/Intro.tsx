import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import HomeVideo from "./HomeVideo";

const { buttons, tos } = BUTTONS_CONFIG.hero;

export default function Intro() {
  return (
    <div className="w-full">
      {/* Video */}
      <HomeVideo />

      {/* Content */}
      <SectionContainer>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading>Beat battles every two weeks</SectionHeading>

          <p className="mt-5 text-base text-neutral-500 md:text-lg dark:text-white/60">
            Submit your best work and compete against producers worldwide.
            Listen, vote, and discover the next generation of beat makers.
          </p>

          <div className="mt-8 flex justify-center">
            <ButtonGroup buttons={buttons} tos={tos} />
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
