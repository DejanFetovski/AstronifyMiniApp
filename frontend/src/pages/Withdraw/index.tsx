import BottomBar from "../../components/BottomBar";
import ArrowDown from "../../svgs/ArrowDown";
import CopyAddressIcon from "../../svgs/CopyAddressIcon";

const Withdraw = () => {
  return (
    <div className="horoscope relative min-h-screen flex flex-col justify-start gap-[42px] px-6 pt-[56px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <h1 className="text-[24px] leading-[43px] tracking-[0.4px] text-white">
        Withdraw
      </h1>
      <div className="flex flex-col gap-[72px]">
        <div className="h-[52px] text-white px-[20px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
          <span className="text-[18px] leading-[24.5px] tracking-[0.4px]">
            Astrox
          </span>
          <div>
            <ArrowDown />
          </div>
        </div>
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[11px]">
            <span className="text-white text-[16.8px] leading-[22px] tracking-[-0.34px]">
              Withdraw Address
            </span>
            <div className="h-[52px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
              <input className="text-[20px] leading-[43px] tracking-[0.4px] outline-none bg-transparent"></input>
              <div>
                <CopyAddressIcon />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[11px]">
            <span className="text-white text-[16.8px] leading-[22px] tracking-[-0.34px]">
              AstroX Amount
            </span>
            <div className="h-[52px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r from-[rgba(255,83,188,0.15)] to-[rgba(10,252,212,0.15)] border border-[#FE53BB] rounded-full">
              <input className="text-[20px] leading-[43px] tracking-[0.4px] outline-none bg-transparent"></input>
              <button className="blueButton h-[40px] w-[86px] px-[10px] text-[14px] leading-[19px] rounded-full">
                Max
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[9px]">
          <div className="mx-[20px] h-[36px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r border border-[#FE53BB] rounded-full text-[12px] leading-[16.3px] backdrop-blur-2xl">
            <span>Min Withdraw Amount</span>
            <span>0.01ASX = $0.10</span>
          </div>
          <div className="mx-[20px] h-[36px] text-white px-[10px] py-[4px] flex items-center justify-between gap-4 bg-gradient-to-r border border-[#FE53BB] rounded-full text-[12px] leading-[16.3px] backdrop-blur-2xl">
            <span>Max Total</span>
            <span>ASX = $...</span>
          </div>
          <button className="h-[43px] bg-gradient-to-r from-[#9B54DD] to-[#3C94D7F2] rounded-full flex items-center justify-center mt-[10px]">
            <span className="text-[16.8px] leading-[22px] tracking-[-0.3px] text-[#FFFFFFBF] mb-1">
              Withdraw
            </span>
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default Withdraw;