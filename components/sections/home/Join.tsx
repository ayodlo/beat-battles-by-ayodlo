import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";

const { buttons, tos } = BUTTONS_CONFIG.join;

export default function Join() {
  return (
    <SectionContainer border={true}>
      <SectionHeading>Join the battle now</SectionHeading>
      <p>
        This week&apos;s competition is live and waiting for your submission.
        Download the sample, make something great, and compete.
      </p>
      <ButtonGroup buttons={buttons} tos={tos} />
    </SectionContainer>
  );
}
