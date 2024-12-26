import { useNavigate } from "react-router-dom";
import AskInput from "../../components/AskInput";
import BottomBar from "../../components/BottomBar";
import GradientBorder from "../../components/GradientBorder";
import { useState } from "react";

const Horoscope = () => {
  const navigate = useNavigate();
  const [startQuestion, setStartQuestion] = useState("");

  const handleClickFinance = () => {
    console.log("handleClickFinance");
    setStartQuestion(
      "Let’s unlock your financial secrets - Where should we start?"
    );
  };
  const handleClickCareer = () => {
    setStartQuestion(
      "Time to uncover your career magic - What’s on your mind?"
    );
  };
  const handleClickRelation = () => {
    setStartQuestion(
      "Let’s navigate your love life - What are you curious about?"
    );
  };
  const handleClickHealth = () => {
    setStartQuestion("Let’s explore your wellness journey.....");
  };

  const onSendMessage = () => {
    navigate("/agent");
  };
  return (
    <div className="relative min-h-screen flex flex-col justify-start gap-[40px] px-6 pt-[30px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col justify-between min-h-screen py-20">
        <div className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div
              className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2"
              onClick={handleClickFinance}
            >
              <img src="assets/images/rocket.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Finance
              </span>
            </div>
            <div
              className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2"
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
              className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2"
              onClick={handleClickRelation}
            >
              <img src="assets/images/relation.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Relationships
              </span>
            </div>
            <div
              className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2"
              onClick={handleClickHealth}
            >
              <img src="assets/images/watch.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Health
              </span>
            </div>
          </div>
        </div>

        <div className="px-[60px]">
          <GradientBorder className="rounded-full" borderWidth={2}>
            <div className="rounded-full gradient-bg flex items-center justify-between text-white px-4">
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
          onSendMessage={() => onSendMessage}
        ></AskInput>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default Horoscope;
