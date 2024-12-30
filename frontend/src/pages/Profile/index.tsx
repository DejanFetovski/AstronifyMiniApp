import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";
import TaskIcon from "../../svgs/TaskIcon";
import WalletIcon from "../../svgs/WalletIcon";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();

  const handleClickWallet = () => {
    navigate("/wallet");
  };

  const handleClickTasks = () => {
    navigate("/tasks");
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="horoscope relative h-screen justify-start px-6 py-[30px] pb-[130px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col gap-[20px] h-full overflow-x-hidden overflow-y-scroll">
        <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
          Daily Horoscope
        </h1>

        <div className="flex items-center gap-2">
          <img
            src="assets/images/avatar.png"
            className="rounded-full w-[55px] h-[55px]"
          ></img>
          <div className="flex flex-col gap-2">
            <span className="text-[16px] leading-[21.8px] text-white">
              Romit Kapur
            </span>
            <span className="text-[12px] leading-[16.3px] text-[#FFFFFF99]">
              February 19, 1989
            </span>
          </div>
        </div>

        <div>
          <span className="text-white text-[14px] leading-[24px]">
            Emotions: Emotionally, The day may bring a heightened awareness of
            your needs and desires. The Moon’s sextile to Jupiter provides a
            positive boost to your emotional resilience, helping you to
            articulate...
          </span>
          <span className="text-[13px] leading-[17.7px] underline text-[#03B1FB] pl-2">
            Show More
          </span>
        </div>

        <div className="w-full flex justify-center">
          <img src="assets/images/horoscope.png" className="h-[244px]"></img>
        </div>

        <span className="text-[24px] leading-[43px] tracking-[0.4px] font-bold text-white text-center">
          Pisces
        </span>

        <div className="divider border-[1px] border-[#8B8B8B80] opacity-40 px-[20px]"></div>

        <div className="grid grid-cols-2 text-white gap-[17px]">
          <div
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[rgba(134,134,134,0.5)] to-[rgba(88,88,88,0.5)] border border-[#77777766] rounded-[20px] py-[14px] backdrop-blur-[42px] hover:opacity-50"
            onClick={handleClickTasks}
          >
            <div>
              <TaskIcon />
            </div>
            <span>Tasks</span>
          </div>
          <div
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[rgba(134,134,134,0.5)] to-[rgba(88,88,88,0.5)] border border-[#77777766] rounded-[20px] py-[14px] backdrop-blur-[42px] hover:opacity-50"
            onClick={handleClickWallet}
          >
            <div>
              <WalletIcon />
            </div>
            <span>Wallet</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <BottomBar />
      </div>
    </motion.div>
  );
};

export default Profile;
