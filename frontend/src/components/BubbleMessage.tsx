import React, { useEffect, useState } from "react";

interface Props {
  message: string;
  type: string;
}

export default function BubbleMessage({ message, type }: Props) {
  const [creationTime, setCreationTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Format time as YYYY/MM/DD, HH:MM:SS
    const formattedTime = `${year}/${month}/${day}, ${hours}:${minutes}:${seconds}`;
    setCreationTime(formattedTime);
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className={`chat ${type === "start" ? "chat-start" : "chat-end"}`}>
      <div
        className={`chat-bubble ${
          type === "start"
            ? "bg-[#03B1FB]"
            : "bg-[#8b226222] border border-[#8b2262]"
        } text-[15px] leading-[20.4px]`}
      >
        <p className="break-words">{message}</p>
      </div>
      <div className="chat-footer">
        <time className="text-[#8A9099] text-[12px] leading-[16.34px]">
          {creationTime}
        </time>
      </div>
    </div>
  );
}
