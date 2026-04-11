import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";

export default function Testimonials() {
  return (
    <SectionContainer>
      <SectionHeading>From producers</SectionHeading>
      <p>Hear what other beat makers think about Beat Battles.</p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">testimonial 1</div>
        <div className="flex flex-col gap-2">testimonial 2</div>
        <div className="flex flex-col gap-2">testimonial 3</div>
      </div>
    </SectionContainer>
  );
}
