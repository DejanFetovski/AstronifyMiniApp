import BottomBar from "../../components/BottomBar";
import CopyIcon from "../../svgs/CopyIcon";
import SearchIcon from "../../svgs/SearchIcon";

const Invite = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-start gap-[40px] px-6 pt-[30px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col items-center">
        <img src="assets/images/gold.png"></img>
        <span className="text-[38px] font-light leading-[46.3px] text-white max-w-[300px] text-center -mt-10">
          Earn Rewards Invite Friends
        </span>
        <div className="w-full grid grid-cols-2 gap-4 mt-12">
          <div className="text-white px-[20px] py-[8px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
            <div className="flex flex-col">
              <span className="text-[12px] leading-[16px]">Invite Via</span>
              <span className="text-[16px] leading-[22px]">Telegram</span>
            </div>
            <img src="assets/images/telegram.png"></img>
          </div>
          <div className="text-white px-[20px] py-[8px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
            <div className="flex flex-col">
              <span className="text-[12px] leading-[16px]">Copy</span>
              <span className="text-[16px] leading-[22px]">Referral Link</span>
            </div>
            <CopyIcon />
          </div>
        </div>

        <div className="inviteCard mt-12 border border border-[#FE53BB] ">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[24px] leading-[32.7px] text-white">
              Invite a friend
            </span>
            <SearchIcon />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="assets/images/avatar.png"></img>
              <span className="text-[16px] leading-[21.8px] text-white">
                Tongkun Lee
              </span>
            </div>
            <button className="bg-[#03B1FB] p-3 rounded-2xl">Invite</button>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default Invite;
