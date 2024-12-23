import { useState } from "react";

const Welcome = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-[42px] px-10 pt-10">
      {step == 0 ? (
        <>
          <img src="assets/images/stars.png"></img>
          <div className="text-[36px] leading-[38px] tracking-[0.4px] font-bold text-[#EAEAEA] flex flex-col gap-[30px]">
            <span>Start cannot talk without details.....</span>
            <span>Share yours!</span>
          </div>
        </>
      ) : (
        <>
          <img src="assets/images/suns.png"></img>
          <div className="flex flex-col gap-[18px] w-full">
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

            <div className="flex flex-col gap-1">
              <span className="text-[17px] leading-[22px] tracking-[-0.4px] text-[#FFFFFFBF]">
                Date of birth
              </span>
              <div className="grid grid-cols-2 gap-[20px]">
                <div className="border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                  <input
                    className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                    placeholder="DD"
                  ></input>
                </div>

                <div className="border-[1px] border-black bg-[#00000075] [box-shadow:0px_0px_0px_1px_rgba(255,255,255,0.25)] rounded-full py-2 px-3 h-[48px] w-full">
                  <input
                    className="text-[#FFFFFF99] outline-none cursor-pointer bg-transparent border-none text-[14px] leading-[22px] font-light"
                    placeholder="MM"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Welcome;
