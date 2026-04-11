import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import HomeVideo from "./HomeVideo";

const { buttons, tos } = BUTTONS_CONFIG.hero;

export default function Intro() {
  return (
    <div className="border border-black">
      <HomeVideo />
      <SectionContainer>
        <SectionHeading>Beat battles every two weeks</SectionHeading>
        <p>
          Submit your best work and compete against producers worldwide. Listen,
          vote, and discover the next generation of beat makers.
        </p>
        <ButtonGroup buttons={buttons} tos={tos} />
      </SectionContainer>
    </div>
  );
}
