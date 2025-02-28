import { useLocation, useNavigate } from "react-router-dom";
import AskInput from "../../components/AskInput";
import BackIcon from "../../svgs/BackIcon";
import BubbleMessage from "../../components/BubbleMessage";
import SampleQuestion from "./SampleQuestion";
import { useEffect, useState, useRef  } from "react";
import { motion } from "framer-motion";
import axios from "axios";
interface Message {
  type: number;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Agent = () => {
  const sampleQuestions_agent = [
    "What is the best time to take a major decision? ",
    "How can I find more meaning?",
    "What is my lucky number?",
    "Where does my potential lie?",
  ];

  const sampleQuestions_health = [
    "Am I over-leveraging my stress levels like my trades?",
    "Does my sign say I need more sleep, or am I just blaming the moon?",
    "Should I detox from caffeine—or just double down with more coffee?",
  ];
  const sampleQuestions_finance = [
    "Should I HODL or yeet my coins this week?",
    "Are the stars saying ‘buy the dip’ or ‘cut your losses’ today?",
    "Is my portfolio aligned with the cosmic bull run or about to nosedive?",
  ];
  const sampleQuestions_career = [
    "Am I destined for CEO status or just meme-lord in the crypto world?",
    "Which crypto project should I avoid shilling if I value my karma?",
    "Will I get rugged in my career as badly as I did with that altcoin?",
  ];
  const sampleQuestions_relationship = [
    "Which sign would HODL my heart—and which would dump it at ATH?",
    "Is it a good day to slide into someone’s DMs or will I get left on ‘seen’?",
    "Should I date someone who believes in NFTs or is that a red flag?",
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState(0);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const containerRef = useRef(null);

  const sendMessageAuto = async(inputMessage: string) => {
    const newMessage = { type: 1, message: inputMessage };
    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    const gptResponse = await chatGptResponse(inputMessage);

    if (gptResponse !== "" && gptResponse !== null) {
      const gptReplyMessage = { type: 2, message: gptResponse };
      setAllMessages((prevMessages) => [
        ...prevMessages,
        gptReplyMessage,
      ]);
    }
  }

  const sendMessage = async () => {
    if(inputMessage == "")
      return;
    const newMessage = { type: 1, message: inputMessage };
    setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");

    const gptResponse = await chatGptResponse(inputMessage);

    if (gptResponse !== "" && gptResponse !== null) {
      const gptReplyMessage = { type: 2, message: gptResponse };
      setAllMessages((prevMessages) => [
        ...prevMessages,
        gptReplyMessage,
      ]);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    const { type, question } = location.state;
    setCategory(type);

    sendMessageAuto(question)
  }, [location]);
  const handleBack = () => {
    navigate("/horoscope");
  };
  const handleSelectSampleQuestion = (question: string) => {
    setInputMessage(question);
  };

  const chatGptResponse = async (prompt: any) => {
    const token = localStorage.getItem("authorization");

    const response: any = await axios.post(
      `${API_BASE_URL}/api/chatgpt/chat`,
      { prompt: prompt, categoryId: category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure proper content type
        },
      }
    );

    if (response.status == 200) {
      console.log("[REPLY] >>>>>>>>>>>>>", response.data.replyMessage);
      return response.data.replyMessage;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex flex-col justify-between gap-[20px] px-6 pt-[55px] pb-[28px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0 z-0"
      ></img>
      <div className="" onClick={handleBack}>
        <BackIcon />
      </div>
      <div
        className="relative flex flex-col gap-4 overflow-auto flex-grow z-20"
        ref={containerRef}
      >
        {allMessages.map((msg, index) => {
          if (msg.type == 1)
            return (
              <BubbleMessage message={msg.message} type="start" key={index} />
            );
          else
            return (
              <BubbleMessage message={msg.message} type="end" key={index} />
            );
        })}
      </div>
      <div className="flex flex-col gap-5 relative z-10">
        {allMessages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {category == 0
              ? sampleQuestions_agent.map((ques, index) => (
                  <div
                    onClick={() => handleSelectSampleQuestion(ques)}
                    key={index}
                  >
                    <SampleQuestion question={ques}></SampleQuestion>
                  </div>
                ))
              : category == 1
              ? sampleQuestions_finance.map((ques, index) => (
                  <div
                    onClick={() => handleSelectSampleQuestion(ques)}
                    key={index}
                  >
                    <SampleQuestion question={ques}></SampleQuestion>
                  </div>
                ))
              : category == 2
              ? sampleQuestions_career.map((ques, index) => (
                  <div
                    onClick={() => handleSelectSampleQuestion(ques)}
                    key={index}
                  >
                    <SampleQuestion question={ques}></SampleQuestion>
                  </div>
                ))
              : category == 3
              ? sampleQuestions_relationship.map((ques, index) => (
                  <div
                    onClick={() => handleSelectSampleQuestion(ques)}
                    key={index}
                  >
                    <SampleQuestion question={ques}></SampleQuestion>
                  </div>
                ))
              : sampleQuestions_health.map((ques, index) => (
                  <div
                    onClick={() => handleSelectSampleQuestion(ques)}
                    key={index}
                  >
                    <SampleQuestion question={ques}></SampleQuestion>
                  </div>
                ))}
          </div>
        )}
        <AskInput
          text={inputMessage}
          onChange={(message: string) => {
            setInputMessage(message);
          }}
          onSendMessage={sendMessage}
          onKeyDown={async (event: React.KeyboardEvent) => {
            if (event.key === "Enter") {
              event.preventDefault(); // Prevent any default Enter key behavior (e.g., form submission)
              if (inputMessage.trim()) {
                // Only send if inputMessage is not empty
                setInputMessage(""); // Clear the input after sending
                const newMessage = { type: 1, message: inputMessage };
                setAllMessages((prevMessages) => [...prevMessages, newMessage]);
                // Optionally, handle reply logic here
                const gptResponse = await chatGptResponse(inputMessage);

                if (gptResponse !== "" && gptResponse !== null) {
                  const gptReplyMessage = { type: 2, message: gptResponse };
                  setAllMessages((prevMessages) => [
                    ...prevMessages,
                    gptReplyMessage,
                  ]);
                }
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
};

export default Agent;
