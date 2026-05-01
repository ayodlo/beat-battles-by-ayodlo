import SectionContainer from "@/components/SectionContainer/SectionContainer";
import SectionHeading from "@/components/SectionHeading/SectionHeading";

export default function GetInTouch() {
  const contactItems = [
    {
      label: "Email",
      value: "info@beatbattles.com",
    },
    {
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      label: "Location",
      value: "123 Main St, Anytown, USA",
    },
  ];

  const socials = ["Facebook", "Twitter", "Instagram", "YouTube"];

  return (
    <SectionContainer>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionHeading>Get in touch</SectionHeading>

          <p className="mt-4 max-w-xl text-neutral-500 dark:text-white/60">
            Have a question, need support, or want to collaborate? We&apos;re
            here to help.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-300 p-5 dark:border-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
                {item.label}
              </p>

              <p className="mt-3 font-medium text-black dark:text-white">
                {item.value}
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-neutral-300 p-5 sm:col-span-2 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-white/40">
              Socials
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <span
                  key={social}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-white/10"
                >
                  {social}: @beatbattles
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
