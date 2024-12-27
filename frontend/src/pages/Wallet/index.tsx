import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import { motion } from "framer-motion";

const Wallet = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="horoscope relative min-h-screen flex flex-col justify-start gap-[42px] px-6 pt-[56px] pb-[28px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
        Connect Wallet
      </h1>
      <div className="flex flex-col px-[10px]">
        <div className="flex flex-col gap-[36px]">
          <div className="relative flex flex-col">
            <img src="assets/images/wallet-bg.png"></img>
            <div className="absolute top-0 left-0 right-0 w-full h-full flex flex-col justify-center px-4">
              <span className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
                Available Ballance
              </span>
              <span className="text-[52px] font-bold leading-[71px] text-white">
                $0
              </span>
            </div>
            <img
              src="assets/images/wallet.png"
              className="absolute bottom-4 -right-8"
            ></img>
          </div>
          <div className="grid grid-cols-2 gap-4 text-white text-[14px] leading-[19px]">
            <button
              className="greenButton py-[10px] rounded-full"
              onClick={() => {
                navigate("/withdraw");
              }}
            >
              Withdraw
            </button>
            <button
              className="blueButton py-[10px] rounded-full"
              onClick={() => {
                navigate("/deposit");
              }}
            >
              Deposit
            </button>
          </div>
          <div className="divider"></div>

          <div className="text-white px-[30px] py-[8px] flex items-center gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
            <span className="text-[20px] leading-[43px] tracking-[0.4px]">
              Astrox:
            </span>
            <span className="text-[24px] leading-[43px] tracking-[0.4px] font-bold">
              0
            </span>
          </div>

          <div className="text-white px-[30px] py-[8px] flex items-center gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
            <span className="text-[20px] leading-[43px] tracking-[0.4px]">
              USDT:
            </span>
            <span className="text-[24px] leading-[43px] tracking-[0.4px] font-bold">
              0
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Wallet;
