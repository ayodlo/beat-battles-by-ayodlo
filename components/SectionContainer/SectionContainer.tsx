export default function SectionContainer({
  children,
  border = false,
}: {
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div>
      <div
        className={`space-y-4 px-8 py-8 ${border ? "border border-black" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
