type SectionHeadingProps = {
  children: React.ReactNode;
  classname?: string;
};

export default function SectionHeading({
  children,
  classname = "",
}: SectionHeadingProps) {
  return (
    <h2
      className={[
        "text-3xl font-bold leading-tight tracking-tight",
        "sm:text-4xl",
        "lg:text-5xl",
        "text-black dark:text-white",
        classname,
      ].join(" ")}
    >
      {children}
    </h2>
  );
}
