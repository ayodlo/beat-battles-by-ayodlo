import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import Subscribe from "@/components/Subscribe/Subscribe";

export default function GetNotified() {
  return (
    <SectionContainer>
      <SectionHeading>Stay in the fight</SectionHeading>
      <p>Get notified when new battles drop and see who&apos;s winning</p>
      <Subscribe />
    </SectionContainer>
  );
}
