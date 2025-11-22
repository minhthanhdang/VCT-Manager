import { cn } from "@/lib/utils";

interface MessageProps {
  message: string;
  role: "user" | "agent";
}

export const Message = ({ message, role }: MessageProps) => {
  return (
    <div className="relative flex items-start gap-4">
      {role === "agent" && (
        <div
          className="relative min-w-8 min-h-8 bg-no-repeat bg-contain mt-2"
          style={{ backgroundImage: "url('chat_logo.png')" }}
        />
      )}
      <div className="relative border-2 rounded-xl flex py-3 px-4">
        <div
          className={cn(
            "w-full font-medium whitespace-pre-line",
            role === "user"
              ? "border-gray-100 text-right"
              : "border-black text-left"
          )}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
