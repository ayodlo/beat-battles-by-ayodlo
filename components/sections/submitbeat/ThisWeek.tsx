import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup";
import { BUTTONS_CONFIG } from "@/app/constants";
import EyeBrow from "@/components/EyeBrow/EyeBrow";

export default function ThisWeek() {
  const { buttons, tos } = BUTTONS_CONFIG.submit;

  return (
    <SectionContainer>
      <div className="space-y-6 max-w-2xl">
        <EyeBrow className="text-left text-muted-foreground">This week</EyeBrow>

        <SectionHeading>Download the sample and read the rules</SectionHeading>

        <p className="text-muted-foreground">
          The sample is your starting point. Listen to it. Understand it. Then
          make it yours.
        </p>

        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Download the sample</li>
          <li>Read the challenge brief</li>
          <li>Watch the tutorial video</li>
        </ul>

        <ButtonGroup buttons={buttons} tos={tos} type="secondary" />
      </div>
    </SectionContainer>
  );
}
