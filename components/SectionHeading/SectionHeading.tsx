export default function SectionHeading({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) {
  return (
    <h2
      className={`text-4xl font-bold leading-tight ${classname ? classname : ""}`}
    >
      {children}
    </h2>
  );
}
