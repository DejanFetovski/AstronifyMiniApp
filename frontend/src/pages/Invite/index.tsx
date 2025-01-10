import { useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import BottomBar from "../../components/BottomBar";
import CopyIcon from "../../svgs/CopyIcon";
import SearchIcon from "../../svgs/SearchIcon";
import { AppContext } from "../../main";

const INVITE_BOT_URL = import.meta.env.VITE_BOT_URL;

const Invite = () => {
  const { userInfo } = useContext(AppContext);

  const tele = (window as any).Telegram.WebApp;
  const userID = tele.initDataUnsafe?.user?.id;
  const inviteCode = `${INVITE_BOT_URL}?start=inviteId${userID}`;

  console.log("[Invite - userID ]", userID);

  const handleClickInvite = () => {
    console.log("handleClickInvite");
    tele.openTelegramLink(
      `https://t.me/share/url?url=${inviteCode}&text="Welcome to Astronify App. You can realize your position in space"`
    );
  };

  const handleCopyReferralLink = () => {
    if (inviteCode) {
      console.log('Text copied to clipboard');
      toast.success('InviteCode copied');
    } else {
      console.error('Could not copy text');
      toast.error(`Could not copy InviteCode`);
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative h-screen px-6 py-[30px] pb-[130px]"
    >
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="h-full flex flex-col items-center overflow-x-hidden overflow-y-scroll">
        <img src="assets/images/gold.png"></img>
        <span className="text-[38px] font-light leading-[46.3px] text-white max-w-[300px] text-center -mt-10">
          Earn Rewards Invite Friends
        </span>
        <div className="w-full grid grid-cols-2 gap-4 mt-12">
          <div
            className="text-white px-[20px] py-[8px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full"
            onClick={handleClickInvite}
          >
            <div className="flex flex-col">
              <span className="text-[12px] leading-[16px]">Invite Via</span>
              <span className="text-[16px] leading-[22px]">Telegram</span>
            </div>
            <img src="assets/images/telegram.png"></img>
          </div>
          <div
            className="text-white px-[20px] py-[8px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full"
            onClick={handleCopyReferralLink}
          >
            <div className="flex flex-col">
              <span className="text-[12px] leading-[16px]">Copy</span>
              <span className="text-[16px] leading-[22px]">Referral Link</span>
            </div>
            <CopyIcon />
          </div>
        </div>

        <div className="inviteCard mt-12 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <input
              className="text-[24px] leading-[32.7px] text-white bg-transparent outline-none w-full"
              placeholder="Invite a friend"
            ></input>
            <SearchIcon />
          </div>
          <div className="flex flex-col max-h-[300px] overflow-scroll gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Tongkun Lee
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl">Invite</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar-2.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Rehmem Khihal
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl">Invite</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar-3.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Fazur Nalim
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl opacity-50">
                Accepted
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar-3.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Fazur Nalim
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl opacity-50">
                Accepted
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar-3.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Fazur Nalim
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl opacity-50">
                Accepted
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="assets/images/avatar-3.png"></img>
                <span className="text-[16px] leading-[21.8px] text-white">
                  Fazur Nalim
                </span>
              </div>
              <button className="bg-[#03B1FB] p-3 rounded-2xl opacity-50">
                Accepted
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

export default Invite;
