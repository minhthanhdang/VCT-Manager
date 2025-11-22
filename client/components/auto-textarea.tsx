import { useRef, useState, useEffect } from "react";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { on } from "events";

interface AutoExpandingTextareaProps {
  onSubmit: any;
}

export default function AutoExpandingTextarea({
  onSubmit,
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>("");

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      const maxHeight =
        8 * parseFloat(getComputedStyle(textareaRef.current).lineHeight);

      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = "auto"; // Enable scrolling
      } else {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.style.overflowY = "hidden"; // Hide scroll when not needed
      }
    }
  };

  useEffect(() => {
    resizeTextarea(); // Adjust on mount in case of pre-filled text
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    resizeTextarea();
  };

  return (
    <div className="w-full relative flex flex-col bg-white border border-gray-300 rounded-2xl overflow-hidden px-2 py-3 focus:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-md transition-shadow ">
      <textarea
        ref={textareaRef}
        className="w-full px-2  resize-none focus:outline-none"
        rows={1}
        value={value}
        onChange={handleChange}
      />
      <div className="w-full relative flex justify-end items-center">
        <button
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full bg-foreground focus:outline-none"
          onClick={() => {
            onSubmit({ prompt: value });
            setValue("");
            resizeTextarea();
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          <ArrowUpIcon className="text-background w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
