import { useNavigate } from "react-router-dom";
import BottomBar from "../../components/BottomBar";

const Tasks = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex flex-col justify-start items-center gap-[40px] px-6 pt-[60px] pb-[28px]">
      <img
        src="assets/images/diagram.png"
        className="absolute top-0 right-0"
      ></img>
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-[6px]">
          <span className="text-[20px] leading-[28px] text-white">
            4 Tasks Available
          </span>
          <span className="text-[13px] text-[#FFFFFFB2]">
            Complete Tasks - Receive Points
          </span>
        </div>
      </div>
      <div className="relative w-[384px] h-full">
        <div className="absolute -top-3 left-0 w-full h-[50px] bg-gradient-to-r from-[rgba(254, 83, 187, 1)] to-[rgba(3, 177, 251, 1)] blur-3xl"></div>
        <img src="assets/images/tasks-bg.png" className="h-full"></img>
        <div className="flex justify-center">
          <img src="assets/images/medal.png" className="absolute top-3"></img>
        </div>
        <div className="absolute left-0 right-0 top-0 bottom-0 w-full h-full flex flex-col p-5 pt-20 gap-6">
          <div className="flex justify-between">
            <div className="flex flex-col justify-between">
              <span className="text-white text-[14.7px] leading-[20px]">
                Daily login bonus
              </span>
              <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                +500 Points
              </span>
            </div>
            <img
              src="assets/images/start-btn.png"
              onClick={() => {
                navigate("/horoscope");
              }}
            ></img>
          </div>

          <div className="colorDivider"></div>

          <div className="flex justify-between">
            <div className="flex flex-col justify-between">
              <span className="text-white text-[14.7px] leading-[20px]">
                Engage with AI Agent - 2 Prompts
              </span>
              <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                +1200 Points
              </span>
            </div>
            <img
              src="assets/images/start-btn.png"
              onClick={() => {
                navigate("/horoscope");
              }}
            ></img>
          </div>
          <div className="colorDivider"></div>

          <div className="flex justify-between">
            <div className="flex flex-col justify-between">
              <span className="text-white text-[14.7px] leading-[20px]">
                Get your daily horoscope reading
              </span>
              <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                +750 Points
              </span>
            </div>
            <img
              src="assets/images/start-btn.png"
              onClick={() => {
                navigate("/horoscope");
              }}
            ></img>
          </div>
          <div className="colorDivider"></div>
          <div className="flex justify-between">
            <div className="flex flex-col justify-between">
              <span className="text-white text-[14.7px] leading-[20px]">
                Share with 1 friend
              </span>
              <span className="text-[14.7px] leading-[20px] tracking-[0.4px] text-[#FE53BB]">
                +1200 Points
              </span>
            </div>
            <img
              src="assets/images/start-btn.png"
              onClick={() => {
                navigate("/horoscope");
              }}
            ></img>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <BottomBar />
      </div>
    </div>
  );
};

export default Tasks;
