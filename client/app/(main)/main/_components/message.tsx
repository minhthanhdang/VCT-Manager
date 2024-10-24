import { cn } from "@/lib/utils";

interface MessageProps {
  message: string;
  role: "user" | "agent";
}

export const Message = ({
  message,
  role
}: MessageProps) => {

  return (
    <div className=
      "relative max-w-[85%] border-2 rounded-xl flex py-3 px-4">
      <div className={cn(
        "w-full text-white",
        role === "user" ? "border-gray-100 text-right" : "border-black text-left"
      )}>
        {message}
      </div>
    </div>
  )
}