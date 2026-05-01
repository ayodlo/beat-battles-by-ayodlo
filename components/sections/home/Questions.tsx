import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SectionContainer from "@/components/SectionContainer/SectionContainer";

export default function Questions() {
  const faqs = [
    {
      question: "How do I enter a battle?",
      answer:
        "Go to the Submit page, upload your beat, and you’re automatically entered into the current battle.",
    },
    {
      question: "Can I vote for my own beat?",
      answer:
        "No. You can vote for any submission except your own to keep things fair.",
    },
    {
      question: "Can I change my vote?",
      answer: "Yes. You can update your vote anytime before the battle closes.",
    },
    {
      question: "How are winners selected?",
      answer:
        "Winners are selected based on votes or manually chosen by the admin.",
    },
  ];

  return (
    <SectionContainer>
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading>Questions</SectionHeading>

        <p className="mt-4 text-neutral-500 dark:text-white/60">
          Everything you need to know about how the battles work.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-neutral-300 p-5 dark:border-white/10"
          >
            <p className="font-semibold text-black dark:text-white">
              {faq.question}
            </p>

            <p className="mt-2 text-sm text-neutral-500 dark:text-white/60">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
