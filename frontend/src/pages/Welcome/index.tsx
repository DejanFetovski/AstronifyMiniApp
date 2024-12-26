import { useState } from "react";
import MaleIcon from "../../svgs/MaleIcon";
import ArrowDown from "../../svgs/ArrowDown";
import FemaleIcon from "../../svgs/FemaleIcon";
import ActionButton from "../../components/ActionButton";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/profile");
  };
  const handleBgClick = () => {
    setStep(1);
  };

  const [sexSelection, setSexSelection] = useState(0);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start gap-[42px] px-10 pt-10"
      onClick={handleBgClick}
    >
      {step == 0 ? (
        <>
          <img src="assets/images/stars.png" className="scale-125"></img>
          <div className="text-[36px] leading-[38px] tracking-[0.4px] font-bold text-[#EAEAEA] flex flex-col gap-[30px]">
            <span>Start cannot talk without details.....</span>
            <span>Share yours!</span>
          </div>
        </>
      ) : (
        <>
          <img src="assets/images/suns.png"></img>
          <div className="flex flex-col gap-[18px] w-full  items-start">
            <div className="flex flex-col w-full gap-1">
              <span className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]">
                Your Name
              </span>
              <div className="border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                <input
                  className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                  placeholder="Enter your name here"
                ></input>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <span className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]">
                Date of birth
              </span>
              <div className="grid grid-cols-2 gap-[20px]">
                <div className="relative flex items-center border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                  <input
                    className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                    placeholder="DD"
                  ></input>
                  <div className="absolute right-3">
                    <ArrowDown />
                  </div>
                </div>

                <div className="relative flex items-center border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                  <input
                    className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                    placeholder="MM"
                  ></input>
                  <div className="absolute right-3">
                    <ArrowDown />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#00000066] border-[1px] border-black [box-shadow: 0px_0px_0px_1px_rgba(187, 167, 167, 0.15)] rounded-full grid grid-cols-2 p-1 gap-3">
              <div
                className={`${
                  sexSelection == 0
                    ? "bg-[rgb(254,83,187)] text-white"
                    : "bg-transparent text-[#737B84BF]"
                } flex items-center p-2 rounded-full gap-2 pr-4 text-[16.7px] leading-[22px] tracking-[-0.34px] w- `}
                onClick={() => setSexSelection(0)}
              >
                <FemaleIcon active={sexSelection == 0 ? true : false} />
                <span>Female</span>
              </div>
              <div
                className={`${
                  sexSelection == 1
                    ? "bg-[rgb(254,83,187)] text-white"
                    : "bg-transparent text-[#737B84BF]"
                } flex items-center justify-center p-2 rounded-full gap-2 pr-4 text-[16.7px] leading-[22px] tracking-[-0.34px] `}
                onClick={() => setSexSelection(1)}
              >
                <MaleIcon active={sexSelection == 1 ? true : false} />
                <span>Male</span>
              </div>
            </div>

            <div className="w-full flex items-center justify-center mt-4">
              <ActionButton
                className="w-[167px] h-[40px] flex justify-center items-center"
                onClick={handleClick}
              >
                {<span className="text-[14px] text-white">Next</span>}
              </ActionButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Welcome;
