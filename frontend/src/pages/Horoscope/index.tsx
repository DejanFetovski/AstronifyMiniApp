import { useNavigate } from "react-router-dom";
import AskInput from "../../components/AskInput";
import BottomBar from "../../components/BottomBar";
import GradientBorder from "../../components/GradientBorder";
import { useState } from "react";
import { motion } from "framer-motion";

const Horoscope = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(0);
  const [startQuestion, setStartQuestion] = useState("");

  const handleClickFinance = () => {
    console.log("handleClickFinance");
    setType(1);
    setStartQuestion(
      "Let’s unlock your financial secrets - Where should we start?"
    );
  };
  const handleClickCareer = () => {
    setType(2);
    setStartQuestion(
      "Time to uncover your career magic - What’s on your mind?"
    );
  };
  const handleClickRelation = () => {
    setType(3);
    setStartQuestion(
      "Let’s navigate your love life - What are you curious about?"
    );
  };
  const handleClickHealth = () => {
    setType(4);
    setStartQuestion("Let’s explore your wellness journey.....");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex flex-col justify-start gap-[40px] px-6 pt-[30px] pb-[28px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col justify-center min-h-screen gap-8">
        <div className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div
              className={`${
                type == 1 ? "opacity-50" : ""
              } text-white flex flex-col items-center justify-between gradient-bg border border-[#FE53BB] rounded-[24px] py-2`}
              onClick={handleClickFinance}
            >
              <img src="assets/images/rocket.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Finance
              </span>
            </div>
            <div
              className={`${
                type == 2 ? "opacity-50" : ""
              } text-white flex flex-col items-center justify-between gradient-bg border border-[#FE53BB] rounded-[24px] py-2`}
              onClick={handleClickCareer}
            >
              <img src="assets/images/panda.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Career
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div
              className={`${
                type == 3 ? "opacity-50" : ""
              } text-white flex flex-col items-center justify-between gradient-bg border border-[#FE53BB] rounded-[24px] py-2`}
              onClick={handleClickRelation}
            >
              <img src="assets/images/relation.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Relationships
              </span>
            </div>
            <div
              className={`${
                type == 4 ? "opacity-50" : ""
              } text-white flex flex-col items-center justify-between gradient-bg border border-[#FE53BB] rounded-[24px] py-2`}
              onClick={handleClickHealth}
            >
              <img src="assets/images/watch.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Health
              </span>
            </div>
          </div>
        </div>

        <div className="px-[60px] flex justify-center">
          <GradientBorder className="rounded-full w-[400px]" borderWidth={2}>
            <div className="rounded-full gradient-bg flex items-center justify-between w-[400px] text-white px-4">
              <span className="text-[15px] leading-[15px] tracking-[0.4px]">
                Rewards Points
              </span>
              <span className="text-[19px] leading-[43px] tracking-[0.4px]">
                1000
              </span>
            </div>
          </GradientBorder>
        </div>
        <AskInput
          text={startQuestion}
          onChange={(message) => {
            setStartQuestion(message);
          }}
          onSendMessage={() => {
            console.log("onSendMessage");
            navigate("/agent", {
              state: { type: type, question: startQuestion },
            });
          }}
        ></AskInput>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Horoscope;
