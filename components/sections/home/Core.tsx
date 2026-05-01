import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";

export default function Core() {
  const items = [
    {
      title: "Submit your beat",
      description: "Upload your best work and enter the battle.",
    },
    {
      title: "Vote on beats",
      description: "Listen and vote on submissions from other producers.",
    },
    {
      title: "Explore past battles",
      description: "Discover winners and revisit past competitions.",
    },
  ];

  return (
    <SectionContainer>
      <div className="mx-auto max-w-5xl text-center">
        <SectionHeading classname="text-center">
          What makes us different
        </SectionHeading>

        <p className="mt-4 text-sm text-neutral-500 md:text-base dark:text-white/60">
          Drop your beat and challenge the community
        </p>
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-neutral-300 p-6 transition hover:border-black dark:border-white/10 dark:hover:border-white"
          >
            <h3 className="text-lg font-semibold">{item.title}</h3>

            <p className="mt-2 text-sm text-neutral-500 dark:text-white/60">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
