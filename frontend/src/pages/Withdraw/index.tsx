import BottomBar from "../../components/BottomBar";
import GradientBorder from "../../components/GradientBorder";
import ArrowDown from "../../svgs/ArrowDown";
import CopyAddressIcon from "../../svgs/CopyAddressIcon";
import { motion } from "framer-motion";

const Withdraw = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="horoscope relative h-screen px-6 pt-[56px] pb-[130px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0 z-0"
      ></img>
      <div className="h-full flex flex-col justify-start gap-[42px] overflow-x-hidden overflow-y-scroll relative z-10">
        <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
          Withdraw
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col gap-[72px] max-w-[640px]">
            <GradientBorder className="rounded-full w-full" borderWidth={2}>
              <div className="relative">
                <select className="select select-bordered w-full text-white gradient-bg rounded-full">
                  <option
                    selected
                    className="text-[18px] leading-[24.5px] tracking-[0.4px] bg-gray-700"
                  >
                    Astrox
                  </option>
                  <option className="text-[18px] leading-[24.5px] tracking-[0.4px] bg-gray-700">
                    USDT
                  </option>
                </select>
                <div className="absolute top-[40%] right-4">
                  <ArrowDown />
                </div>
              </div>
            </GradientBorder>

            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[11px]">
                <span className="text-white text-[16.8px] leading-[22px] tracking-[-0.34px]">
                  Withdraw Address
                </span>
                <GradientBorder className="rounded-full w-full" borderWidth={2}>
                  <div className="w-full h-[52px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 gradient-bg rounded-full">
                    <input className="w-full text-[20px] leading-[43px] tracking-[0.4px] outline-none bg-transparent"></input>
                    <div>
                      <CopyAddressIcon />
                    </div>
                  </div>
                </GradientBorder>
              </div>

              <div className="flex flex-col gap-[11px]">
                <span className="text-white text-[16.8px] leading-[22px] tracking-[-0.34px]">
                  AstroX Amount
                </span>
                <GradientBorder className="rounded-full w-full" borderWidth={2}>
                  <div className="h-[52px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 gradient-bg rounded-full hover:opacity-50">
                    <input className="text-[20px] leading-[43px] tracking-[0.4px] outline-none bg-transparent"></input>
                    <button className="blueButton h-[40px] w-[86px] px-[10px] text-[14px] leading-[19px] rounded-full">
                      Max
                    </button>
                  </div>
                </GradientBorder>
              </div>
            </div>

            <div className="flex flex-col gap-[9px]">
              <div className="flex flex-col gap-[9px] px-7">
                <GradientBorder className="rounded-full w-full" borderWidth={2}>
                  <div className="mx-[20px] h-[36px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r rounded-full text-[12px] leading-[16.3px] backdrop-blur-2xl">
                    <span>Min Withdraw Amount</span>
                    <span>0.01ASX = $0.10</span>
                  </div>
                </GradientBorder>

                <GradientBorder className="rounded-full w-full" borderWidth={2}>
                  <div className="mx-[20px] h-[36px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r rounded-full text-[12px] leading-[16.3px] backdrop-blur-2xl">
                    <span>Max Total</span>
                    <span>ASX = $...</span>
                  </div>
                </GradientBorder>
              </div>

              <button className="h-[43px] bg-gradient-to-r from-[#9B54DD] to-[#3C94D7F2] rounded-full flex items-center justify-center mt-[10px] hover:opacity-50">
                <span className="text-[16.8px] leading-[22px] tracking-[-0.3px] text-[#FFFFFFBF] mb-1">
                  Withdraw
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Withdraw;
