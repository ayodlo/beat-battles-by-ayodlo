import { BUTTONS_CONFIG } from "@/app/constants";
export default function ButtonGroup({
  buttons,
  tos,
  type = "primary",
}: {
  buttons: string[];
  tos: string[];
  type?: "primary" | "secondary";
}) {
  const { groupTypes } = BUTTONS_CONFIG;
  const classNames = {
    primary: `whitespace-nowrap px-4 py-2 rounded-sm border border-gray-500 bg-black text-white`,
    secondary: `whitespace-nowrap px-4 py-2 rounded-sm border border-gray-500 bg-white text-black`,
  };

  return (
    <div className="flex gap-4 mt-8">
      <button
        className={classNames[groupTypes[type][0] as keyof typeof classNames]}
      >
        {buttons[0]}
      </button>
      <button
        className={classNames[groupTypes[type][1] as keyof typeof classNames]}
      >
        {buttons[1]}
        {type === "secondary" && <span>{" ›"}</span>}
      </button>
    </div>
  );
}
