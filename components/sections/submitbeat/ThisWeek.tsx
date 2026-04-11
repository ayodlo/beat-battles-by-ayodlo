import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import EyeBrow from "@/components/EyeBrow/EyeBrow";

export default function ThisWeek() {
  const { buttons, tos } = BUTTONS_CONFIG.submit;
  return (
    <SectionContainer>
      <EyeBrow className="text-left">This week </EyeBrow>
      <SectionHeading>Download the sample and read the rules </SectionHeading>
      <p>
        The sample is your starting point. Listen to it. Understand it. Then
        make it yours.
      </p>
      <ul className="list-disc pl-4">
        <li>Download the sample</li>
        <li>Read the challenge brief</li>
        <li>Watch the tutorial video</li>
      </ul>
      <ButtonGroup buttons={buttons} tos={tos} type={"secondary"} />
    </SectionContainer>
  );
}
