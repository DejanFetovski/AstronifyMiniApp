interface Props {
  message: string;
  type: string;
}

export default function BubbleMessage({ message, type }: Props) {
  return (
    <div className={`chat ${type == "start" ? "chat-start" : "chat-end"}`}>
      <div
        className={`chat-bubble ${
          type == "start"
            ? "bg-[#03B1FB]"
            : "bg-[#8b226222] border border-[#8b2262]"
        } text-[15px] leading-[20.4px]`}
      >
        <p className="break-words">{message}</p>
      </div>
      <div className="chat-footer">
        <time className="text-[#8A9099] text-[12px] leading-[16.34px]">
          2 hour ago
        </time>
      </div>
    </div>
  );
}
