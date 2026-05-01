import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";

export default function SubmitIntro() {
  return (
    <SectionContainer>
      <div className="max-w-2xl space-y-4">
        <SectionHeading>Submit your beat</SectionHeading>
        <p className="text-muted-foreground">
          This week&apos;s battle waits for no one. Make your move.
        </p>
      </div>
    </SectionContainer>
  );
}
