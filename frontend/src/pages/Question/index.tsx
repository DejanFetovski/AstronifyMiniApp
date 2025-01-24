import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../../main";

const Question = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);
  // console.log("Question - userInfo", userInfo);

  const [step, setStep] = useState(0);
  const [pathSelection, setPathSelection] = useState(0);
  const [walkSelection, setWalkSelection] = useState(0);
  const [boxSelection, setBoxSelection] = useState(0);

  const navigate = useNavigate();
  const handleClick = () => {
      switch (step) {
        case 0:
          setUserInfo((prev : any) => ({
            ...prev,
            setting: {
              ...prev.setting,
              question1: pathSelection,
            },
          }));
          console.log("Question-index.tsx - Option1 selected", userInfo);
          break;
        case 1:
          setUserInfo((prev: any) => ({
            ...prev,
            setting: {
              ...prev.setting,
              question2: walkSelection,
            },
          }));
          console.log("Question-index.tsx - Option2 selected", userInfo);
          break;
        case 2:
          setUserInfo((prev: any) => ({
            ...prev,
            setting: {
              ...prev.setting,
              question3: boxSelection,
            },
          }));
          console.log("Question-index.tsx - Option3 selected", userInfo);
          navigate("/welcome");
          return
          break;
      }

      setStep((prev) => prev + 1);
  };

  const handlePathSelection = (value: number) => {
    setPathSelection(value);
  };

  const handleWalkSelection = (value: number) => {
    setWalkSelection(value);
  };
  
  const handleBoxSelection = (value: number) => {
    setBoxSelection(value);
  };

  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-start gap-[20px] px-10 pt-10"
    >
      {step == 0 ? (
        <>
          <img src="assets/images/tree.png" alt="tree"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white max-w-[640px]">
            Q. You find yourself standing at the edge of a mysterious forest. A
            path splits into two directions. Which way do you go?
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                pathSelection == 1 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handlePathSelection(1);
                handleClick();
              }}
            >
              <img
                src="assets/images/left-path.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Left Path</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                pathSelection == 2 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handlePathSelection(2);
                handleClick();
              }}
            >
              <img
                src="assets/images/right-path.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Right Path</span>
            </div>
          </div>
        </>
      ) : step == 1 ? (
        <>
          <img src="assets/images/forest.png" alt="forest"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white max-w-[640px] mt-[-100px]">
            Q. Walking the sunny path, the warm forest welcomes you. Birds
            chirp, “This is nice, right?” A rustling in the bushes catches your
            ear. Do you:
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                walkSelection == 1 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handleWalkSelection(1);
                handleClick();
              }}
            >
              <img
                src="assets/images/investigate.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Investigate sound</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                walkSelection == 2 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handleWalkSelection(2);
                handleClick();
              }}
            >
              <img
                src="assets/images/keepwalking.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Keep Walking</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <img src="assets/images/box.png" alt="box"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white -mt-12 max-w-[640px]">
            Q. You reach a beautiful clearing with a hidden treasure chest at
            its center. The sun shines, a fresh breeze whispers, "You made it,
            adventurer!" Do you:
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                boxSelection == 1 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handleBoxSelection(1);
                handleClick();
              }}
            >
              <img
                src="assets/images/openchest.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Open the chest</span>
            </div>
            <div
              className={`flex flex-col items-center justify-center border border-[#A6A6A6] ${
                boxSelection == 2 ? "bg-[#F0F0F055]" : "bg-[#F0F0F026]"
              } rounded-[30px] max-w-[176px] p-4`}
              onClick={() => {
                handleBoxSelection(2);
                handleClick();
              }}
            >
              <img
                src="assets/images/closechest.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Leave it alone</span>
            </div>
          </div>
        </>
      )}

      <div className=" absolute bottom-10 flex gap-[8px]">
        <div
          className={`w-[6px] h-[6px] rounded-full ${
            step == 0 ? "bg-[#FE53BB]" : "bg-[#FFFFFF33]"
          }`}
        ></div>
        <div
          className={`w-[6px] h-[6px] rounded-full ${
            step == 1 ? "bg-[#FE53BB]" : "bg-[#FFFFFF33]"
          }`}
        ></div>
        <div
          className={`w-[6px] h-[6px] rounded-full ${
            step == 2 ? "bg-[#FE53BB]" : "bg-[#FFFFFF33]"
          }`}
        ></div>
      </div>
    </motion.div>
  );
};

export default Question;
