import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Producer One",
      quote:
        "This platform pushed me to level up my sound. The competition is real.",
    },
    {
      name: "Producer Two",
      quote: "I’ve discovered so many talented producers here. It’s addictive.",
    },
    {
      name: "Producer Three",
      quote:
        "The battles are fun, fair, and the feedback from the community is dope.",
    },
  ];

  return (
    <SectionContainer>
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading>From producers</SectionHeading>

        <p className="mt-4 text-neutral-500 dark:text-white/60">
          Hear what other beat makers think about Beat Battles.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex flex-col justify-between rounded-2xl border border-neutral-300 p-6 dark:border-white/10"
          >
            <p className="text-sm text-neutral-600 dark:text-white/70">
              “{testimonial.quote}”
            </p>

            <p className="mt-6 text-sm font-semibold text-black dark:text-white">
              — {testimonial.name}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
