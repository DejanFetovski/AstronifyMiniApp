import { useLocation, useNavigate } from "react-router-dom";
import AskInput from "../../components/AskInput";
import BackIcon from "../../svgs/BackIcon";
import BubbleMessage from "../../components/BubbleMessage";
import SampleQuestion from "./SampleQuestion";
import { useEffect, useState } from "react";

const Agent = () => {
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
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  useEffect(() => {
    const { type, question } = location.state;
    console.log("start type = ", type);
    console.log("start question = ", question);
    setType(type);
  }, [location]);
  const handleBack = () => {
    navigate("/horoscope");
  };
  const handleSelectSampleQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="relative h-screen flex flex-col justify-between gap-[20px] px-6 pt-[30px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="" onClick={handleBack}>
        <BackIcon />
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto flex-grow">
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
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {type == 1
            ? sampleQuestions_finance.map((ques, index) => (
                <div
                  onClick={() => handleSelectSampleQuestion(ques)}
                  key={index}
                >
                  <SampleQuestion question={ques}></SampleQuestion>
                </div>
              ))
            : type == 2
            ? sampleQuestions_career.map((ques, index) => (
                <div
                  onClick={() => handleSelectSampleQuestion(ques)}
                  key={index}
                >
                  <SampleQuestion question={ques}></SampleQuestion>
                </div>
              ))
            : type == 3
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
        <AskInput
          text={inputMessage}
          onChange={(message: string) => {
            setInputMessage(message);
          }}
          onSendMessage={() => {
            console.log("agent page, onSendMessage");
            setAllMessages((prev) => {
              prev.push({ type: 1, message: inputMessage });
              return prev;
            });
          }}
        />
      </div>
    </div>
  );
};

export default Agent;
