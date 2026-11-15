type SectionContainerProps = {
  children: React.ReactNode;
  border?: boolean;
  className?: string;
};

export default function SectionContainer({
  children,
  border = false,
  className = "",
}: SectionContainerProps) {
  return (
    <section className="w-full py-10 md:py-12 lg:py-14">
      <div
        className={[
          "mx-auto w-full max-w-5xl px-6 sm:px-8 lg:px-10",
          border
            ? "rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 text-card-foreground"
            : "",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
}
