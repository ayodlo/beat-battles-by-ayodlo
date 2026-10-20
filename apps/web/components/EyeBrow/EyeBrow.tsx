export default function EyeBrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={` font-semibold ${className ? className : ""}`}>
      {children}
    </div>
  );
}
