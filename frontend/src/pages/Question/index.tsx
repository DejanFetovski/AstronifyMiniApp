import { useState } from "react";
import ActionButton from "../../components/ActionButton";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const handleClick = () => {
    if (step == 2) {
      navigate("/welcome");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-[20px] px-10 pt-10">
      {step == 0 ? (
        <>
          <img src="assets/images/tree.png"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white">
            Q. You find yourself standing at the edge of a mysterious forest. A
            path splits into two directions. Which way do you go?
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
              <img
                src="assets/images/left-path.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Left Path</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
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
          <img src="assets/images/forest.png"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white">
            Q. Walking the sunny path, the warm forest welcomes you. Birds
            chirp, “This is nice, right?” A rustling in the bushes catches your
            ear. Do you:
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
              <img
                src="assets/images/investigate.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Investigate sound</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
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
          <img src="assets/images/box.png"></img>
          <span className="text-[16px] leading-[22px] tracking-[0.4px] font-bold text-white -mt-12">
            Q. You reach a beautiful clearing with a hidden treasure chest at
            its center. The sun shines, a fresh breeze whispers, "You made it,
            adventurer!" Do you:
          </span>
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
              <img
                src="assets/images/openchest.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Open the chest</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#A6A6A6] bg-[#F0F0F026] rounded-[30px] w-[176px] p-4">
              <img
                src="assets/images/closechest.png"
                className="-mt-3 h-[100px]"
              ></img>
              <span className="text-[#EAEAEA]">Leave it alone</span>
            </div>
          </div>
        </>
      )}
      <ActionButton
        className="w-[167px] h-[40px] flex justify-center items-center"
        onClick={handleClick}
      >
        {<span className="text-[14px] text-white">Next</span>}
      </ActionButton>
    </div>
  );
};

export default Question;
