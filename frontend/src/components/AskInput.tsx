import { useState, useEffect, useRef } from "react";

interface Props {
  text: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (event: any) => void;
}

const AskInput = ({ text, onChange, onSendMessage, onKeyDown }: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Function to adjust the height of the textarea dynamically
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to calculate correctly
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  // Adjust height when the text changes
  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <div
      className={`${
        isFocused ? "askInput" : ""
      } bg-gradient-to-r from-[#9B54DD] to-[#3C94D7F2] flex items-center px-4 py-2 rounded-3xl justify-between`}
    >
      <div className="flex gap-2 items-center flex-grow">
        <textarea
          ref={textareaRef}
          className="text-[14.7px] leading-[20px] tracking-[0.4px] text-white outline-none bg-transparent gap-[10px] w-full resize-none overflow-hidden"
          placeholder="Ask me anything!"
          onChange={(event) => {
            onChange(event.target.value);
          }}
          value={text}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(event) => onKeyDown(event)}
          rows={2} // Default minimum height for 2 lines
        ></textarea>
      </div>
      <img
        src="assets/images/telegram-1.png"
        onClick={() => onSendMessage()}
        className="cursor-pointer"
        alt="Send"
      ></img>
    </div>
  );
};

export default AskInput;
