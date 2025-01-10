import BottomBar from "../../components/BottomBar";
import GradientBorder from "../../components/GradientBorder";
import ArrowDown from "../../svgs/ArrowDown";
import CopyIcon from "../../svgs/CopyIcon";
import { motion } from "framer-motion";

const Deposit = () => {
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
          Deposit
        </h1>
        <div className="flex flex-col">
          <div className="h-[52px] text-white px-[20px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
            <span className="text-[18px] leading-[24.5px] tracking-[0.4px]">
              Astrox
            </span>
            <div>
              <ArrowDown />
            </div>
          </div>
          <div className="flex flex-col mt-[-50px] w-full">
            <img src="assets/images/points.png" className=""></img>
            <span className="text-center text-white text-[18px] leading-[24.5px] w-full mt-[-80px] break-words">
              5X2E9nYkURBXdqSuWVgibviAY9EsMiC67XSWFvsAvT26
            </span>
            <div className="flex justify-around w-full mt-4">
              <GradientBorder className={``} borderWidth={2} radius={24}>
                <div className="gradient-bg flex flex-col items-center justify-center p-4 rounded-[24px] gap-1 w-[71px] h-[71px]">
                  <CopyIcon />
                  <span className="text-[16px] leading-[21.8px] text-white">
                    Copy
                  </span>
                </div>
              </GradientBorder>

              <GradientBorder className={``} borderWidth={2} radius={24}>
                <div className="gradient-bg flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] rounded-[24px] gap-1 w-[71px] h-[71px]">
                  <img src="assets/images/share.png"></img>
                  <span className="text-[16px] leading-[21.8px] text-white">
                    Share
                  </span>
                </div>
              </GradientBorder>
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

export default Deposit;
