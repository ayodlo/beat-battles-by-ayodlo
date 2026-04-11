import { CheckIcon, XIcon } from "lucide-react";

export default function ValidationAlert({
  message,
  type,
}: {
  message: string;
  type: "error" | "success";
}) {
  const textColor = type === "error" ? "text-red-500" : "text-green-500";
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  const borderColor = type === "error" ? "border-red-500" : "border-green-500";
  const icon =
    type === "error" ? (
      <XIcon className="w-4 h-4" />
    ) : (
      <CheckIcon className="w-4 h-4" />
    );
  return (
    <div aria-live="assertive" aria-atomic="true">
      <div className={`${bgColor} ${borderColor} p-2 rounded-md`}>
        <p className={`text-sm ${textColor}`}>{message}</p>
        {icon}
      </div>
    </div>
  );
}
