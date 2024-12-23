import BottomBar from "../../components/BottomBar";
import PlusIcon from "../../svgs/PlusIcon";

const Horoscope = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-start gap-[40px] px-6 pt-[30px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col justify-between min-h-screen py-20">
        <div className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2">
              <img src="assets/images/rocket.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Finance
              </span>
            </div>
            <div className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2">
              <img src="assets/images/panda.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Career
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2">
              <img src="assets/images/relation.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Relationships
              </span>
            </div>
            <div className="text-white flex flex-col items-center justify-between bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-[24px] py-2">
              <img src="assets/images/watch.png"></img>
              <span className="text-[20px] leading-[43px] tracking-[0.4px]">
                Health
              </span>
            </div>
          </div>
        </div>

        <div className="askInput bg-gradient-to-r from-[#9B54DD] to-[#3C94D7F2] flex items-center px-4 rounded-full justify-between">
          <div className="flex gap-2 items-center">
            <PlusIcon />
            <input
              className="text-[14.7px] leading-[43px] traking-[0.4px] text-white outline-none bg-transparent gap-[10px]"
              placeholder="Ask me anything!"
            ></input>
          </div>
          <img src="assets/images/telegram-1.png"></img>
        </div>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default Horoscope;
